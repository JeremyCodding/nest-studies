import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UserServices', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    hashingService = module.get(HashingService);
  });
  it('shoudl be defined', () => {
    expect(usersService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(hashingService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'jeremy@gmail.com',
        name: 'Jeremy',
        password: '123456',
      };

      const passwordHash = 'passwordHash';
      const newUser = { id: 1, ...createUserDto, passwordHash };

      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);
      jest.spyOn(userRepository, 'create').mockReturnValue(newUser as any);

      const result = await usersService.create(createUserDto);

      expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);
      expect(userRepository.create).toHaveBeenCalledWith({
        nome: createUserDto.name,
        passwordHash,
        email: createUserDto.email,
      });
      expect(userRepository.save).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(newUser);
    });

    it('should have a conflict exception when email already exists', async () => {
      jest.spyOn(userRepository, 'save').mockRejectedValue({ code: '23505' });

      await expect(usersService.create({} as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should return an unkown exception', async () => {
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValue(new Error('Generic Error'));

      await expect(usersService.create({} as any)).rejects.toThrow(
        new Error('Generic Error'),
      );
    });
  });

  describe('findOne', () => {
    it('should return an user if user exists', async () => {
      const userId = 1;
      const userFound = {
        id: userId,
        nome: 'Jeremy',
        email: 'jeremy@gmail.com',
        passwordHash: '123456',
      };

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(userFound as any);

      const result = await usersService.findOne(userId);

      expect(result).toEqual(userFound);
    });

    it('should return an error if user does not exists', async () => {
      const userId = 1;

      await expect(usersService.findOne(userId)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });
  });
});
