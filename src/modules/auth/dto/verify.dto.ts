import { IsNotEmpty, Matches } from "class-validator";

export class VerifyEmailDto {
    @IsNotEmpty()
    account_id!: string;

    @IsNotEmpty()
    @Matches(/^[0-9]{6}$/, { message: 'Mã OTP không hợp lệ.' })
    otp!: string;
}