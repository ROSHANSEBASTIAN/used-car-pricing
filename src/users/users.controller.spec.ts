import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  //
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  describe('Tests for Users Controller', () => {
    beforeEach(async () => {
      // following methods of UserService and AuthService are used in UserController
      fakeUserService = {
        findOne: (id: number) =>
          Promise.resolve({
            id,
            email: 'test@gmail.com',
            password: 'asdf',
          } as User),
        findAll: (email: string) => {
          return Promise.resolve([{ id: 1, email, password: 'asdfg' } as User]);
        },
        // update: () => {},
        // remove: () => {},
      };
      fakeAuthService = {
        signin: ({ email, password }) => {
          return Promise.resolve({ id: 1, email, password } as User);
        },
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          { provide: UsersService, useValue: fakeUserService },
          { provide: AuthService, useValue: fakeAuthService },
        ],
      }).compile();

      controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  it('Return all the users with same email id', async () => {
    const user = await controller.findAll('asdf@gmail.com');

    expect(user.length).toEqual(1);
    expect(user[0].email).toEqual('asdf@gmail.com');
  });

  it('Find a single user', async () => {
    const user = await controller.findOne('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  it('Throws an error when a user with the id is not found', async () => {
    fakeUserService.findOne = () => null;
    await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('Signing in updates session object and returns logged in user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      {
        email: 'asdf@gmail.com',
        password: 'asdf',
      },
      session,
    );

    expect(user).toBeDefined();
    expect(session).toBeDefined();
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
