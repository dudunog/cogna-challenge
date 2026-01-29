import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { SignUpUserDto } from 'src/modules/user/dto/sign-up-user.dto';
import { hash } from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class SignUpUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(signUpUserDto: SignUpUserDto) {
    const { email, name, password } = signUpUserDto;

    const existingUser = await this.userService.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Já existe um usuário com este e-mail');
    }

    const hashedPassword = await hash(password, SALT_ROUNDS);

    const newUser = await this.userService.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}
