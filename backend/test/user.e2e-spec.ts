import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { UserModule } from '../src/user/user.module';
import { User } from '../src/user/entities/user.entity';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
          dropSchema: true,
        }),
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a user', () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.email).toBe(createUserDto.email);
          expect(res.body.name).toBe(createUserDto.name);
          expect(res.body.age).toBe(createUserDto.age);
          expect(res.body.id).toBeDefined();
          expect(res.body.createdAt).toBeDefined();
          expect(res.body.updatedAt).toBeDefined();
        });
    });

    it('should return 400 for invalid email', () => {
      const createUserDto = {
        email: 'invalid-email',
        name: 'Test User',
        age: 25,
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);
    });

    it('should return 400 for missing required fields', () => {
      const createUserDto = {
        email: 'test@example.com',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);
    });

    it('should return 409 for duplicate email', async () => {
      const createUserDto = {
        email: 'duplicate@example.com',
        name: 'Test User',
        age: 25,
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(409);
    });
  });

  describe('/users (GET)', () => {
    it('should return empty array initially', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect([]);
    });

    it('should return all users', async () => {
      const users = [
        { email: 'user1@example.com', name: 'User 1', age: 25 },
        { email: 'user2@example.com', name: 'User 2', age: 30 },
      ];

      for (const user of users) {
        await request(app.getHttpServer())
          .post('/users')
          .send(user);
      }

      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(res.body[0].email).toBe(users[0].email);
          expect(res.body[1].email).toBe(users[1].email);
        });
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return a user by id', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto);

      const userId = createResponse.body.id;

      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(userId);
          expect(res.body.email).toBe(createUserDto.email);
          expect(res.body.name).toBe(createUserDto.name);
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .get('/users/999')
        .expect(404);
    });

    it('should return 400 for invalid id format', () => {
      return request(app.getHttpServer())
        .get('/users/invalid')
        .expect(400);
    });
  });

  describe('/users/:id (PATCH)', () => {
    it('should update a user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto);

      const userId = createResponse.body.id;
      const updateUserDto = {
        name: 'Updated User',
        age: 30,
      };

      return request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send(updateUserDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(userId);
          expect(res.body.email).toBe(createUserDto.email);
          expect(res.body.name).toBe(updateUserDto.name);
          expect(res.body.age).toBe(updateUserDto.age);
        });
    });

    it('should return 404 for non-existent user', () => {
      const updateUserDto = {
        name: 'Updated User',
      };

      return request(app.getHttpServer())
        .patch('/users/999')
        .send(updateUserDto)
        .expect(404);
    });

    it('should return 409 for duplicate email', async () => {
      const user1 = {
        email: 'user1@example.com',
        name: 'User 1',
      };
      const user2 = {
        email: 'user2@example.com',
        name: 'User 2',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(user1);

      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(user2);

      const userId = createResponse.body.id;

      return request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({ email: user1.email })
        .expect(409);
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should delete a user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto);

      const userId = createResponse.body.id;

      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('User deleted successfully');
        });

      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(404);
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .delete('/users/999')
        .expect(404);
    });
  });
});