import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { RtGuard } from '../common/guards'
import { Public, GetCurrentUserId, GetCurrentUser } from '../common/decorators'
import { SigninDto, SignupDto } from './dto'
import { Tokens } from './types'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { TokensResponse } from './types/tokensResponse.type'


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Sign up' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'User successfully signed up', type: TokensResponse })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Credentials incorrect' })
    signupLocal(@Body() dto: SignupDto): Promise<Tokens> {
        return this.authService.signupLocal(dto)
    }

    @Public()
    @Post('local/signin')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Sign in' })
    @ApiResponse({ status: HttpStatus.OK, description: 'User successfully signed in', type: TokensResponse })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
    signinLocal(@Body() dto: SigninDto): Promise<Tokens> {
        return this.authService.signinLocal(dto)
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Log out' })
    @ApiResponse({ status: HttpStatus.OK, description: 'User successfully logged out' })
    logout(@GetCurrentUserId() userId: string): Promise<boolean> {
        return this.authService.logout(userId)
    }

    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh tokens' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Tokens successfully refreshed', type: TokensResponse })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
    refreshTokens(
        @GetCurrentUserId() userId: string,
        @GetCurrentUser('refreshToken') refreshToken: string,
    ): Promise<Tokens> {
        return this.authService.refreshTokens(userId, refreshToken)
    }
}
