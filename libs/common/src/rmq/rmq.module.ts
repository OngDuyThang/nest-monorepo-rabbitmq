import { DynamicModule, Module } from "@nestjs/common";
import { RmqService } from "./rmq.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    providers: [RmqService],
    exports: [RmqService]
})
export class RmqModule {
    static register({
        isGlobal = false,
        clients
    }: {
        isGlobal?: boolean,
        clients: {
            name: string,
            queueName: string
        }[]
    }): DynamicModule {

        return {
            module: RmqModule,
            imports: [
                ClientsModule.registerAsync({
                    isGlobal, // Phòng trường hợp các service trong cùng 1 scope module cần gọi inject lẫn nhau

                    clients: clients.map(client => {
                        const { name, queueName } = client

                        return {
                            name,
                            // imports: [ConfigModule], ==> Đã có ConfigModule global trong module Billing
                            inject: [ConfigService],
                            useFactory: (configService: ConfigService) => ({
                                transport: Transport.RMQ,
                                options: {
                                    urls: [configService.get<string>('RABBIT_MQ_URI')],
                                    queue: configService.get<string>(`${queueName}_QUEUE`)
                                }
                            })
                        }
                    })
                })
            ],
            exports: [ClientsModule]
        }
    }
}