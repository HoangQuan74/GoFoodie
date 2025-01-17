import { Socket } from 'socket.io';

export interface SocketUser {
  id: number;
  type: string;
  socket: Socket;
}
