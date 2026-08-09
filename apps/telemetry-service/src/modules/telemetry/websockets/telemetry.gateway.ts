import type {
  OnGatewayConnection,
  OnGatewayDisconnect} from '@nestjs/websockets';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/factory',
  cors: true,
})
export class TelemetryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`[${client.id}] Client connected`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[${client.id}] Client disconnected`);
  }

  @SubscribeMessage('join-factory')
  joinFactory(@ConnectedSocket() client: Socket, @MessageBody() factoryCode: string) {
    client.join(`factory:${factoryCode}`);
  }
}
