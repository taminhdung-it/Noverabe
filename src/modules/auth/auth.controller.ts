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
      message: 'Đăng nhập thành công. Vui lòng kiểm tra email để nhận mã OTP.',
      account_id: data.account_id
    };
  }

  @Post('verify-email')
  @HttpCode(200)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto, @Res() res: express.Response) {
    const isVerified = await this.emailService.verifyemail(verifyEmailDto);
    if (!isVerified) {
      throw new UnauthorizedException('Mã OTP không đúng hoặc đã hết hạn.');
    }
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
    res.cookie('full_name', tokens.full_name)
    res.cookie('avatar_url', tokens.avatar_url)
    res.json({
      message: 'Xác thực email thành công.',
      full_name: tokens.full_name,
      avatar_url: tokens.avatar_url
    });
  }
}
