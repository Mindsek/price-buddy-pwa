import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data,
      });
      return user;
    } catch (error) {
      console.error('error creating user', error);
      throw new Error('Error creating user');
    }
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const userDeleted = await this.prisma.user.delete({
      where: { id },
    });
    if (!userDeleted) {
      throw new Error('User not found');
    }
    return {
      message: 'User deleted successfully',
      user: userDeleted,
    };
  }
}
