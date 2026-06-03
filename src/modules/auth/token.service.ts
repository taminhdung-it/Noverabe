import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, AccountStatusEnum, User } from '../../entites';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
@Injectable()
export class TokenService {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: any,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectRepository(Account)
        private readonly accountRepo: Repository<Account>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }
    async generateToken(accountId: string) {
        // Kiểm tra trạng thái đăng nhập và xác thực 2FA trong cache
        const accountcache = await this.cacheManager.get(accountId);
        const accountcacheauth = await this.cacheManager.get(`${accountId}_auth`);
        console.log(accountId, accountcache, accountcacheauth);
        if (accountcache === null || accountcache === undefined) {
            throw new UnauthorizedException('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
        }
        if (accountcache !== accountId) {
            throw new UnauthorizedException('accountId không hợp lệ. Vui lòng đăng nhập để tiếp tục.');
        }
        const AccountResult = await this.accountRepo.findOneBy({ uid: accountId });
        if (AccountResult?.two_factor_enabled === true) {
            if (accountcacheauth === false) {
                throw new UnauthorizedException('Bạn chưa xác thực hai yếu tố. Vui lòng xác thực để tiếp tục.');
            }
        }
        // Lấy thông tin tài khoản từ cơ sở dữ liệu
        if (AccountResult === null) {
            throw new NotFoundException('Tài khoản không tồn tại.');
        }
        const UserResult = await this.userRepo.findOneBy({ id: AccountResult!.user_id });
        if (!UserResult) {
            throw new NotFoundException('Người dùng không tồn tại.');
        }
        // Tạo payload cho token
        const AccessToken = this.jwtService.sign(
            {
                account_id: AccountResult?.uid,
                roleid: AccountResult?.role_id,
                token_version: AccountResult?.token_version,
                user_id: UserResult?.id,
            },
            {
                secret: this.configService.get<string>("jwt.access")!,
                expiresIn: '15m'
            }
        );
        const RefreshToken = this.jwtService.sign(
            {
                account_id: AccountResult?.uid,
                roleid: AccountResult?.role_id,
                token_version: AccountResult?.token_version,
                user_id: UserResult?.id,
            },
            {
                secret: this.configService.get<string>("jwt.refresh")!,
                expiresIn: '7d'
            }
        );
        if (!AccessToken && !RefreshToken) {
            throw new NotFoundException('Không tìm thấy token.');
        }
        // Cập nhật trạng thái tài khoản thành ONLINE b
        await this.accountRepo.update({ uid: accountId }, { status: AccountStatusEnum.ONLINE });
        return {
            access_token: AccessToken,
            refresh_token: RefreshToken,
            full_name: UserResult.full_name,
            avatar_url: UserResult.avatar_url,
            user_id: UserResult.id
        };
    }

    async verifyToken() {
        return 'verify token';
    }
}