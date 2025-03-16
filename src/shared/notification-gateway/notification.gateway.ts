// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
//
// @WebSocketGateway({ cors: true })
// export class NotificationGateway
//   implements OnGatewayConnection, OnGatewayDisconnect
// {
//   @WebSocketServer()
//   server: Server;
//
//   handleConnection(client: Socket) {
//     console.log('Client connected:', client.id);
//   }
//
//   handleDisconnect(client: Socket) {
//     console.log('Client disconnected:', client.id);
//   }
//
//   sendNotificationToAdmin(type: any, notification: any) {
//     this.server.emit(type, notification);
//   }
// }
