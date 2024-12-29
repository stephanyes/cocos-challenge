import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities';
import { AppService } from '../app.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AppService, UserService],
  exports: [TypeOrmModule],
  controllers: [UserController],
})
export class UsersModule {}
