import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { SignInDto } from './dto/sign-in.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async signUp(createUserDto: CreateUserDto) {
    // check if the email is already in use
    const sameUserList = await this.userService.find(createUserDto.email);
    if (sameUserList && sameUserList.length > 0) {
      // A user with same email id exists
      throw new BadRequestException('A user with same email id exists');
    }
    // create a salt
    const salt = randomBytes(8).toString('hex');
    // encrypt the user's password with salt
    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;
    // append the hashed value to salt
    const result = salt + '.' + hash.toString('hex');

    // create a user
    createUserDto.password = result;
    const newUser = await this.userService.create(createUserDto);

    return newUser;
  }

  async signin(signinDto: SignInDto) {
    const [similarUser] = await this.userService.find(signinDto.email);
    if (!similarUser) {
      // no user with same email id
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = similarUser.password.split('.');
    const hash = (await scrypt(signinDto.password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Password does not match');
    }
    return similarUser;
  }
}
