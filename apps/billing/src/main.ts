import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);

  // Để inject ở đây, vẫn cần phải import trong app module
  const rmqService = app.get(RmqService)
  app.connectMicroservice(rmqService.getMicroserviceOptions('BILLING'))

  await app.startAllMicroservices();
}
bootstrap();
