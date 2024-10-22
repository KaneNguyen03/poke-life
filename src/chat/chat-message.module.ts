import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ChatMessage, ChatMessageSchema } from './chat-message-schema'
import { ChatService } from './chat.service'
import { ChatController } from './chat.controller'

@Module({
    imports: [MongooseModule.forFeature([{ name: ChatMessage.name, schema: ChatMessageSchema }])],
    providers: [ChatService],
    controllers: [ChatController],
    exports: [MongooseModule],
})
export class ChatMessageModule { }
