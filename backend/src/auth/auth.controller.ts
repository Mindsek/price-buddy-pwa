import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthBodyDto, AuthResponse } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Connecte un utilisateur existant' })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie, retourne un token JWT',
    type: AuthResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur ou mot de passe incorrect',
  })
  async login(@Body() authBody: AuthBodyDto, @Res() res: Response) {
    this.logger.log(
      `Login attempt for email: ${authBody.email} from IP: ${res.req.ip}`,
    );
    try {
      const { access_token } = await this.authService.login(authBody);

      res.cookie('auth-buddy', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/',
      });

      this.logger.log(`Login successful for email: ${authBody.email}`);
      res.json({ message: 'Connection successful', access_token });
    } catch (error) {
      this.logger.error(
        `Login failed for email: ${authBody.email} - Error: ${error.message}`,
      );
      throw error;
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Inscrit un nouvel utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Inscription réussie, retourne un token JWT',
    type: AuthResponse,
  })
  @ApiResponse({ status: 400, description: 'Utilisateur déjà existant' })
  async register(
    @Body() body: { email: string; username: string; password: string },
    @Res() res: Response,
  ) {
    this.logger.log(
      `Registration attempt for email: ${body.email}, username: ${body.username} from IP: ${res.req.ip}`,
    );
    try {
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

      this.logger.log(
        `Registration successful for email: ${body.email}, username: ${body.username}`,
      );
      res.json({ message: 'Registration successful', access_token });
    } catch (error) {
      this.logger.error(
        `Registration failed for email: ${body.email}, username: ${body.username} - Error: ${error.message}`,
      );
      throw error;
    }
  }

  @Get('verify')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Vérifie si le token JWT est valide' })
  @ApiResponse({
    status: 200,
    description: 'Token valide, retourne les infos de l’utilisateur',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        username: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token invalide ou manquant' })
  async verify(@Res() res: Response) {
    const token = res.req.cookies['auth-buddy'];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.authService.verifyToken(token);
      res.json({
        id: payload.id,
        email: payload.email,
        username: payload.username,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
