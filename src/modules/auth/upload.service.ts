import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from 'cloudinary';
import type {} from 'multer';
@Injectable()
export class UploadService {
    constructor(
        private readonly configService: ConfigService
    ) { }
    async uploadFile(file: Express.Multer.File, fullname: string, account_id: string, userid: string) {
        cloudinary.config({
            cloud_name: this.configService.get<string>("cloudinary.cloudName"),
            api_key: this.configService.get<string>("cloudinary.apiKey"),
            api_secret: this.configService.get<string>("cloudinary.apiSecret")
        });
        const result = await cloudinary.uploader.upload(file.path, {
            folder: "Avatars",
            public_id: `${fullname.replace(" ", "_")}_${userid}_${account_id}`,
            overwrite: true
        });
        return result.secure_url;
    }
}
