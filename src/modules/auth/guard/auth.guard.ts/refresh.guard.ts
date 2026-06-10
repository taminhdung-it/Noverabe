import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { TokenService } from '../../token.service';
@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Kiểm tra access token trong cookies
    const refresh_token = request.cookies.refresh_token;
    if (!refresh_token) {
      console.error('Không tìm thấy refresh token.');
      throw new UnauthorizedException('Đã có lỗi xảy ra. Vui lòng đăng nhập lại.');
    }
    try {
      // Kiểm tra access token có hợp lệ không
      const decoded = await this.tokenService.verifyToken(refresh_token, 'refresh');
      request.user = decoded;
      return true;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        console.error('Token không hợp lệ.');
        throw new UnauthorizedException('Đã có lỗi xảy ra. Vui lòng đăng nhập lại.');
      }
      if (error instanceof TokenExpiredError) {
        console.error('Token đã hết hạn.');
        throw new UnauthorizedException();
      }
      console.error({ message: 'Đã có lỗi xảy ra.', error: error });
      throw new UnauthorizedException();
    }
  }
}