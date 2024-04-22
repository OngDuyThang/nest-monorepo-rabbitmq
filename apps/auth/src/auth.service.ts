import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { User } from './users/schemas/user.schema';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async signup(
    createUserDto: CreateUserDto
  ): Promise<User> {
    return await this.usersService.createUser(createUserDto)
  }

  signin(
    user: User,
    res: Response
  ) {
    console.log('Im in Auth signin')

    res.cookie('access-token', user.email, {
      httpOnly: true,
      sameSite: 'none',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    })
    return {
      accessToken: user.email
    }
  }
}
