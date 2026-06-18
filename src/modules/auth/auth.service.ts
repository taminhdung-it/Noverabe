import { Account } from './../../entites/account.entity';
import { ConflictException, Inject, Injectable, NotFoundException, Query, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
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

    async register(registerDto: RegisterDto) {
        const list_error = { "full_name": "họ và tên", "username": "tên người dùng", "email": "email", "phone_number": "số điện thoại" }
        let userid = ""
        try {
            // Tạo thông tin người dùng mới
            const userResult = await this.userRepo.save({
                full_name: registerDto.FullName,
                birth_date: registerDto.Birthday,
                gender: registerDto.Gender.toLowerCase() === 'nam' ? GenderEnum.MALE : GenderEnum.FEMALE,
            });
            userid = userResult.id;
            // Mã hóa mật khẩu và lưu thông tin tài khoản
            const passwordHash = await bcrypt.hash(registerDto.password, 10);
            const accountResult = await this.accountRepo.save({
                username: registerDto.username,
                password_hash: passwordHash,
                email: registerDto.email,
                phone_number: registerDto.PhoneNumber,
                role_id: "1",
                user_id: userResult.id,
            });
        } catch (error) {
            if (error instanceof QueryFailedError && (error as any).driverError?.code === '23505') {
                let name_error = ""
                for (let i in list_error) {
                    if (i === (error as any).driverError.detail.split("(")[1].split(")")[0]) {
                        name_error = list_error[i]
                    }
                }
                if ((error as any).driverError.detail.split("(")[1].split(")")[0] !== "full_name") {
                    await this.userRepo.delete({ id: userid })
                }
                throw new ConflictException(`Dữ liệu ${name_error} bị trùng`)
            }
        }
    }

    async registeradmin(registerDto: RegisterDto) {
        const list_error = { "full_name": "họ và tên", "username": "tên người dùng", "email": "email", "phone_number": "số điện thoại" }
        let userid = ""
        try {
            // Tạo thông tin người dùng mới
            const userResult = await this.userRepo.save({
                full_name: registerDto.FullName,
                birth_date: registerDto.Birthday,
                gender: registerDto.Gender.toLowerCase() === 'nam' ? GenderEnum.MALE : GenderEnum.FEMALE,
            });
            userid = userResult.id;
            // Mã hóa mật khẩu và lưu thông tin tài khoản
            const passwordHash = await bcrypt.hash(registerDto.password, 10);
            const accountResult = await this.accountRepo.save({
                username: registerDto.username,
                password_hash: passwordHash,
                email: registerDto.email,
                phone_number: registerDto.PhoneNumber,
                role_id: "2",
                user_id: userResult.id,
            });
        } catch (error) {
            if (error instanceof QueryFailedError && (error as any).driverError?.code === '23505') {
                let name_error = ""
                for (let i in list_error) {
                    if (i === (error as any).driverError.detail.split("(")[1].split(")")[0]) {
                        name_error = list_error[i]
                    }
                }
                if ((error as any).driverError.detail.split("(")[1].split(")")[0] !== "full_name") {
                    await this.userRepo.delete({ id: userid })
                }
                throw new ConflictException(`Dữ liệu ${name_error} bị trùng`)
            }
        }
    }

    async login(loginDto: LoginDto) {
        // Kiểm tra tên tài khoản và mật khẩu
        const AccountResult = await this.accountRepo.findOneBy({ username: loginDto.username });
        if (AccountResult === null) {
            throw new NotFoundException('Tên người dùng không tồn tại. Vui lòng kiểm tra lại.');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, AccountResult.password_hash);
        if (isPasswordValid === false) {
            throw new UnauthorizedException('Mật khẩu không đúng. Vui lòng thử lại.');
        }
        const RoleResult = await this.roleRepo.findOneBy({ id: AccountResult.role_id });
        if (RoleResult?.name !== "user") {
            throw new UnauthorizedException('Tài khoản của bạn không hợp lệ.')
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
        return { account_id: AccountResult.uid, verify_2fa: AccountResult.two_factor_enabled };
    }

    async logout(payload: any) {
        const token_version_new = Number(payload.token_version) + 1;
        const accountid = payload.account_id
        await this.accountRepo.update({ uid: accountid }, { status: AccountStatusEnum.OFFLINE, token_version: token_version_new.toString() });
    }
}
