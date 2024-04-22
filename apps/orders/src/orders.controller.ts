import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './schemas/order.schema';
import { PublicJwtGuard } from '@app/common/auth/public-jwt.guard';
import { GetUser } from 'apps/auth/src/decorators/get-user.decorator';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { Request } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // @Get()
  // getHello(): string {
  //   return this.ordersService.getHello();
  // }

  @Post()
  @UseGuards(PublicJwtGuard)
  async createOrder(
    @Body()
    createOrderDto: CreateOrderDto,
    @GetUser()
    user: User,
    @Req()
    req: Request
  ): Promise<Order> {
    console.log('user from validateJWT(): ', user)

    const accessToken = req.cookies?.['access-token']
    return await this.ordersService.createOrder(createOrderDto, accessToken)
  }

  @Get()
  async getOrders(): Promise<Order[]> {
    return await this.ordersService.getOrders()
  }
}
