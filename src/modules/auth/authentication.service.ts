import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import speakeasy from 'speakeasy';
import { Account } from '../../entites/account.entity';
import { In, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as qrcode from 'qrcode';
@Injectable()
export class AuthenticationService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepo: Repository<Account>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: any,
    ) { }

    async createTwoFactor(accountId: string) {
        // Kiểm tra accountId có tổn tại không?
        const AccountResult = await this.accountRepo.findOneBy({ uid: accountId });
        if (AccountResult === null) {
            throw new NotFoundException('Tài khoản không tồn tại. Vui lòng kiểm tra lại.');
        }
        // Tạo secret cho 2FA và lưu vào cơ sở dữ liệu
        const secret = speakeasy.generateSecret({ length: 20, issue: 'Novera', name: AccountResult.username });
        await this.accountRepo.update({ uid: accountId }, { two_factor_secret: secret.base32 });
        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
        return { qr_code: qrCodeUrl };
    }

    verifyotp(secret: string, otp: string) {
        // Kiểm tra mã OTP
        const isValid = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: otp,
            window: 1,
        });
        if (isValid === false) {
            throw new UnauthorizedException('Mã OTP không hợp lệ. Vui lòng kiểm tra lại.');
        }
    }

    async enableTwoFactor(accountId: string, otp: string) {
        // Kiểm tra accountId có tổn tại không?
        const AccountResult = await this.accountRepo.findOneBy({ uid: accountId });
        if (AccountResult === null) {
            throw new NotFoundException('Tài khoản không tồn tại. Vui lòng kiểm tra lại.');
        }
        if (AccountResult.two_factor_secret === null || AccountResult.two_factor_secret === undefined) {
            throw new NotFoundException('Bạn chưa tạo mã 2FA. Vui lòng tạo mã 2FA để tiếp tục.');
        }
        // Kiểm tra mã OTP
        this.verifyotp(AccountResult.two_factor_secret!, otp);
        // Kích hoạt 2FA cho tài khoản
        await this.accountRepo.update({ uid: accountId }, { two_factor_enabled: true });
    }

    async disableTwoFactor(accountId: string, otp: string) {
        // Kiểm tra accountId có tổn tại không?
        const AccountResult = await this.accountRepo.findOneBy({ uid: accountId });
        if (AccountResult === null) {
            throw new NotFoundException('Tài khoản không tồn tại. Vui lòng kiểm tra lại.');
        }
        if (AccountResult.two_factor_secret === null || AccountResult.two_factor_secret === undefined) {
            throw new NotFoundException('Bạn chưa tạo mã 2FA. Vui lòng tạo mã 2FA để tiếp tục.');
        }
        // Kiểm tra mã OTP
        this.verifyotp(AccountResult.two_factor_secret!, otp);
        // Vô hiệu hóa 2FA cho tài khoản
        await this.accountRepo.update({ uid: accountId }, { two_factor_enabled: false });
    }

    async vefifyTwoFactor(accountId: string, otp: string) {
        // Kiểm tra trạng thái đăng nhập và xác thực 2FA trong cache
        const accountcache = await this.cacheManager.get(accountId);
        const accountcacheauth = await this.cacheManager.get(`${accountId}_auth`);
        if (accountcache === null || accountcache === undefined) {
            throw new NotFoundException('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
        }
        if (accountcache !== accountId) {
            throw new UnauthorizedException('accountId không hợp lệ. Vui lòng đăng nhập để tiếp tục.');
        }
        if (accountcacheauth === null || accountcacheauth === undefined) {
            throw new NotFoundException('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
        }
        // Lấy thông tin tài khoản từ cơ sở dữ liệu
        const AccountResult = await this.accountRepo.findOneBy({ uid: accountId });
        if (AccountResult === null) {
            throw new NotFoundException('Tài khoản không tồn tại. Vui lòng kiểm tra lại.');
        }
        if (AccountResult.two_factor_enabled === false) {
            throw new UnauthorizedException('Bạn chưa mở xác thực 2 yếu tố.')
        }
        this.verifyotp(AccountResult.two_factor_secret!, otp);
        await this.cacheManager.set(`${accountId}_auth`, true, { ttl: 900 });
    }
}