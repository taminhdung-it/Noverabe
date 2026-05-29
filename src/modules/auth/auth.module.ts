import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../entites/account.entity';
import { Role, User } from '../../entites';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from './email.service';
import { OtpService } from './otp.service';
import { TokenService } from './token.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, User, Role]),
    ConfigModule,
    JwtModule,
    CacheModule.register({})
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    OtpService,
    TokenService
  ],
})
export class AuthModule { }
