import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DataModule } from '../data/data.module';
import { User } from '../core/entities/user.entity';

@Module({
  imports: [DataModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
