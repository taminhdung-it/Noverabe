import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Post, Res, Req, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './token.service';
import express from 'express';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessGuard } from './guard/auth.guard.ts/access.guard';
import { UseGuards } from '@nestjs/common';
import { RefreshGuard } from './guard/auth.guard.ts/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly authenticationService: AuthenticationService
  ) { }
  @Post('register')
  @HttpCode(201)
  async register(@Body() registerDto: RegisterDto, @Res() res: express.Response) {
    await this.authService.register(registerDto);
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

  @UseGuards(AccessGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: express.Request, @Res() res: express.Response) {
    const payload = (req as any).user;
    await this.authService.logout(payload);
    res.clearCookie('access_token')
    res.clearCookie('refresh_token');
    res.json({ message: "Đăng xuất thành công" })
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
  async setTokens(@Body() body: { account_id: string }, @Res() res: express.Response, @Req() req: express.Request) {
    const tokens = await this.tokenService.generateToken(body.account_id);
    const proto = req.headers['x-forwarded-proto']
    const isSecure =
      req.secure ||
      (Array.isArray(proto) ? proto.includes('https') : proto === 'https')
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: isSecure ? "lax" : "none",
      maxAge: 15 * 60 * 1000, // 15 phút
    })
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: isSecure ? "lax" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    res.json({
      full_name: tokens.full_name,
      avatar_url: tokens.avatar_url,
    });
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: express.Request, @Res() res: express.Response) {
    const proto = req.headers['x-forwarded-proto']
    const isSecure =
      req.secure ||
      (Array.isArray(proto) ? proto.includes('https') : proto === 'https')
    const payload = (req as any).user;
    const data = await this.tokenService.refreshToken(payload)
    res.cookie('access_token', data.access_token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 phút
    })
    res.cookie('refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    res.json({ message: "Đã làm mới token. Vui lòng gọi api chức năng." })
  }
}