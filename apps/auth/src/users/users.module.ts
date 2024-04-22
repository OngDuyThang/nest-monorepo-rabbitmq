import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersRepository } from "./users.repository";
import { DatabaseModule } from "@app/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";

@Module({
    imports: [
        DatabaseModule,
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema
            }
        ]),
    ],
    providers: [UsersService, UsersRepository],
    exports: [UsersService]
})
export class UsersModule {}