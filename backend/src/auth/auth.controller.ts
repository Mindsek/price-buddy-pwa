import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthBodyDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() authBody: AuthBodyDto, @Res() res: Response) {
    const { access_token } = await this.authService.login(authBody);

    res.cookie('auth-buddy', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });

    res.json({ message: 'Connection successful', access_token });
  }

  @Post('register')
  async register(
    @Body() body: { email: string; username: string; password: string },
    @Res() res: Response,
  ) {
    const { access_token } = await this.authService.register(
      body.email,
      body.username,
      body.password,
    );

    res.cookie('auth-buddy', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });

    res.json({ message: 'Registration successful', access_token });
  }
}
