import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(createUserDto: CreateUserDto) {
    return this.userService.create({
      data: createUserDto,
    });
  }
}
