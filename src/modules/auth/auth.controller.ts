import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Post, Res, UnauthorizedException, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './token.service';
import express from 'express';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly authenticationService: AuthenticationService
  ) { }
  @UseInterceptors(FileInterceptor('file'))
  @Post('register')
  @HttpCode(201)
  async register(@Body() registerDto: RegisterDto, @UploadedFile() file: Express.Multer.File, @Res() res: express.Response) {
    if (file === undefined || file === null) {
      throw new NotFoundException('Không tìm thấy tệp.');
    }
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Tệp tải lên phải là ảnh.');
    }
    await this.authService.register(registerDto, file);
    res.json({ message: 'Đăng ký thành công.' });
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    if (data.verify_2fa) {
      return {
        message: 'Đăng nhập thành công. Vui lòng xác thực danh tính.',
        account_id: data.account_id,
        verify_2fa: data.verify_2fa,
      };
    } else {
      return {
        message: 'Đăng nhập thành công.',
        account_id: data.account_id,
      }
    }
  }

  @Post('verify-2fa')
  @HttpCode(200)
  async verifyTwoFactor(@Body() body: { account_id: string, otp: string }) {
    await this.authenticationService.vefifyTwoFactor(body.account_id, body.otp);
    return {
      message: 'Xác thực hai yếu tố thành công.'
    };
  }

  @Post('set-tokens')
  @HttpCode(201)
  async setTokens(@Body() body: { account_id: string }, @Res() res: express.Response) {
    const tokens = await this.tokenService.generateToken(body.account_id);
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
    res.json({
      full_name: tokens.full_name,
      avatar_url: tokens.avatar_url,
    });
  }
}