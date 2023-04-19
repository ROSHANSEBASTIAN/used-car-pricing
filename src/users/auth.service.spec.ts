import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService creation', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  // to run before each test
  beforeEach(async () => {
    const users: User[] = [];
    // creating a fake copy of userService
    fakeUserService = {
      // we are defining fake implementation of find() and create().
      // Only these two modules, because only these two methods of UsersService are used in AuthService
      // Promise is used because, both functions are async in nature.
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email == email);
        return Promise.resolve(filteredUsers);
      }, // will return an empty array when find is called.
      create: (createUserDto: CreateUserDto) => {
        const newUser = {
          id: Math.random(),
          email: createUserDto.email,
          password: createUserDto.password,
        } as User;
        users.push(newUser);
        return Promise.resolve(newUser);
      },
    };

    // creating a DI container
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUserService }, // this means that whenever the instance of UsersService is asked, please give fakeUserService
      ],
    }).compile();
    // creating an instance of service with its dependencies already injected.
    service = module.get(AuthService);
  });

  // tests
  it('Can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Create a new user with salted and hashed password', async () => {
    const user = await service.signUp({
      email: 'irene@gmail.com',
      password: 'IamIrene',
    });
    const [salt, hash] = user.password.split('.');

    // our testing conditions
    expect(user.password).not.toEqual('IamIrene');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Check if an email already exists during signup', async () => {
    await service.signUp({ email: 'av', password: 'b' });

    // if there is a user already with same email id, then a BadRequestException will be thrown. So wrapping inside try catch
    await expect(
      service.signUp({ email: 'av', password: 'b' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('Testing sign in flow', async () => {
    await expect(service.signin({ email: 'a', password: 'b' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Throws if an invalid password is provided', async () => {
    await service.signUp({ email: 'a', password: 'b' });

    await expect(
      service.signin({ email: 'a', password: 'bc' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('Returns a user if password is correct', async () => {
    await service.signUp({ email: 'anyemail', password: 'salt.password' });

    const selUser = await service.signin({
      email: 'anyemail',
      password: 'salt.password',
    });

    expect(selUser).toBeDefined();
  });
});
