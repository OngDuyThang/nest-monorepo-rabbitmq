import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { User } from './users/schemas/user.schema';
import { CredentialSigninDto } from './users/dto/credential-signin.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request, Response } from 'express';
import { GetUser } from './decorators/get-user.decorator';
import { PrivateJwtGuard } from './guards/private-jwt.guard';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(@Req() req: Request) {
    console.log(req.cookies)
  }

  @Post('signup')
  async signup(
    @Body()
    createUserDto: CreateUserDto
  ): Promise<User> {
    return await this.authService.signup(createUserDto)
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  async signin(
    @GetUser()
    user: User,
    @Res({ passthrough: true })
    res: Response
  ) {
    return this.authService.signin(user, res)
  }

  @UseGuards(PrivateJwtGuard)
  @MessagePattern({ cmd: 'validate_jwt' })
  validateJWT(
    // Cách khác dùng @Payload và authService để xử lý accessToken 
    @GetUser()
    user: User
  ) {
    return user
    console.log()
  }
}
