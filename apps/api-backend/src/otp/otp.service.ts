import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OTP, OTPPurpose } from '@rebottal/app-definitions';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class OtpService {
  constructor(private prismaService: PrismaService) {}

  async createOTP(data: CreateOtpDto): Promise<OTP> {  
    return await this.prismaService.oTP.create({data: data});
  }

  async findAllOTPs(): Promise<OTP[]> {
    return await this.prismaService.oTP.findMany();
  }

  async findOTPsByUserUuid(uuid: string): Promise<OTP[]> {
    return await this.prismaService.oTP.findMany({
      where: {
        userUuid: uuid
      },
    });
  }
  
  async findOTPByUserUuidAndPurpose(uuid: string, purpose: OTPPurpose): Promise<OTP | null> {
    return await this.prismaService.oTP.findFirst({
      where: {
        userUuid: uuid,
        purpose
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async updateOTPByUuidAndPurpose(uuid: string, purpose: OTPPurpose, data: UpdateOtpDto): Promise<OTP> {
    const otp = await this.findOTPByUserUuidAndPurpose(uuid, purpose);
    if (!otp) {
      throw new ConflictException();
    }

    return await this.prismaService.oTP.update({
      data: data,
      where: {
        id: otp.id
      },
    });
  }

  async updateOTPById(id: number, data: UpdateOtpDto): Promise<OTP> {
    return await this.prismaService.oTP.update({
      data: data,
      where: {
        id
      },
    });
  }
  
  async deleteOTP(uuid: string, purpose: OTPPurpose): Promise<OTP> {
    const otp = await this.findOTPByUserUuidAndPurpose(uuid, purpose);
    if (!otp) {
      throw new ConflictException();
    }

    return await this.prismaService.oTP.delete({
      where: {
        id: otp.id
      }
    })
  }

  async doesOTPExists(uuid: string, purpose: OTPPurpose): Promise<boolean> {
    const otp = await this.prismaService.oTP.findFirst({
      where: {
        userUuid: uuid,
        purpose
      }
    });

    if (otp) return true;
    else return false;
  }

  @Cron('0 0 * * *')
  async handleExpiredOTPs() {
    await this.prismaService.oTP.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(Date.now())
        }
      }
    });
  }
}
