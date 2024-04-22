import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { CredentialSigninDto } from "../users/dto/credential-signin.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class LocalAuthGuard implements CanActivate {
    constructor(
        private readonly usersService: UsersService
    ) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>()
        const credential = req.body

        const { email, password } = credential as CredentialSigninDto
        const user = await this.usersService.validateCredential(email, password)

        req.user = user
        return true
    }
}