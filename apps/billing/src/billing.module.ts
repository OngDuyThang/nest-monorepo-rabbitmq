import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';

// Billing Module vừa là 1 microservice, vừa inject microservice khác để sử dụng
// RmqModule ở đây có 2 chức năng, lấy RmqService để get options create microservice và inject Auth microservice
@Module({
  imports: [
    RmqModule.register({
      isGlobal: true,
      clients: [
        {
          name: 'AUTH_SERVICE',
          queueName: 'AUTH'
        }
      ]
    }),
    ConfigModule.forRoot({ // ConfigModule này chỉ global trong scope BillingModule
      isGlobal: true,
      envFilePath: './apps/billing/.env'
    }),
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
