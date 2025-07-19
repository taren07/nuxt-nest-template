import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { UserUseCase } from './usecases/user.usecase';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userUseCase: UserUseCase) {}

  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return await this.userUseCase.createUser(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.userUseCase.getAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userUseCase.getUserById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body(ValidationPipe) updateUserDto: UpdateUserDto
  ) {
    return await this.userUseCase.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.userUseCase.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}