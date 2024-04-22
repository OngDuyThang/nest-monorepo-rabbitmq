import { Injectable } from '@nestjs/common';
import { Order } from 'apps/orders/src/schemas/order.schema';

@Injectable()
export class BillingService {
  getHello(): string {
    return 'Hello World!';
  }

  bill(
    order: Order
  ) {
    console.log('Im in Billing bill')
    console.log(order)
  }
}
