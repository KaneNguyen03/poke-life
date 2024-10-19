import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({ cors: true }) // Enable CORS if needed
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server!: Server

    handleConnection(client: Socket) {
        console.log('Client connected:', client.id)
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id)
    }

    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: { text: string }): void {
        console.log('Message received:', payload.text)
        // Broadcast the message to all clients
        this.server.emit('message', payload)
    }
}
