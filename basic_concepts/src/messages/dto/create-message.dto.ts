import {
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  readonly text: string;

  @IsPositive()
  fromId: number;

  @IsPositive()
  toId: number;

  // @IsString()
  // @IsNotEmpty()
  // @MinLength(2)
  // @MaxLength(255)
  // readonly from: string;

  // @IsString()
  // @IsNotEmpty()
  // @MinLength(2)
  // @MaxLength(255)
  // readonly to: string;
}
