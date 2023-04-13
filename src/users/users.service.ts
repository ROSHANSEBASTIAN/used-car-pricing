import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(createUserDto: CreateUserDto) {
    // creating an entity
    const newUser = this.repo.create({
      email: createUserDto.email,
      password: createUserDto.password,
    });
    // saving entity to DB
    return this.repo.save(newUser);
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  findAll(email: string) {
    return this.repo.find({ where: { email } });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const selUser = await this.repo.findOneBy({ id });
    if (!selUser) {
      // not found a user with the given id
      throw new Error('User not found');
    }
    Object.assign(selUser, updateUserDto);
    return this.repo.save(selUser);
  }

  async remove(id: number) {
    const selUser = await this.repo.findOneBy({ id });
    if (!selUser) {
      throw new Error('User not found');
    }
    return this.repo.remove(selUser);
  }
}
