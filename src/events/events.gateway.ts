import { BadRequestException, Injectable } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { OrderEntity } from '../database/entities/order.entity';
import { JwtPayload } from 'src/common/interfaces';
import { SocketUser } from 'src/common/interfaces/socket.interface';

@WebSocketGateway()
@Injectable()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private connectedUsers: Map<number, SocketUser> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket, ...args: any[]) {
    try {
      const accessToken = client.handshake.headers.authorization as string;
      if (!accessToken) throw new BadRequestException('No access token provided');

      const payload = this.jwtService.verify(accessToken) as JwtPayload;
      const { id: userId, type } = payload;

      if (!userId || !type) throw new BadRequestException('Invalid token');

      this.connectedUsers.set(userId, { id: userId, type, socket: client });
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
  }

  notifyNewOrder(merchantId: number, order: OrderEntity) {
    const user = this.connectedUsers.get(merchantId);
    if (user && user.type === 'merchant') {
      user.socket.emit('newOrder', { orderId: order.id, totalAmount: order.totalAmount });
    }
  }

  notifyOrderStatus(clientId: number, orderId: number, status: string) {
    const user = this.connectedUsers.get(clientId);
    if (user && user.type === 'client') {
      user.socket.emit('orderStatusUpdate', { orderId, status });
    }
  }

  notifyNewDelivery(driverId: number, orderId: number) {
    const user = this.connectedUsers.get(driverId);
    if (user && user.type === 'driver') {
      user.socket.emit('newDelivery', { orderId });
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }

  // New method to broadcast to all users of a specific type
  broadcastToUserType(type: 'client' | 'merchant' | 'driver', event: string, data: any) {
    this.server.to(`${type}-*`).emit(event, data);
  }
}
