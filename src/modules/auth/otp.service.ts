import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import twilio from 'twilio';

@Injectable()
export class OtpService {
    constructor(
        private readonly configService: ConfigService
    ) { }
    async sendphonenumber() {
        try {
            const client = twilio(this.configService.get<string>("twilio.accountSid"), this.configService.get<string>("twilio.authToken"));
            const verification = await client.verify.v2.services(this.configService.get<string>("twilio.verifyServiceSid")!).verifications.create({
                to: this.configService.get<string>("twilio.phoneNumber")!,
                channel: 'sms'
            });
            return verification;
        } catch (error) {
            throw new Error('Failed to send verification code.');
        }
    }

    async verifyphonenumber(code: string) {
        try {
            const client = twilio(this.configService.get<string>("twilio.accountSid"), this.configService.get<string>("twilio.authToken"));
            const verification_check = await client.verify.v2.services(this.configService.get<string>("twilio.verifyServiceSid")!).verificationChecks.create({
                to: this.configService.get<string>("twilio.phoneNumber")!,
                code: code
            });
            return verification_check;
        } catch (error) {
            throw new Error('Failed to verify code.');
        }
    }
}