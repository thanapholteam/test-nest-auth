import { IsEmail, IsString } from 'class-validator';

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

export class UserForgotStep {
  @IsEmail()
  email: string;
}

export class UserVerifyStep {
  @IsString()
  id: string;
  @IsEmail()
  email: string;
  @IsString()
  code: string;
}

export class UserRepasswordStep {
  @IsString()
  id: string;
  @IsEmail()
  email: string;
  @IsString()
  newPassword: string;
}
