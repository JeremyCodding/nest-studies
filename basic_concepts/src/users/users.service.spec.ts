import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

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

      jest.spyOn(hashingService, 'hash').mockResolvedValue('passwordHash');

      await usersService.create(createUserDto);

      expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);
      expect(userRepository.create).toHaveBeenCalledWith({
        nome: createUserDto.name,
        passwordHash: 'passwordHash',
        email: createUserDto.email,
      });
    });
  });
});
