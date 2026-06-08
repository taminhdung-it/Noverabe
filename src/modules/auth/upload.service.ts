import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from 'cloudinary';
import type { } from 'multer';
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
        return new Promise<string>((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'Avatars',
                    public_id: `${fullname.replace(/ /g, '_')}_${userid}_${account_id}`,
                    overwrite: true,
                },
                (error, result) => {

                    if (error) {
                        return reject(error);
                    }
                    resolve(result!.secure_url);
                },
            );

            stream.end(file.buffer);
        })
    }
}
