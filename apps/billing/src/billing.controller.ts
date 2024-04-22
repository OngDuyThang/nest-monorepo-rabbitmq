import { Controller, Get, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Order } from 'apps/orders/src/schemas/order.schema';
import { RmqService } from '@app/common';
import { GetUser } from 'apps/auth/src/decorators/get-user.decorator';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { PublicJwtGuard } from '@app/common/auth/public-jwt.guard';

@Controller()
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly rmqService: RmqService
  ) {}

  @Get()
  getHello(): string {
    return this.billingService.getHello();
  }

  @EventPattern('create_order')
  @UseGuards(PublicJwtGuard)
  createOrder(
    // Chỉ những microservice nhận message mới có Payload và Context
    @Payload()
    payload: {
      order: Order,
      accessToken: string
    },
    @Ctx()
    context: RmqContext,
    @GetUser()
    user: User
  ) {
    console.log('user from validateJWT(): ', user)

    // Khi no ack = false ==> rabbitmq ko cho phép thiếu ack
    // Khi emit sẽ thiếu ack ==> mỗi lần emit thì rabbitmq sẽ thêm message vào unAcked
    // Khi unAcked của rabbitmq có tồn tại message, rabbitmq sẽ hiểu là server (microservice) bị crash
    // ==> Khi restart lại billing microservice, rabbitmq sẽ gửi lại TOÀN BỘ unAcked message cho billing microservice
    // ==> Vòng lặp lại tiếp tục
    // ==> Cần phải gửi ack về cho rabbitmq mỗi khi emit xong
    // ==> Gửi ack từ server (microservice) vì producer KO NHẬN Payload và Context
    this.billingService.bill(payload.order)
    this.rmqService.sendAck(context)
  }
}
