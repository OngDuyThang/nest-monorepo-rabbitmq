import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { UsersService } from "../users/users.service";
import { User } from "../users/schemas/user.schema";

@Injectable()
export class PrivateJwtGuard implements CanActivate {
    constructor(
        private readonly usersService: UsersService
    ) {}

    // Dành cho handler của auth microservice, dùng để validate jwt token và trả ra user trong RPC req
    async canActivate(context: ExecutionContext) {
        console.log('Im in PrivateJwtGuard')
        const req = context.switchToRpc().getData<{
            accessToken: string,
            user?: User
        }>()
        const accessToken = req.accessToken

        if (!accessToken) {
            throw new UnauthorizedException('invalid access token')
        }

        // validate jwt token ở đây
        // accessToken = email cho dễ test
        const email = accessToken
        const user = await this.usersService.getUser(email)

        if (!user) {
            throw new UnauthorizedException('invalid user')
        }
        req.user = user
        return true
    }
}