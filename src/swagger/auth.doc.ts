import { Body } from "@nestjs/common";

export const authDoc = {
    paths: {
        '/auth/login': {
            post: {
                tags: ['Tài khoản'],
                summary: 'Đăng nhập',
                description: '',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: {
                                        type: 'string',
                                        example: 'taminhdung'
                                    },
                                    password: {
                                        type: 'string',
                                        example: 'Monkoja12032001'
                                    }
                                },
                                required: ['username', 'password']
                            }
                        },
                        'application/x-www-form-urlencoded': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: {
                                        type: 'string',
                                        example: 'taminhdung'
                                    },
                                    password: {
                                        type: 'string',
                                        example: 'Monkoja12032001'
                                    }
                                },
                                required: ['username', 'password']
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Thành công.',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Đăng nhập thành công. Vui lòng kiểm tra email để nhận mã OTP.'
                                        },
                                        account_id: {
                                            type: 'string',
                                            example: 'f176f500-f5c1-40d5-90a9-143940585d06'
                                        },
                                    },
                                },
                            },
                        },
                    },
                    500: {
                        description: 'Thất bại.',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: ''
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/auth/verify-email': {
            post: {
                tags: ['Tài khoản'],
                summary: 'Xác thực email',
                description: '',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    account_id: {
                                        type: 'string',
                                        example: 'f176f500-f5c1-40d5-90a9-143940585d06'
                                    },
                                    email: {
                                        type: 'string',
                                        example: 'taminhdung.it@gmail.com'
                                    },
                                    otp_code: {
                                        type: 'string',
                                        example: '123456'
                                    }
                                },
                                required: ['account_id', 'email', 'otp_code']
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Thành công.',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Xác thực thành công.'
                                        },
                                        access_token: {
                                            type: 'string',
                                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg5ODQ0YjA4LTk1YjAtNDI3ZC1iODQyLTU2YjE4ZDEwM2E0MiIsImlhdCI6MTY5ODQ4MDg3OSwiZXhwIjoxNjk4NDgzNDc5fQ.7nXo8sHqLhXqz8lK7a9mN8vVb9vV8vVb9vV8vV8'
                                        },
                                    },
                                },
                            },
                        },
                    },
                    500: {
                        description: 'Thất bại.',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: ''
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};