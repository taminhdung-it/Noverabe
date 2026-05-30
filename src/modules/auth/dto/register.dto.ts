import { IS_ALPHA, IsNotEmpty, Matches } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    username!: string;

    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%^&*])[A-Za-z\d!@#\$%^&*]{6,}$/, { message: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.' })
    password!: string;

    @IsNotEmpty()
    @Matches(/^[A-Za-z][A-Za-z0-9._-]+@[A-Za-z]+\.(com)$/, { message: 'Email không hợp lệ.' })
    email!: string;

    @IsNotEmpty()
    @Matches(/^(?:\+84|84|0)(3|5|7|8|9)[0-9]{8}$/, { message: 'Số điện thoại không hợp lệ.' })
    PhoneNumber!: string;

    @IsNotEmpty()
    RoleId!: number;

    @IsNotEmpty()
    FullName!: string;

    @IsNotEmpty()
    Birthday!: Date;

    @IsNotEmpty()
    Gender!: string;

    @IsNotEmpty()
    avatar!: any;
}