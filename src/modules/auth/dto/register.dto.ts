import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    username!: string;

    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%^&*])[A-Za-z\d!@#\$%^&*]{6,}$/, { message: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.' })
    password!: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Email không hợp lệ.' })
    email!: string;

    @IsNotEmpty()
    @Matches(/^(?:\+84|84|0)(3|5|7|8|9)[0-9]{8}$/, { message: 'Số điện thoại không hợp lệ.' })
    PhoneNumber!: string;

    @IsNotEmpty()
    @Matches(/^[A-Za-zÀ-ỹ]{2,}( [A-Za-zÀ-ỹ]{2,}){2,}$/, { message: 'Họ tên phải có ít nhất 3 từ, mỗi từ có ít nhất 2 ký tự.' })
    FullName!: string;

    @IsNotEmpty()
    @Matches(/^(197[0-9]|[2-9][0-9]{3})\-(0[1-9]|1[0-2])\-(0[1-9]|[12][0-9]|3[01])$/, { message: 'Ngày sinh phải có định dạng yyyy-MM-dd.' })
    Birthday!: string;

    @IsNotEmpty()
    @Matches(/^(Nam|Nữ)$/, { message: 'Giới tính phải là Nam hoặc Nữ.' })
    Gender!: string;
}