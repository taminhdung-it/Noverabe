import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, User } from '../../entites';
import { Repository } from 'typeorm';
@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectRepository(Account)
        private readonly accountRepo: Repository<Account>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }
    async generateToken(accountId: string) {
        const Accountres = await this.accountRepo.findOneBy({ uid: accountId });
        if (!Accountres) {
            throw new NotFoundException('Tài khoản không tồn tại.');
        }
        const Userres = await this.userRepo.findOneBy({ id: Accountres!.user_id });
        if (!Userres) {
            throw new NotFoundException('Người dùng không tồn tại.');
        }
        const AccessToken = this.jwtService.sign(
            {
                account_id: Accountres?.uid,
                roleid: Accountres?.role_id,
                token_version: Accountres?.token_version,
                user_id: Userres?.id,
            },
            {
                secret: this.configService.get<string>("jwt.access")!,
                expiresIn: '15m'
            }
        );
        const RefreshToken = this.jwtService.sign(
            {
                account_id: Accountres?.uid,
                roleid: Accountres.role_id,
                token_version: Accountres.token_version,
                user_id: Userres?.id,
            },
            {
                secret: this.configService.get<string>("jwt.refresh")!,
                expiresIn: '7d'
            }
        );
        if (!AccessToken && !RefreshToken) {
            throw new NotFoundException('Không tìm thấy token.');
        }
        return {
            access_token: AccessToken,
            refresh_token: RefreshToken,
            full_name: Userres.full_name,
            avatar_url: Userres.avatar_url,
            user_id: Userres.id
        };
    }

    async verifyToken() {
        return 'verify token';
    }
}