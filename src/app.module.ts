import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import fs from 'fs';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerModule } from '@nestjs-modules/mailer';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configservice: ConfigService) => ({
        type: 'postgres',
        host: configservice.get<string>("database.host"),
        port: configservice.get<number>("database.port"),
        username: configservice.get<string>("database.username"),
        password: configservice.get<string>("database.password"),
        database: configservice.get<string>("database.name"),
        ssl: { ca: fs.readFileSync(configservice.get<string>("database.ssl")!.toString()) },
        entities: [__dirname + '/entites/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: false,
        logging: false
      })
    }),
    JwtModule.register({}),
    CacheModule.register({}),
    AuthModule,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
