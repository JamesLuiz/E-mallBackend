import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
@Injectable()
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token);
      client.join(`user_${payload.sub}`);
      if (payload.roles.includes('vendor')) {
        client.join(`vendor_${payload.vendorId}`);
      }
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Handle cleanup
  }

  sendOrderUpdate(userId: string, orderData: any) {
    this.server.to(`user_${userId}`).emit('orderUpdate', orderData);
  }

  sendVendorNotification(vendorId: string, notification: any) {
    this.server.to(`vendor_${vendorId}`).emit('vendorNotification', notification);
  }
}