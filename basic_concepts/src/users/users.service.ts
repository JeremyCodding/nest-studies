import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createUserDto.password,
      );

      const userData = {
        nome: createUserDto.name,
        passwordHash,
        email: createUserDto.email,
      };

      const newUser = this.userRepository.create(userData);
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email já cadastrado');
      }

      throw error;
    }
  }

  async findAll(pagination?: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination;
    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
      order: {
        id: 'desc',
      },
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const userData = {
      nome: updateUserDto.name,
    };

    if (updateUserDto.password) {
      const passwordHash = await this.hashingService.hash(
        updateUserDto.password,
      );
      userData['passwordHash'] = passwordHash;
    }

    const user = await this.userRepository.preload({
      id,
      ...userData,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.id !== tokenPayload.sub) {
      throw new ForbiddenException("You can't delete an user, but yourself!");
    }

    return this.userRepository.save(user);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.id !== tokenPayload.sub) {
      throw new ForbiddenException("You can't delete an user, but yourself!");
    }

    return this.userRepository.remove(user);
  }

  async uploadPicture(
    file: Express.Multer.File,
    tokenPayload: TokenPayloadDto,
  ) {
    if (file.size < 1024) {
      throw new BadRequestException('The picture is too small');
    }

    const user = await this.findOne(tokenPayload.sub);

    const fileExtension = path
      .extname(file.originalname)
      .toLowerCase()
      .substring(1);

    const fileName = `${tokenPayload.sub}.${fileExtension}`;
    const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);

    await fs.writeFile(fileFullPath, file.buffer);

    user.picture = fileName;
    await this.userRepository.save(user);

    return user;
  }
}
