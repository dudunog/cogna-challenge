import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import type { CurrentUserPayload } from 'src/modules/auth/decorators/current-user.decorator';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignUpUserUseCase } from './use-cases/sign-up-user.use-case';
import { FindUserUseCase } from './use-cases/find-user.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';

@Controller('users')
export class UserController {
  constructor(
    private readonly signUpUserUseCase: SignUpUserUseCase,
    private readonly findUserUseCase: FindUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() signUpUserDto: SignUpUserDto) {
    return this.signUpUserUseCase.execute(signUpUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() currentUser: CurrentUserPayload) {
    const user = await this.findUserUseCase.execute(currentUser.id);

    return { id: user.id, email: user.email, name: user.name };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute(id, updateUserDto);
  }
}
