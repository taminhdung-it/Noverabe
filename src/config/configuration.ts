export default () => ({
    application: {
        name: process.env.APPLICATION_NAME,
        env: process.env.APPLICATION_ENV,
        debug: process.env.APPLICATION_DEBUG,
        host: process.env.APPLICATION_HOST,
        port: process.env.APPLICATION_PORT,
        url: process.env.APPLICATION_URL
    },
    database: {
        connect: process.env.DATABASE_CONNECTION,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        name: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        ssl: process.env.SSL_PATH
    },
    jwt: {
        access: process.env.ACCESS_SECRET,
        refresh: process.env.REFRESH_SECRET,
        secret: process.env.JWT_SECRET,
        br: process.env.BCRYPT_ROUNDS
    },
    twilio: {
        accountSid: process.env.ACCOUNT_SID,
        authToken: process.env.AUTH_TOKEN,
        phoneNumber: process.env.PHONE_NUMBER,
        verifyServiceSid: process.env.VERIFY_SERVICE_SID
    },
    cloudinary: {
        cloudName: process.env.CLOUD_NAME,
        apiKey: process.env.API_KEY,
        apiSecret: process.env.API_SECRET
    },
    resend: {
        apiKey: process.env.RESEND_API_KEY,
        fromEmail: process.env.RESEND_FROM_EMAIL
    }
})