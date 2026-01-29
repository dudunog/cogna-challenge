import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class FindUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(id: string) {
    const user = await this.userService.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }
}
