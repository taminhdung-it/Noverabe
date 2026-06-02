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
                                        example: 'admin'
                                    },
                                    password: {
                                        type: 'string',
                                        example: 'admin'
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
                                        example: 'admin'
                                    },
                                    password: {
                                        type: 'string',
                                        example: 'admin'
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
                                            example: 'Đăng nhập thành công. Vui lòng xác thực danh tính.'
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
        '/auth/send-email': {
            post: {
                tags: ['Tài khoản'],
                summary: 'Gửi mã OTP đến email',
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
                                        example: '7873014e-95b0-4669-86d7-b6d62c8c835a'
                                    }
                                },
                                required: ['account_id']
                            }
                        },
                        'application/x-www-form-urlencoded': {
                            schema: {
                                type: 'object',
                                properties: {
                                    account_id: {
                                        type: 'string',
                                        example: '7873014e-95b0-4669-86d7-b6d62c8c835a'
                                    }
                                },
                                required: ['account_id']
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
                                            example: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra và xác thực.'
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
                                        example: '7873014e-95b0-4669-86d7-b6d62c8c835a'
                                    },
                                    otp: {
                                        type: 'string',
                                        example: '123456'
                                    }
                                },
                                required: ['account_id', 'otp']
                            }
                        },
                        'application/x-www-form-urlencoded': {
                            schema: {
                                type: 'object',
                                properties: {
                                    account_id: {
                                        type: 'string',
                                        example: '7873014e-95b0-4669-86d7-b6d62c8c835a'
                                    },
                                    otp: {
                                        type: 'string',
                                        example: '123456'
                                    }
                                },
                                required: ['account_id', 'otp']
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
                                        full_name: {
                                            type: 'string',
                                            example: 'Nguyễn Văn A'
                                        },
                                        avatar_url: {
                                            type: 'string',
                                            example: 'https://example.com/avatar.jpg'
                                        }
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