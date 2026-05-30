<p align="center">
  <img
    src="https://res.cloudinary.com/dgfwcrbyg/image/upload/v1780138807/Novera_yrpmft.png"
    width="120"
    alt="Novera Logo"
  />
</p>

<h1 align="center">Novera</h1>

## Mô tả

Một dự án máy chủ được xây dựng trên framework
<a href="https://nodejs.org">Node.js</a>

## Cài đặt Dự án

**1.Clone dự án về**

- Mở terminal vàc copy lệnh dưới đây:

```bash
$ git clone https://github.com/yourname/novera.git
```

**2.Tạo file môi trường**

- Tạo 1 file tên .env và copy đoạn code dưới đây:

```env
# ============================================================
#                         Application
# ============================================================

APPLICATION_NAME=
APPLICATION_ENV=
APPLICATION_DEBUG=
APPLICATION_HOST=
APPLICATION_PORT=
APPLICATION_URL=

# ============================================================
#                         Database
# ============================================================

DATABASE_CONNECTION=
DATABASE_HOST=
DATABASE_PORT=
DATABASE_NAME=
DATABASE_USERNAME=
DATABASE_PASSWORD=
SSL_PATH=

#=============================================================
#                           JWT
#=============================================================

ACCESS_SECRET=
REFRESH_SECRET=
JWT_SECRET=
BCRYPT_ROUNDS=10

#=============================================================
#                         Twilio
#=============================================================

ACCOUNT_SID=
AUTH_TOKEN=
PHONE_NUMBER=
VERIFY_SERVICE_SID=

#=============================================================
#                         Email
#=============================================================

EMAIL_USER=
EMAIL_PASSWORD=

#=============================================================
#                       Cloudinary
#=============================================================

CLOUD_NAME=
API_KEY=
API_SECRET=
```

- Thêm các dữ liệu bạn hoặc người khác cung cấp.

**3.Cài đặt thư viện**

- Mở terminal vàc copy lệnh dưới đây:

```bash
$ pnpm install
```

**4.Chạy dự án**

- Mở terminal vàc copy lệnh dưới đây:

```bash
# development mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

**6.Triển khai dự án**

<p>Sau khi bạn đã hoàn thiện dự án mình rồi. Bạn có thể triển khai server của bạn lên các nền tảng đám mây.</p>

- Bạn có thể tham khảo qua một nền tảng triển khai phổ biến như [Render](https://render.com/) cho phép bạn tải lên file môi trường và cài đặt tên miền bạn muốn.
- Bạn cần một tên miền free có thể trao dồi kinh nghiệm có thể thông qua [DigitalPlat Domain](https://domain.digitalplat.org/) giúp bạn có tên miền như thật thời hạn lên tới 1 năm.

## Thông tin dự án

<p>Dự án web đọc truyện tranh cũng là đồ án tâm huyết, Dự án đang xây dựng đem tới một web đọc truyện lý tưởng cho những người hay đọc truyện trong những thời gian rảnh rỗi</p>

<p>Các công nghệ sử dụng:</p>

- Backend: [Nestjs](https://nestjs.com/) <img src="https://nestjs.com/img/logo-small.svg" alt="" width="23" align="center" style="background:white;border-radius:100px">
- Frontend: [Nextjs](https://nestjs.com/) <img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png" alt="" width="25" align="center" style="background:white;border-radius:100px">
- Database: [Avien](https://aiven.io/) <img src="https://avatars.githubusercontent.com/u/14290521?s=200&v=4" alt="" width="25" align="center" style="background:white;border-radius:100px">
- Resource: [Cloudinary](https://cloudinary.com/) <img src="https://avatars.githubusercontent.com/u/1460763?s=200&v=4" alt="" width="20" align="center" style="background:white;border-radius:100px">
- Deploy backend: [Render]() <img src="https://avatars.githubusercontent.com/u/36424661?s=200&v=4" alt="" width="20" align="center" style="background:white;border-radius:100px">
- Deploy frontend: [Cloudflare]() <img src="https://avatars.githubusercontent.com/u/314135?s=200&v=4" alt="" width="20" align="center" style="background:white;border-radius:100px">
- Domain: [DigitalPlat Domain](https://domain.digitalplat.org/) <img src="https://pbs.twimg.com/media/HJiSaFyWwAUAgXw.jpg" alt="" width="20" align="center" style="background:white;border-radius:100px">
- Otp phone: [Twilio](https://www.twilio.com/en-us) <img src="https://avatars.githubusercontent.com/u/109142?s=280&v=4" alt="" width="20" align="center" style="background:white;border-radius:100px">
- Source code: [Github](https://github.com/) <img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg" alt="" width="20" align="center" style="background:white;border-radius:100px">

<p>Các công cụ khác bao gồm:</p>

- Thông tin dự án: Google sheet
- Thảo luận: Microsoft teams

<p>Dự án bao gồm các tính năng như:</p>

- Đăng nhập, đăng kí người dùng.
- Tìm kiếm và lọc truyện tranh theo từ khoá, danh mục.
- Tính năng thanh toán và giới hạn thời gian đọc bằng xu vàng.
- Tính năng tải lên truyện tranh mình mong muốn.
- Tương tác like, bình luận trên chương truyện đang đọc.
- Quản lý có thể duyệt truyện tranh, tài khoản người dùng.

<p>Các kĩ năng có trong dự án như:</p>

- JWT làm mới liCloudflareên tục.
- Phân chia service/controller/module.
- Gửi email, otp điện thoại và xác nhận khi đăng nhập.
- Tự gắn tự lấy Token bằng bảo mật Cookie HttpOnly. Sử dụng Token Version để khoá token
- Lưu Cache.
- Tải tài nguyên lên cloud.
- Sử dụng Postgres qua host database.
- Deploy lên host và gắn tên miền.
- Viết và demo doc api cho frontend.
- Tối ưu xử lý qua hàng chờ
