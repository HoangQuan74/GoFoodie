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
import { In, Repository } from 'typeorm';
import { OrderEntity } from '../database/entities/order.entity';
import { EOrderStatus } from 'src/common/enums/order.enum';

@WebSocketGateway()
@Injectable()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private connected: Map<string, string> = new Map();

  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    try {
      const accessToken = client.handshake.headers.authorization || (client.handshake.query.token as string);
      if (!accessToken) throw new BadRequestException('No access token provided');

      const payload = this.jwtService.verify(accessToken) as JwtPayload;
      const { id: userId, type } = payload;

      if (!userId || !type) throw new BadRequestException('Invalid token');

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
    for (const [key, value] of this.connected.entries()) {
      if (value === client.id) {
        this.connected.delete(key);
        break;
      }
    }
  }

  notifyNewOrder(merchantId: number, order: OrderEntity) {
    const merchantSocketId = this.connected.get(`${ERoleType.Merchant}-${merchantId}`);
    if (!merchantSocketId) return;

    const baseOrderInfo = {
      orderId: order.id,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      notes: order.notes,
    };

    this.server.to(merchantSocketId).emit('newOrder', {
      ...baseOrderInfo,
      clientName: order.client?.name,
      clientPhone: order.client?.phone,
      deliveryAddress: order.deliveryAddress,
    });
  }

  notifyNewDelivery(driverId: number, order: OrderEntity) {
    const driverSocketId = this.connected.get(`${ERoleType.Driver}-${driverId}`);
    if (!driverSocketId) return;

    this.server.to(driverSocketId).emit('newDelivery', {
      orderId: order.id,
      pickupAddress: order.store?.address,
      deliveryAddress: order.deliveryAddress,
      deliveryLatitude: order.deliveryLatitude,
      deliveryLongitude: order.deliveryLongitude,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      clientName: order.client?.name,
      clientPhone: order.client?.phone,
      notes: order.notes,
    });
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

  async handleNewNotification() {
    const roms = this.server.sockets.adapter.rooms;
    const adminRoms = [...roms.keys()].filter((key) => key.startsWith(ERoleType.Admin));

    adminRoms.forEach((room) => {
      this.server.to(room).emit(ESocketEvent.NewNotification);
    });
  }

  async handleUpdateRole(type: ERoleType, userIds: number[]) {
    userIds.forEach((userId) => {
      const socketId = this.connected.get(`${type}-${userId}`);
      socketId && this.server.to(socketId).emit(ESocketEvent.RoleUpdated);
    });
  }

  async newOrderSearchingForDriver(order: OrderEntity) {
    const drivers = Array.from(this.connected.entries())
      .filter(([key]) => key.startsWith('driver-'))
      .map(([key, clientId]) => ({ userId: key.split('-')[1], clientId }));

    drivers.forEach(({ clientId }) => {
      this.server.to(clientId).emit(ESocketEvent.OrderSearchingForDriver, {
        orderId: order.id,
        store: {
          latitude: order.store?.latitude,
          longitude: order.store?.longitude,
        },
      });
    });
  }

  async handleUpdateStatusTransactionCoin(merchantIds: number[] = [], storeTransactionId: number) {
    merchantIds.forEach((merchantId) => {
      const socketId = this.connected.get(`${ERoleType.Merchant}-${merchantId}`);
      socketId && this.server.to(socketId).emit(ESocketEvent.UpdateStatusTransactionCoin, { storeTransactionId });
    });
  }

  @SubscribeMessage('driverLocationUpdate')
  async handleDriverLocationUpdate(client: Socket, location: string) {
    if (!location) return;

    const user = this.getUserFromSocket(client);
    if (!user || user.type !== ERoleType.Driver) return;

    const orders = await this.orderRepository.find({
      select: { id: true, clientId: true },
      where: { driverId: user.id, status: In([EOrderStatus.InDelivery, EOrderStatus.DriverAccepted]) },
    });

    orders.forEach((order) => {
      this.server
        .to(`${ERoleType.Client}-${order.clientId}`)
        .emit(ESocketEvent.DriverLocationUpdate, { orderId: order.id, location });
    });
  }

  private getUserFromSocket(client: Socket): SocketUser | undefined {
    for (const [key, value] of this.connected.entries()) {
      if (value === client.id) {
        const [type, id] = key.split('-');
        return { id: +id, type, socketId: client.id };
      }
    }
  }

  sendEventToUser(userId: number, userType: ERoleType, event: ESocketEvent, data: any) {
    const socketId = this.connected.get(`${userType}-${userId}`);
    socketId && this.server.to(socketId).emit(event, data);
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
