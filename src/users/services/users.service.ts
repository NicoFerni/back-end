import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async deleteUser(id: string): Promise <void>{
    const deleteUser = await this.userRepository.delete(id)

    if (deleteUser.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }{
      throw new HttpException('User deleted', 200)
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    const user: User = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  getUsers() {
    return this.userRepository.find();
  }
}
