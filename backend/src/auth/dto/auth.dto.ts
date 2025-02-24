import { IsEmail, IsNotEmpty } from 'class-validator';

export type AuthBody = {
  email: string;
  password: string;
};

export class AuthBodyDto implements AuthBody {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export type AuthResponse = {
  access_token: string;
};
