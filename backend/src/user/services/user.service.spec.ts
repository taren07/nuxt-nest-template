import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('validateUserData', () => {
    it('should validate and return clean user data', () => {
      const userData = {
        email: 'TEST@EXAMPLE.COM  ',
        name: '  Test User  ',
        age: 25,
      };

      const result = userService.validateUserData(userData);

      expect(result).toEqual({
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
      });
    });

    it('should throw BadRequestException for invalid email', () => {
      const userData = {
        email: 'invalid-email',
        name: 'Test User',
      };

      expect(() => userService.validateUserData(userData)).toThrow(BadRequestException);
      expect(() => userService.validateUserData(userData)).toThrow('Invalid email format');
    });

    it('should throw BadRequestException for short name', () => {
      const userData = {
        email: 'test@example.com',
        name: 'A',
      };

      expect(() => userService.validateUserData(userData)).toThrow(BadRequestException);
      expect(() => userService.validateUserData(userData)).toThrow('Name must be at least 2 characters long');
    });

    it('should throw BadRequestException for invalid age', () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        age: -1,
      };

      expect(() => userService.validateUserData(userData)).toThrow(BadRequestException);
      expect(() => userService.validateUserData(userData)).toThrow('Age must be between 0 and 150');
    });

    it('should throw BadRequestException for age over 150', () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        age: 151,
      };

      expect(() => userService.validateUserData(userData)).toThrow(BadRequestException);
    });

    it('should handle partial data for updates', () => {
      const userData = {
        name: '  Updated Name  ',
      };

      const result = userService.validateUserData(userData);

      expect(result).toEqual({
        name: 'Updated Name',
      });
    });
  });

  describe('formatUserResponse', () => {
    it('should format user response correctly', () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        someExtraField: 'should not appear',
      };

      const result = userService.formatUserResponse(user);

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      });
    });
  });

  describe('generateUserSummary', () => {
    it('should generate user summary with average age', () => {
      const users = [
        { id: 1, email: 'user1@example.com', name: 'User 1', age: 20, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, email: 'user2@example.com', name: 'User 2', age: 30, createdAt: new Date(), updatedAt: new Date() },
        { id: 3, email: 'user3@example.com', name: 'User 3', age: null, createdAt: new Date(), updatedAt: new Date() },
      ];

      const result = userService.generateUserSummary(users);

      expect(result.total).toBe(3);
      expect(result.averageAge).toBe(25);
      expect(result.users).toHaveLength(3);
    });

    it('should handle empty user list', () => {
      const users = [];

      const result = userService.generateUserSummary(users);

      expect(result.total).toBe(0);
      expect(result.averageAge).toBe(0);
      expect(result.users).toHaveLength(0);
    });

    it('should handle users without age', () => {
      const users = [
        { id: 1, email: 'user1@example.com', name: 'User 1', age: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, email: 'user2@example.com', name: 'User 2', age: undefined, createdAt: new Date(), updatedAt: new Date() },
      ];

      const result = userService.generateUserSummary(users);

      expect(result.total).toBe(2);
      expect(result.averageAge).toBe(0);
    });
  });
});