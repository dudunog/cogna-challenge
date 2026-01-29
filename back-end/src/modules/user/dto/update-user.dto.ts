import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsOptional()
  name?: string;

  @IsEmail({}, { message: 'Email deve ser um endereço de email válido' })
  @IsOptional()
  email?: string;
}
