// import {
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { OnModuleInit } from '@nestjs/common';
// import { Server } from 'socket.io';
// import { NotificationService } from '../notification.service';
//
// @WebSocketGateway({ namespace: '/message', cors: true })
// export class MessageWebsocket implements OnModuleInit {
//   @WebSocketServer()
//   server: Server;
//
//   constructor(private messageService: NotificationService) {}
//
//   onModuleInit(): any {
//     this.server.on('connection', async (socket) => {
//       console.log(`Message Websocket Connected on ${socket.id}`);
//     });
//   }
//
//   @SubscribeMessage('newMessage')
//   async onNewMessage(@MessageBody() body: any) {
//     console.log(body);
//     this.server.emit('messageItem', body);
//     // await this.messageService.addMessage(body);
//   }
//
//   @SubscribeMessage('deleteNotification')
//   onDeleteMessage(@MessageBody() body: any) {
//     console.log(body);
//     // this.server.emit('notificationItem', body);
//     // this.server.on('NOTIFICATION_DELETED', () => {
//     //   console.log('NOTIFICATION_DELETED');
//     // });
//   }
// }
