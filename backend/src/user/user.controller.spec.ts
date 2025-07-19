import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserUseCase } from './usecases/user.usecase';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userUseCase: jest.Mocked<UserUseCase>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    age: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUserUseCase = {
      createUser: jest.fn(),
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserUseCase,
          useValue: mockUserUseCase,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userUseCase = module.get(UserUseCase);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
      };

      userUseCase.createUser.mockResolvedValue(mockUser);

      const result = await userController.create(createUserDto);

      expect(userUseCase.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      userUseCase.getAllUsers.mockResolvedValue(users);

      const result = await userController.findAll();

      expect(userUseCase.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      userUseCase.getUserById.mockResolvedValue(mockUser);

      const result = await userController.findOne(1);

      expect(userUseCase.getUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        name: 'Updated Name',
        age: 30,
      };
      const updatedUser = { ...mockUser, ...updateUserDto };

      userUseCase.updateUser.mockResolvedValue(updatedUser);

      const result = await userController.update(1, updateUserDto);

      expect(userUseCase.updateUser).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      userUseCase.deleteUser.mockResolvedValue(undefined);

      const result = await userController.remove(1);

      expect(userUseCase.deleteUser).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'User deleted successfully' });
    });
  });
});