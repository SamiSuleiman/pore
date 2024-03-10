import { IsDate, IsEmail, IsIn, IsString } from 'class-validator';
import { Role, roles } from '../core/auth.model';

export class UserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  avatar: string;

  @IsIn(roles)
  role: Role;

  @IsDate()
  createdAt: Date;
}

export class UserOverviewDto {
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
  wordCount: number;
  tagCount: number;
  sourceCount: number;
  linkCount: number;
}
