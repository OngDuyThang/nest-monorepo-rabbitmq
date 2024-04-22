import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './orders.repository';
import { Order } from './schemas/order.schema';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject('BILLING_SERVICE')
    private readonly billingMicroservice: ClientProxy
  ) {}

  getHello(): string {
    return 'Hello from Orders';
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    accessToken: string
  ): Promise<Order> {
    console.log('Im in Orders createOrder')

    try {
      const order = await this.ordersRepository.create(createOrderDto)

      await lastValueFrom(
        this.billingMicroservice.emit('create_order', {
          order,
          accessToken
        })
      )
      return order
    } catch (e) {
      throw e
    }
  }

  async getOrders(): Promise<Order[]> {
    console.log('Im in Orders getOrders')

    return await this.ordersRepository.find({})
  }
}
