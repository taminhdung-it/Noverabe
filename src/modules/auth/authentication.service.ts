import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import speakeasy from 'speakeasy';
import { Account } from '../../entites/account.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
@Injectable()
export class AuthenticationService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepo: Repository<Account>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: any,
    ) { }
    async vefifyTwoFactor(accountId: string, otp: string) {
        // Kiểm tra trạng thái đăng nhập và xác thực 2FA trong cache
        const accountcache = await this.cacheManager.get(accountId);
        const accountcacheauth = await this.cacheManager.get(`${accountId}_auth`);
        if (accountcache === null || accountcache === undefined) {
            throw new NotFoundException('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
        }
        if (accountcache !== accountId) {
            throw new NotFoundException('accountId không hợp lệ. Vui lòng đăng nhập để tiếp tục.');
        }
        if (accountcacheauth === null || accountcacheauth === undefined) {
            throw new NotFoundException('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
        }
        // Lấy thông tin tài khoản từ cơ sở dữ liệu
        const AccountResult = await this.accountRepo.findOneBy({ uid: accountId });
        if (AccountResult === null) {
            throw new NotFoundException('Tài khoản không tồn tại. Vui lòng kiểm tra lại.');
        }
        // Kiểm tra mã OTP
        const isValid = speakeasy.totp.verify({
            secret: AccountResult.two_factor_secret!,
            encoding: 'base32',
            token: otp,
            window: 1,
        });
        if (isValid === false || isValid === null || isValid === undefined) {
            throw new NotFoundException('Mã OTP không hợp lệ. Vui lòng kiểm tra lại.');
        }
        await this.cacheManager.set(`${accountId}_auth`, true, { ttl: 900 });
    }
}