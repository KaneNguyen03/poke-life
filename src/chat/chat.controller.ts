// src/chat/chat.controller.ts
import { Controller, Get, Param } from '@nestjs/common'
import { ChatService } from './chat.service'
import { ChatMessage } from './chat-message-schema'
import { Public } from 'src/common/decorators'

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Public()
    @Get(':userId')
    async getChatHistory(@Param('userId') userId: string): Promise<ChatMessage[]> {
        return this.chatService.getChatMessagesByUserId(userId)
    }

    @Public()
    @Get('customers')
    async fetchCustomers(): Promise<string[]> {
        return this.chatService.fetchCustomers()
    }
}
