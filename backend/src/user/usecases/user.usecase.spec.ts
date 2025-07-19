import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UserUseCase } from './user.usecase';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';

describe('UserUseCase', () => {
  let userUseCase: UserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let userService: jest.Mocked<UserService>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    age: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };

    const mockUserService = {
      validateUserData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserUseCase,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userUseCase = module.get<UserUseCase>(UserUseCase);
    userRepository = module.get(UserRepository);
    userService = module.get(UserService);
  });

  describe('createUser', () => {
    const createUserDto = {
      email: 'test@example.com',
      name: 'Test User',
      age: 25,
    };

    it('should create a user successfully', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userService.validateUserData.mockReturnValue(createUserDto);
      userRepository.create.mockResolvedValue(mockUser);

      const result = await userUseCase.createUser(createUserDto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(userService.validateUserData).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(userUseCase.createUser(createUserDto)).rejects.toThrow(ConflictException);
      await expect(userUseCase.createUser(createUserDto)).rejects.toThrow('User with this email already exists');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      userRepository.findAll.mockResolvedValue(users);

      const result = await userUseCase.getAllUsers();

      expect(userRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await userUseCase.getUserById(1);

      expect(userRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(userUseCase.getUserById(999)).rejects.toThrow(NotFoundException);
      await expect(userUseCase.getUserById(999)).rejects.toThrow('User with ID 999 not found');
    });
  });

  describe('updateUser', () => {
    const updateUserDto = {
      name: 'Updated Name',
      age: 30,
    };

    it('should update a user successfully', async () => {
      const updatedUser = { ...mockUser, ...updateUserDto };
      userRepository.exists.mockResolvedValue(true);
      userService.validateUserData.mockReturnValue(updateUserDto);
      userRepository.update.mockResolvedValue(updatedUser);

      const result = await userUseCase.updateUser(1, updateUserDto);

      expect(userRepository.exists).toHaveBeenCalledWith(1);
      expect(userService.validateUserData).toHaveBeenCalledWith(updateUserDto);
      expect(userRepository.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      userRepository.exists.mockResolvedValue(false);

      await expect(userUseCase.updateUser(999, updateUserDto)).rejects.toThrow(NotFoundException);
      await expect(userUseCase.updateUser(999, updateUserDto)).rejects.toThrow('User with ID 999 not found');
    });

    it('should throw ConflictException if email already exists for another user', async () => {
      const updateWithEmail = { ...updateUserDto, email: 'existing@example.com' };
      const existingUser = { ...mockUser, id: 2, email: 'existing@example.com' };
      
      userRepository.exists.mockResolvedValue(true);
      userRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(userUseCase.updateUser(1, updateWithEmail)).rejects.toThrow(ConflictException);
      await expect(userUseCase.updateUser(1, updateWithEmail)).rejects.toThrow('User with this email already exists');
    });

    it('should allow updating email to same user\'s email', async () => {
      const updateWithSameEmail = { ...updateUserDto, email: mockUser.email };
      const updatedUser = { ...mockUser, ...updateWithSameEmail };
      
      userRepository.exists.mockResolvedValue(true);
      userRepository.findByEmail.mockResolvedValue(mockUser);
      userService.validateUserData.mockReturnValue(updateWithSameEmail);
      userRepository.update.mockResolvedValue(updatedUser);

      const result = await userUseCase.updateUser(1, updateWithSameEmail);

      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      userRepository.exists.mockResolvedValue(true);
      userRepository.delete.mockResolvedValue(undefined);

      await userUseCase.deleteUser(1);

      expect(userRepository.exists).toHaveBeenCalledWith(1);
      expect(userRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      userRepository.exists.mockResolvedValue(false);

      await expect(userUseCase.deleteUser(999)).rejects.toThrow(NotFoundException);
      await expect(userUseCase.deleteUser(999)).rejects.toThrow('User with ID 999 not found');
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await userUseCase.getUserByEmail('test@example.com');

      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(userUseCase.getUserByEmail('notfound@example.com')).rejects.toThrow(NotFoundException);
      await expect(userUseCase.getUserByEmail('notfound@example.com')).rejects.toThrow('User with email notfound@example.com not found');
    });
  });
});