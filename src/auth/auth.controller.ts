import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetCurrentUserId, Public } from '../common/decorators'
import { AtGuard, RtGuard } from '../common/guards'
import { GetCurrentUser } from './../common/decorators/get-current-user.decorator'
import { AuthService } from './auth.service'
import { SigninDto, SignupDto } from './dto'
import { GoogleOAuthGuard } from './google-oauth.guard'
import { Tokens } from './types'
import { TokensResponse } from './types/tokensResponse.type'
import { Users } from '@prisma/client'
import { JwtAuthGuard } from './jwt-auth.guard'


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Get('google/login')
    @UseGuards(GoogleOAuthGuard)
    async googleAuth() {
        return { msg: 'Google Authentication' }
    }

    @Public()
    @Get('google-redirect')
    @UseGuards(GoogleOAuthGuard)
    async googleAuthRedirect(@Request() req) {
        // return this.authService.googleLogin(req)
        return { msg: "OK" }
    }

    @Public()
    @Post('local/signup')
    @UseGuards(AtGuard)
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

    @Public()
    @Get('local/getCurrentUser')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get current user login' })
    GetCurrentUser(@GetCurrentUser() user): Users {
        return user
    }
}
