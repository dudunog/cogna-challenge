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
} from '@nestjs/common';
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

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.findUserUseCase.execute(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute(id, updateUserDto);
  }
}
