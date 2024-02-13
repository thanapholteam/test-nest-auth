import { IsEmail, IsString } from 'class-validator';

export class UserDTO {
  email: string;
  password: string;
  name: number;
}
export class UserRegisterDTO {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  name: string;
}

export class UserLoginDTO {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class UserForgotDTO {
  @IsEmail()
  email: string;
}
