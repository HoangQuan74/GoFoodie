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

@WebSocketGateway()
@Injectable()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private merchantSockets: Map<number, Socket> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket, ...args: any[]) {
    try {
      const accessToken = client.handshake.headers.authorization as string;
      if (!accessToken) throw new BadRequestException('No access token provided');

      const payload = this.jwtService.verify(accessToken);
      const merchantId = payload.sub;

      if (!merchantId) throw new BadRequestException('Invalid token');

      this.merchantSockets.set(merchantId, client);
      console.log('Merchant connected:', merchantId);
    } catch (error) {
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    for (const [merchantId, socket] of this.merchantSockets.entries()) {
      if (socket === client) {
        this.merchantSockets.delete(merchantId);
        console.log('Merchant disconnected:', merchantId);
        break;
      }
    }
  }

  notifyNewOrder(merchantId: number, order: OrderEntity) {
    const socket = this.merchantSockets.get(merchantId);
    if (socket) {
      socket.emit('newOrder', { orderId: order.id, totalAmount: order.totalAmount });
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }
}
