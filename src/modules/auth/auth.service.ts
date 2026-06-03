import { Account } from './../../entites/account.entity';
import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entites/user.entity';
import { AccountStatusEnum, GenderEnum, Role } from '../../entites';
import { TokenService } from './token.service';
import { RegisterDto } from './dto/register.dto';
import { UploadService } from './upload.service';
import type { } from 'multer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';


@Injectable()
export class AuthService {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: any,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        @InjectRepository(Account)
        private readonly accountRepo: Repository<Account>,
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly tokenService: TokenService,
        private readonly uploadService: UploadService
    ) { }

    async register(registerDto: RegisterDto, avatar: Express.Multer.File) {
        const userResult = await this.userRepo.save({
            full_name: registerDto.FullName,
            birth_date: registerDto.Birthday,
            gender: registerDto.Gender.toLowerCase() === 'nam' ? GenderEnum.MALE : GenderEnum.FEMALE,
        });
        const passwordHash = await bcrypt.hash(registerDto.password, 10);
        const accountResult = await this.accountRepo.save({
            username: registerDto.username,
            password_hash: passwordHash,
            email: registerDto.email,
            phone_number: registerDto.PhoneNumber,
            role_id: "1",
            user_id: userResult.id,
        });
        const uploadResult = await this.uploadService.uploadFile(avatar, registerDto.FullName, accountResult.uid, userResult.id);
        await this.userRepo.update({ id: userResult.id }, { avatar_url: uploadResult });
    }

    async login(loginDto: LoginDto) {
        // Kiểm tra tên tài khoản và mật khẩu
        const AccountResult = await this.accountRepo.findOneBy({ username: loginDto.username });
        if (AccountResult === null) {
            throw new NotFoundException('Tên người dùng không tồn tại. Vui lòng kiểm tra lại.');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, AccountResult.password_hash);
        if (isPasswordValid === null) {
            throw new UnauthorizedException('Mật khẩu không đúng. Vui lòng thử lại.');
        }
        // Kiểm tra trạng thái tài khoản
        if (AccountResult.status === AccountStatusEnum.ONLINE.toString()) {
            throw new UnauthorizedException('Tài khoản đang hoạt động.');
        } else if (AccountResult.status === AccountStatusEnum.LOCKED.toString()) {
            throw new UnauthorizedException('Tài khoản đã bị khóa.');
        }
        // Nếu tài khoản có bật 2FA, lưu trạng thái xác thực 2FA vào cache
        if (AccountResult.two_factor_enabled === true) {
            await this.cacheManager.set(`${AccountResult.uid}_auth`, false, { ttl: 900 });
        }
        await this.cacheManager.set(AccountResult.uid, AccountResult.uid, { ttl: 900 });
        console.log(await this.cacheManager.get(AccountResult.uid), await this.cacheManager.get(`${AccountResult.uid}_auth`));
        return { account_id: AccountResult.uid, verify_2fa: AccountResult.two_factor_enabled };
    }

}
