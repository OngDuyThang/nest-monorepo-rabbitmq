import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./schemas/user.schema";

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository
    ) {}

    async createUser(
        createUserDto: CreateUserDto
    ): Promise<User> {
        console.log('Im in Auth createUser')

        try {
            const existed = await this.existedUser(createUserDto.email)

            if (existed) {
                throw new ConflictException('user exists')
            }
            const user = await this.usersRepository.create(createUserDto)
            return user
        } catch (e) {
            throw e
        }
    }

    async existedUser(
        email: string
    ): Promise<boolean> {
        try {
            const user = await this.usersRepository.findOne({
                email
            })
            if (user) {
                return true
            }
        } catch (e) {
            if (e.status === 404) {
                return false
            }
            throw e
        }
    }

    async validateCredential(
        email: string,
        password: string
    ): Promise<User> {
        try {
            const user = await this.usersRepository.findOne({
                email
            })

            if (password === user.password) {
                return user
            }
            throw new NotFoundException()
        } catch (e) {
            if (e.status === 404) {
                throw new NotFoundException('invalid credential')
            }
            throw e
        }
    }

    async getUser(
        email: string
    ): Promise<User> {
        try {
            const user = await this.usersRepository.findOne({ email })
            return user
        } catch (e) {}
    }
}