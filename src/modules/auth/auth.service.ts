import { Account } from './../../entites/account.entity';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entites/user.entity';
import { AccountStatusEnum, GenderEnum, Role } from '../../entites';
import { TokenService } from './token.service';
import { EmailService } from './email.service';
import { OtpService } from './otp.service';
import { RegisterDto } from './dto/register.dto';
import { UploadService } from './upload.service';


@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        @InjectRepository(Account)
        private readonly accountRepo: Repository<Account>,
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly tokenService: TokenService,
        private readonly emailService: EmailService,
        private readonly otpService: OtpService,
        private readonly uploadService: UploadService
    ) { }

    async register(reigsterDto: RegisterDto) {
        const userResult = await this.userRepo.save({
            full_name: reigsterDto.FullName,
            birth_date: reigsterDto.Birthday,
            gender: reigsterDto.Gender.toLowerCase() === 'nam' ? GenderEnum.MALE : GenderEnum.FEMALE,
        });
        const passwordHash = await bcrypt.hash(reigsterDto.password, 10);
        const roleResult = await this.roleRepo.findOneBy({ id: reigsterDto.RoleId.toString() });
        if (!roleResult) {
            throw new NotFoundException('Vai trò không tồn tại. Vui lòng kiểm tra lại.');
        }
        const accountResult = await this.accountRepo.save({
            username: reigsterDto.username,
            password_hash: passwordHash,
            email: reigsterDto.email,
            phone_number: reigsterDto.PhoneNumber,
            role_id: roleResult.id,
            user_id: userResult.id,
        });
        const uploadResult = await this.uploadService.uploadFile(reigsterDto.avatar, reigsterDto.FullName, accountResult.uid, userResult.id);
        await this.userRepo.update({ id: userResult.id }, { avatar_url: uploadResult });
    }

    async login(loginDto: LoginDto) {
        const Accountres = await this.accountRepo.findOneBy({ username: loginDto.username });
        if (!Accountres) {
            throw new NotFoundException('Tên người dùng không tồn tại. Vui lòng kiểm tra lại.');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, Accountres.password_hash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Mật khẩu không đúng. Vui lòng thử lại.');
        }
        // Kiểm tra trạng thái tài khoản
        if (Accountres.status === AccountStatusEnum.ONLINE.toString()) {
            throw new UnauthorizedException('Tài khoản đang hoạt động.');
        } else if (Accountres.status === AccountStatusEnum.LOCKED.toString()) {
            throw new UnauthorizedException('Tài khoản đã bị khóa.');
        }
        await this.emailService.sendemail(Accountres.email);
        return { account_id: Accountres.uid };
    }

}
