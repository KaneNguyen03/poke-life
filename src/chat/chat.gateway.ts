// src/chat/chat.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ChatService } from './chat.service'
import { ChatMessage } from './chat-message-schema'

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server!: Server

    private clients: Map<string, Socket> = new Map(); // Track connected clients

    constructor(private chatService: ChatService) { } // Inject ChatService

    handleConnection(client: Socket) {
        this.clients.set(client.id, client)
        console.log('Client connected:', client.id)
    }

    handleDisconnect(client: Socket) {
        this.clients.delete(client.id)
        console.log('Client disconnected:', client.id)
    }

    @SubscribeMessage('message')
    async handleMessage(client: Socket, payload: ChatMessage): Promise<void> {
        console.log('Message received:', payload)

        // Store the message in MongoDB
        //await this.chatService.createChatMessage(payload)

        // Broadcast the message to all clients
        this.server.emit('message', payload)
    }
}
