import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(id: string) {
    const user = await this.userService.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userService.delete({
      where: { id },
    });
  }
}
