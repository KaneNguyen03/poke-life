// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ChatMessage, ChatMessageDocument } from './chat-message-schema'
import { CreateChatMessageDto } from './dto/create-chat-message.dto'

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessageDocument>
    ) { }

    async createChatMessage(chatMessage: CreateChatMessageDto): Promise<ChatMessage> {
        const newChatMessage = new this.chatMessageModel(chatMessage)
        return newChatMessage.save()
    }

    async getChatMessagesByUserId(userId: string): Promise<ChatMessage[]> {
        return this.chatMessageModel.find({ userId }).exec()
    }

    async fetchCustomers(): Promise<string[]> {
        const customers = await this.chatMessageModel
            .find({ userId: 'admin' })
            .distinct('sender')
            .exec()

        return customers
    }
}
