import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsService } from './ws.service';

@WebSocketGateway({
  cors: true,
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly wsService: WsService) {}

  handleConnection(client: Socket) {
    console.log(`[${client.id}] Client connected`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[${client.id}] Client disconnected`);
  }

  @SubscribeMessage('join-factory')
  joinFactory(@ConnectedSocket() client: Socket, @MessageBody() payload: { factoryCode: string }) {
    client.join(`factory:${payload.factoryCode}`);

    return { joined: payload.factoryCode };
  }
}
