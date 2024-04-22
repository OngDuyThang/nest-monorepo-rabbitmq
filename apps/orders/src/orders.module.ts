import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, RmqModule } from '@app/common';
import { OrdersRepository } from './orders.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import * as cookieParser from 'cookie-parser'

@Module({
  imports: [
    ConfigModule.forRoot({ // ConfigModule này chỉ global trong scope OrdersModule
      isGlobal: true,
      envFilePath: './apps/orders/.env'
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema
      }
    ]),
    RmqModule.register({
      isGlobal: true,
      clients: [
        {
          name: 'BILLING_SERVICE',
          queueName: 'BILLING'
        },
        {
          name: 'AUTH_SERVICE',
          queueName: 'AUTH'
        }
      ]
    })
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser())
      .forRoutes('*')
  }
}
