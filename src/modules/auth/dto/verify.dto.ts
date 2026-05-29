import { IsNotEmpty, Matches } from "class-validator";

export class VerifyEmailDto {
    @IsNotEmpty()
    account_id!: string;

    @IsNotEmpty()
    @Matches(/^[A-Za-z][A-Za-z0-9._-]+@[A-Za-z]+\.(com)$/, { message: 'Email không hợp lệ.' })
    email!: string;

    @IsNotEmpty()
    @Matches(/^[0-9]{6}$/, { message: 'Mã OTP không hợp lệ.' })
    otp!: string;
}