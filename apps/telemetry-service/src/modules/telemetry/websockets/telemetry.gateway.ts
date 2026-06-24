import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class TelemetryGateway {
  @WebSocketServer()
  server: Server;

  emitTelemetry(payload: any) {
    this.server.emit('telemetry-updated', payload);
  }

  emitMachineStatus(payload: any) {
    this.server.emit('machine-status-updated', payload);
  }
}
