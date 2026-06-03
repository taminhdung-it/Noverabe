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
        '/auth/verify-2fa': {
            post: {
                tags: ['Tài khoản'],
                summary: 'Xác thực hai yếu tố',
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
                                        example: 'f176f500-f5c1-40d5-90a9-143940585d06'
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
                                            example: 'Xác thực hai yếu tố thành công.'
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
        '/auth/set-tokens': {
            post: {
                tags: ['Tài khoản'],
                summary: 'Xác thực danh tính',
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
                                        example: 'f176f500-f5c1-40d5-90a9-143940585d06'
                                    },
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
                                        full_name: {
                                            type: 'string',
                                            example: 'Nguyễn Văn A'
                                        },
                                        avatar_url: {
                                            type: 'string',
                                            example: 'https://example.com/avatar.jpg'
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
        }
    }
}