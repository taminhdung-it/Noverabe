import { Body, Controller, HttpCode, Post, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify.dto';
import { EmailService } from './email.service';
import { TokenService } from './token.service';
import express from 'express';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService
  ) { }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    return {
      message: 'Đăng nhập thành công. Vui lòng xác thực danh tính.',
      account_id: data.account_id
    };
  }

  @Post('send-email')
  @HttpCode(200)
  async sendEmail(@Body("account_id") account_id: string) {
    await this.emailService.sendemail(account_id);
    return {
      message: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra và xác thực.'
    };
  }

  @Post('verify-email')
  @HttpCode(200)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto, @Res() res: express.Response) {
    const isVerified = await this.emailService.verifyemail(verifyEmailDto);
    const tokens = await this.tokenService.generateToken(verifyEmailDto.account_id);
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 phút
    })
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    res.cookie('user_id', tokens.user_id, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    res.cookie('full_name', tokens.full_name, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    res.cookie('avatar_url', tokens.avatar_url, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    res.json({
      message: isVerified.message,
      full_name: tokens.full_name,
      avatar_url: tokens.avatar_url,
    });
  }
}