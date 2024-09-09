import { ApiProperty } from '@nestjs/swagger'

export class TokensResponse {
  @ApiProperty()
  access_token!: string

  @ApiProperty()
  refresh_token!: string
}
