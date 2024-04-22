import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { User } from "apps/auth/src/users/schemas/user.schema";
import { Request } from "express";
import { Observable, catchError, tap } from "rxjs";

@Injectable()
export class PublicJwtGuard implements CanActivate {
    constructor(
        @Inject('AUTH_SERVICE')
        private readonly authMicroservice: ClientProxy
    ) {}

    canActivate(context: ExecutionContext) {
        console.log('Im in PublicJwtGuard')

        const accessToken = this.getAccessToken(context)
        console.log('accessToken', accessToken)
        if (!accessToken) {
            throw new UnauthorizedException('invalid access token')
        }

        return this.authMicroservice.send(
            { cmd: 'validate_jwt' },
            { accessToken }
        ).pipe(
            tap(resUser => { this.receiveUser(context, resUser) }),
            catchError(e => { throw e })
        )
    }

    private getAccessToken(context: ExecutionContext) {
        console.log(context.getType())
        if (context.getType() === 'http') {
            const req = context.switchToHttp().getRequest<Request>()
            const accessToken = req.cookies?.['access-token']
            return accessToken
        }

        if (context.getType() === 'rpc') {
            const req = context.switchToRpc().getData()
            const accessToken = req?.accessToken
            return accessToken
        }
    }

    private receiveUser(context: ExecutionContext, user: User) {
        console.log(context.getType())
        if (context.getType() === 'http') {
            const req = context.switchToHttp().getRequest<Request>()
            req.user = user
        }

        if (context.getType() === 'rpc') {
            const req = context.switchToRpc().getData()
            req.user = user
        }
    }
}