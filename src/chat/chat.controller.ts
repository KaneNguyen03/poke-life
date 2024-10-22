// src/chat/chat.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ChatService } from './chat.service'
import { ChatMessage } from './chat-message-schema'
import { Public } from 'src/common/decorators'
import { CreateChatMessageDto } from './dto/create-chat-message.dto'

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

    @Public()
    @Post('message') // This endpoint will create a chat message
    async createChatMessage(@Body() createChatMessageDto: CreateChatMessageDto): Promise<ChatMessage> {
        return this.chatService.createChatMessage(createChatMessageDto);
    }
}
