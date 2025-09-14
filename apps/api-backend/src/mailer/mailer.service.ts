import { Injectable, OnModuleInit } from '@nestjs/common';
import { otpLength } from '@rebottal/app-definitions';
import nodemailer, { Transporter } from "nodemailer";

@Injectable()
export class MailerService implements OnModuleInit {
  
  static transporter: Transporter;

  async onModuleInit() {
    MailerService.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS!,
        pass: process.env.EMAIL_PASSWORD!
      }
    });
    console.log(MailerService.transporter);
  }

  async generateOTP() {
    const powLength = Math.pow(10, otpLength - 1);
    return Math.floor(powLength + Math.random() * (9 * powLength)).toString();
  }

  async sendOTPEmail(email: string, otp: string) {
    const mailerOptions = {
      from: process.env.EMAIL_ADDRESS!,
      to: email,
      subject: 'OTP for Email Verification - Rebottal',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your OTP for email verification is:</p>
          <h1 style="color: #234452; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `,
    };

    await MailerService.transporter.sendMail(mailerOptions);
  }

}
