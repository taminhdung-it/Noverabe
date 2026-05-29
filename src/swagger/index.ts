import { OpenAPIObject } from '@nestjs/swagger';
import { authDoc } from './auth.doc';
export const document: OpenAPIObject = {
    openapi: '3.0.0',
    info: {
        title: 'Novera API',
        version: '1.0.0',
        description: 'Tài liệu Api cho Novera Server',
    },
    servers: [],
    tags: [
        {
            name: 'Tài khoản',
            description: '',
        },
        {
            name: 'Người dùng',
            description: '',
        },
    ],
    paths: {
        ...authDoc.paths,
    },
    components: {
        schemas: {},
    },
};