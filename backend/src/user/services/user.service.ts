import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  validateUserData(userData: CreateUserDto | UpdateUserDto): Partial<CreateUserDto | UpdateUserDto> {
    const validatedData = { ...userData };

    if (userData.email) {
      if (!this.isValidEmail(userData.email)) {
        throw new BadRequestException('Invalid email format');
      }
      validatedData.email = userData.email.toLowerCase().trim();
    }

    if (userData.name) {
      if (userData.name.trim().length < 2) {
        throw new BadRequestException('Name must be at least 2 characters long');
      }
      validatedData.name = userData.name.trim();
    }

    if (userData.age !== undefined) {
      if (userData.age < 0 || userData.age > 150) {
        throw new BadRequestException('Age must be between 0 and 150');
      }
    }

    return validatedData;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  formatUserResponse(user: any) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      age: user.age,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  generateUserSummary(users: any[]) {
    return {
      total: users.length,
      averageAge: users.length > 0 
        ? users.filter(u => u.age).reduce((sum, u) => sum + u.age, 0) / users.filter(u => u.age).length 
        : 0,
      users: users.map(user => this.formatUserResponse(user)),
    };
  }
}