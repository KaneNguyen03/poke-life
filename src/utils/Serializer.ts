/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from "@nestjs/common"
import { PassportSerializer } from "@nestjs/passport"
import { Users } from "@prisma/client"
import { AuthService } from "src/auth/auth.service"

@Injectable()
export class SessionSererializer extends PassportSerializer {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: AuthService) {
        super()
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    serializeUser(user: Users, done: Function) {
        done(null, user)
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-explicit-any
    async deserializeUser(payload: any, done: Function) {
        const result = this.authService.findUserById(payload.id);
        return result ? done(null, result) : done(null, null)
    }
}