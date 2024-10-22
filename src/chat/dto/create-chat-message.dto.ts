import { IsString } from 'class-validator'

export class CreateChatMessageDto {
    @IsString()
    sender!: string

    @IsString()
    text!: string

    @IsString()
    userId!: string
}