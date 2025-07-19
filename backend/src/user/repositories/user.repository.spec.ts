import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from './user.repository';
import { User } from '../entities/user.entity';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockRepository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    age: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    mockRepository = module.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const userData = { email: 'test@example.com', name: 'Test User' };
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await userRepository.create(userData);

      expect(mockRepository.create).toHaveBeenCalledWith(userData);
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      mockRepository.find.mockResolvedValue(users);

      const result = await userRepository.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findById(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await userRepository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findByEmail('test@example.com');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ 
        where: { email: 'test@example.com' } 
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      const updateData = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, ...updateData };
      
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValue(updatedUser);

      const result = await userRepository.update(1, updateData);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      mockRepository.delete.mockResolvedValue(undefined);

      await userRepository.delete(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('exists', () => {
    it('should return true if user exists', async () => {
      mockRepository.count.mockResolvedValue(1);

      const result = await userRepository.exists(1);

      expect(mockRepository.count).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      mockRepository.count.mockResolvedValue(0);

      const result = await userRepository.exists(999);

      expect(result).toBe(false);
    });
  });
});