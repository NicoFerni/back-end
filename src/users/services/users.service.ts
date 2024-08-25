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

  async changeInfo(configAccountDto: ConfigAccountDto) {
    const { names, lastNames, password, email, url } = configAccountDto;
    
    const user: User = await this.userRepository.findOne({ where: { email } });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    user.names = names;
    user.lastNames = lastNames;
    user.password = await this.authService.hashPassword(password);
    user.email = email;
  
    if (user.hasProfile) {
      const existingUrl = await this.userRepository.findOne({ where: { profileUrl: url } });
      const web = 'https://programadoresweb.netlify.app/';
  
      if (!existingUrl) {
        user.profileUrl = web.concat(url);
      } else {
        throw new ConflictException('URL is already in use');
      }
    }
  
 
     try {
       await this.userRepository.save(user);
       console.log('User information updated successfully:', user);  // Debug log
     } catch (error) {
       console.error('Error saving user information:', error);  // Debug log
       throw new InternalServerErrorException('Failed to update user information');
     }
  
    throw new HttpException('Action done successfully', 200);
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
