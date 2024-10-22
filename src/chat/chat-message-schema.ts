import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ChatMessageDocument = ChatMessage & Document

@Schema()
export class ChatMessage {
    @Prop({ required: true })
    sender!: string

    @Prop({ required: true })
    text!: string

    @Prop({ required: true })
    userId!: string

    @Prop({ default: Date.now })
    createdAt!: Date
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage)
