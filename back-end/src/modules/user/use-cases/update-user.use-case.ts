import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userService.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return this.userService.update({
      where: { id },
      data: updateUserDto,
    });
  }
}
