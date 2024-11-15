import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { ConfigAccountDto } from '../dtos/config-account.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authService: AuthService
  ) { }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }


  async deleteUser(id: string): Promise<void> {
    const deleteUser = await this.userRepository.delete(id)

    if (deleteUser.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    } {
      throw new HttpException('User deleted', 200)
    }
  }

  phraseToUpperCase(text: string){
    const textSeparated =  text.split(' ')

    for(let i = 0; i < textSeparated.length; i++){
      textSeparated[i] = textSeparated[i][0].toUpperCase() + textSeparated[i].slice(1)
    }

    return textSeparated.join(' ')
  }

  async changeInfo(configAccountDto: ConfigAccountDto) {
    const { names, lastNames, password, email, url } = configAccountDto;

    const user: User = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.names = this.phraseToUpperCase(names);
    user.lastNames = this.phraseToUpperCase(lastNames);;
    user.password = await this.authService.hashPassword(password);
    user.email = email;

    if (user.hasProfile) {
      const existingUrl = await this.userRepository.findOne({ where: { profileUrl: url } });
      if (existingUrl) {
        throw new ConflictException('URL already in use')
      } {
        user.profileUrl = url;
      }

    }

    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user information');
    }

    throw new HttpException('User informartion changed successfully', 200);
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
