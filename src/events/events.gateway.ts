import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ERoleType } from 'src/common/enums';
import { ESocketEvent } from 'src/common/enums/socket.enum';
import { JwtPayload } from 'src/common/interfaces';
import { SocketUser } from 'src/common/interfaces/socket.interface';
import { Repository } from 'typeorm';
import { OrderEntity } from '../database/entities/order.entity';

@WebSocketGateway()
@Injectable()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private connectedUsers: Map<number, SocketUser> = new Map();

  private connected: Map<string, string> = new Map();

  private driverLocations: Map<number, { lat: number; lng: number }> = new Map();

  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    try {
      const accessToken = client.handshake.headers.authorization as string;
      if (!accessToken) throw new BadRequestException('No access token provided');

      const payload = this.jwtService.verify(accessToken) as JwtPayload;
      const { id: userId, type } = payload;

      if (!userId || !type) throw new BadRequestException('Invalid token');

      this.connectedUsers.set(userId, { id: userId, type, socket: client });
      this.connected.set(`${type}-${userId}`, client.id);
      console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} connected:`, userId);

      // Join a room based on the user type
      client.join(`${type}-${userId}`);
    } catch (error) {
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, user] of this.connectedUsers.entries()) {
      if (user.socket === client) {
        this.connectedUsers.delete(userId);
        console.log(`${user.type.charAt(0).toUpperCase() + user.type.slice(1)} disconnected:`, userId);
        break;
      }
    }

    for (const [key, value] of this.connected.entries()) {
      if (value === client.id) {
        this.connected.delete(key);
        break;
      }
    }
  }

  notifyNewOrder(userId: number, order: OrderEntity) {
    const user = this.connectedUsers.get(userId);
    if (!user) return;

    const baseOrderInfo = {
      orderId: order.id,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      notes: order.notes,
    };

    if (user && user.type === 'merchant') {
      user.socket.emit('newOrder', {
        ...baseOrderInfo,
        clientName: order.client.name,
        clientPhone: order.client.phone,
        deliveryAddress: order.deliveryAddress,
      });
    }
  }

  notifyOrderStatus(userId: number, orderId: number, status: string) {
    const user = this.connectedUsers.get(userId);
    if (user && user.type === 'client') {
      user.socket.emit('orderStatus', { orderId, status });
    }
    if (user && user.type === 'merchant') {
      user.socket.emit('orderStatus', { orderId, status });
    }
    if (user && user.type === 'driver') {
      user.socket.emit('orderStatus', { orderId, status });
    }
  }

  notifyNewDelivery(driverId: number, order: OrderEntity) {
    const user = this.connectedUsers.get(driverId);
    if (user && user.type === 'driver') {
      user.socket.emit('newDelivery', {
        orderId: order.id,
        pickupAddress: order.store.address,
        deliveryAddress: order.deliveryAddress,
        deliveryLatitude: order.deliveryLatitude,
        deliveryLongitude: order.deliveryLongitude,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        clientName: order.client.name,
        clientPhone: order.client.phone,
        notes: order.notes,
      });
    }
  }

  async handleOrderUpdated(orderId: number) {
    const order = await this.orderRepository.findOne({
      select: {
        id: true,
        clientId: true,
        driverId: true,
        store: { merchantId: true, staffs: { id: true } },
      },
      where: { id: orderId },
      relations: { store: { staffs: true } },
    });
    if (!order) return;

    const socketIds = [];
    const { clientId, driverId, store } = order;
    const { merchantId, staffs } = store;

    if (clientId) {
      const socketId = this.connected.get(`${ERoleType.Client}-${clientId}`);
      socketId && socketIds.push(socketId);
    }

    if (driverId) {
      const socketId = this.connected.get(`${ERoleType.Driver}-${driverId}`);
      socketId && socketIds.push(socketId);
    }

    if (merchantId) {
      const socketId = this.connected.get(`${ERoleType.Merchant}-${merchantId}`);
      socketId && socketIds.push(socketId);
    }

    staffs?.forEach((staff) => {
      const socketId = this.connected.get(`${ERoleType.Merchant}-${staff.id}`);
      socketId && socketIds.push(socketId);
    });

    socketIds.forEach((socketId) => {
      this.server.to(socketId).emit(ESocketEvent.OrderUpdated, { orderId });
    });
  }

  // New method to broadcast to all users of a specific type
  broadcastToUserType(type: 'client' | 'merchant' | 'driver', event: string, data: any) {
    this.server.to(`${type}-*`).emit(event, data);
  }

  @SubscribeMessage('updateDriverLocation')
  async handleUpdateDriverLocation(client: Socket, payload: { lat: number; lng: number }) {
    const user = this.getUserFromSocket(client);
    if (user && user.type === ERoleType.Driver) {
      this.driverLocations.set(user.id, payload);

      console.log(`Driver ${user.id} location update:`, payload);
      await this.broadcastDriverLocation(user.id, payload);
    }
  }

  private async broadcastDriverLocation(driverId: number, location: { lat: number; lng: number }) {
    const order = await this.findActiveOrderForDriver(driverId);
    if (order) {
      this.server.to(`order-${order.id}`).emit(ESocketEvent.DriverLocationUpdate, { driverId, location });
    }
  }

  private async findActiveOrderForDriver(driverId: number): Promise<OrderEntity | null> {
    return this.orderRepository.findOne({
      where: {
        driverId: driverId,
      },
      relations: {
        store: {
          staffs: true,
        },
        client: true,
        driver: true,
      },
    });
  }

  private getUserFromSocket(client: Socket): SocketUser | undefined {
    for (const [, user] of this.connectedUsers.entries()) {
      if (user.socket === client) {
        return user;
      }
    }
    return undefined;
  }

  @SubscribeMessage('subscribeToOrder')
  handleSubscribeToOrder(client: Socket, orderId: number) {
    client.join(`order-${orderId}`);
  }

  @SubscribeMessage('unsubscribeFromOrder')
  handleUnsubscribeFromOrder(client: Socket, orderId: number) {
    client.leave(`order-${orderId}`);
  }
}
