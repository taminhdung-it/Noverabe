import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { VerifyEmailDto } from './dto/verify.dto';
import { Resend } from 'resend'
import { InjectRepository } from '@nestjs/typeorm';
import { Account, AccountStatusEnum } from '../../entites';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: any,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) { }
  async sendemail(account_id: string) {
    const Accountcheck = await this.cacheManager.get("accountid");
    if (!Accountcheck && Accountcheck !== account_id) {
      throw new UnauthorizedException('Bạn chưa đăng nhập. Vui lòng đăng nhập để nhận mã OTP.');
    }
    const AccountResult = await this.accountRepo.findOneBy({ uid: account_id });
    if (!AccountResult) {
      throw new NotFoundException('Tài khoản không tồn tại. Vui lòng kiểm tra lại.');
    }
    const resend = new Resend(this.configService.get('resend.apiKey'))
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.cacheManager.set(AccountResult.email, otp, { ttl: 300 }); // Lưu OTP vào cache với thời gian sống 5 phút
    await this.mailerService.sendMail({
      to: "monred2001@gmail.com",
      subject: 'OTP',
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Noverabe Email Verification</title>
    </head>
    <body style="margin:0;padding:0;background:#eef2ff;font-family:Arial,Helvetica,sans-serif;color:#111827;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#eef2ff;margin:0;padding:32px 14px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background:#ffffff;border-radius:22px;overflow:hidden;box-shadow:0 18px 45px rgba(79,70,229,0.18);">
              <tr>
                <td align="center" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:36px 28px;color:#ffffff;">
                  <div style="font-size:13px;letter-spacing:3px;text-transform:uppercase;opacity:0.82;">Novera</div>
                  <h1 style="margin:12px 0 0;font-size:28px;line-height:1.25;font-weight:800;">Email Verification</h1>
                  <p style="margin:10px 0 0;font-size:15px;line-height:1.6;opacity:0.9;">Secure your account with the code below.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:38px 34px 34px;">
                  <h2 style="margin:0;color:#111827;font-size:22px;line-height:1.35;">Verify your email</h2>
                  <p style="margin:14px 0 0;color:#4b5563;font-size:15px;line-height:1.75;">
                    Use this one-time password to continue signing in to your Noverabe account.
                  </p>

                  <div style="margin:32px 0;text-align:center;">
                    <div style="display:inline-block;background:#f8fafc;border:1px solid #e0e7ff;border-radius:16px;padding:18px 28px;color:#111827;font-size:34px;line-height:1;font-weight:800;letter-spacing:9px;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.8);">
                      ${otp}
                    </div>
                  </div>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#fff7ed;border:1px solid #fed7aa;border-radius:14px;margin:0 0 28px;">
                    <tr>
                      <td style="padding:14px 16px;color:#9a3412;font-size:14px;line-height:1.6;">
                        This code will expire in <strong>5 minutes</strong>. Do not share it with anyone.
                      </td>
                    </tr>
                  </table>

                  <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;" />
                  <p style="margin:0;color:#8a94a6;font-size:13px;line-height:1.7;">
                    If you did not request this verification code, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" style="background:#f9fafb;padding:20px 28px;color:#9ca3af;font-size:12px;line-height:1.6;">
                  &copy; ${new Date().getFullYear()} Noverabe. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
            `,
    });
    //     const result = await resend.emails.send({
    //       from: this.configService.get('resend.fromEmail')!,
    //       to: AccountResult.email,
    //       subject: '[Noverabe] Verification Code',
    //       html: `
    // <!DOCTYPE html>
    // <html lang="en">
    // <head>
    //   <meta charset="UTF-8" />
    //   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    //   <title>Noverabe Email Verification</title>
    // </head>
    // <body style="margin:0;padding:0;background:#eef2ff;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    //   <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#eef2ff;margin:0;padding:32px 14px;">
    //     <tr>
    //       <td align="center">
    //         <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background:#ffffff;border-radius:22px;overflow:hidden;box-shadow:0 18px 45px rgba(79,70,229,0.18);">
    //           <tr>
    //             <td align="center" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:36px 28px;color:#ffffff;">
    //               <div style="font-size:13px;letter-spacing:3px;text-transform:uppercase;opacity:0.82;">Novera</div>
    //               <h1 style="margin:12px 0 0;font-size:28px;line-height:1.25;font-weight:800;">Email Verification</h1>
    //               <p style="margin:10px 0 0;font-size:15px;line-height:1.6;opacity:0.9;">Secure your account with the code below.</p>
    //             </td>
    //           </tr>
    //           <tr>
    //             <td style="padding:38px 34px 34px;">
    //               <h2 style="margin:0;color:#111827;font-size:22px;line-height:1.35;">Verify your email</h2>
    //               <p style="margin:14px 0 0;color:#4b5563;font-size:15px;line-height:1.75;">
    //                 Use this one-time password to continue signing in to your Noverabe account.
    //               </p>

    //               <div style="margin:32px 0;text-align:center;">
    //                 <div style="display:inline-block;background:#f8fafc;border:1px solid #e0e7ff;border-radius:16px;padding:18px 28px;color:#111827;font-size:34px;line-height:1;font-weight:800;letter-spacing:9px;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.8);">
    //                   ${otp}
    //                 </div>
    //               </div>

    //               <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#fff7ed;border:1px solid #fed7aa;border-radius:14px;margin:0 0 28px;">
    //                 <tr>
    //                   <td style="padding:14px 16px;color:#9a3412;font-size:14px;line-height:1.6;">
    //                     This code will expire in <strong>5 minutes</strong>. Do not share it with anyone.
    //                   </td>
    //                 </tr>
    //               </table>

    //               <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;" />
    //               <p style="margin:0;color:#8a94a6;font-size:13px;line-height:1.7;">
    //                 If you did not request this verification code, you can safely ignore this email.
    //               </p>
    //             </td>
    //           </tr>
    //           <tr>
    //             <td align="center" style="background:#f9fafb;padding:20px 28px;color:#9ca3af;font-size:12px;line-height:1.6;">
    //               &copy; ${new Date().getFullYear()} Noverabe. All rights reserved.
    //             </td>
    //           </tr>
    //         </table>
    //       </td>
    //     </tr>
    //   </table>
    // </body>
    // </html>
    //         `,
    //     });
    return 'Email sent successfully';
  }

  async verifyemail(verifyEmailDto: VerifyEmailDto) {
    const Accountcheck = await this.cacheManager.get("accountid");
    if (!Accountcheck && Accountcheck !== verifyEmailDto.account_id) {
      throw new UnauthorizedException('Bạn chưa đăng nhập. Vui lòng đăng nhập để nhận mã OTP.');
    }
    const AccountResult = await this.accountRepo.findOneBy({ uid: verifyEmailDto.account_id });
    if (!AccountResult) {
      throw new NotFoundException('Tài khoản không tồn tại. Vui lòng kiểm tra lại.');
    }
    const otp = await this.cacheManager.get(AccountResult!.email);
    if (!otp) {
      throw new UnauthorizedException('Bạn chưa gửi mã OTP. Vui lòng gửi mã OTP để xác thực email.');
    }
    if (otp === verifyEmailDto.otp) {
      await this.cacheManager.del(AccountResult!.email);
      await this.cacheManager.del("accountid");
      await this.accountRepo.update({ uid: verifyEmailDto.account_id }, { status: AccountStatusEnum.ONLINE });
      return { message: 'Đã xác thực email thành công.' };
    } else {
      throw new UnauthorizedException('Mã OTP không đúng. Vui lòng kiểm tra lại.');
    }
  }

}
