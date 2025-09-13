import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OtpService } from './otp.service';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OTP, type Purpose } from '@rebottal/app-definitions';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post()
  async createOTP(@Body() createOtpDto: CreateOtpDto): Promise<OTP> {
    return await this.otpService.createOTP(createOtpDto);
  }

  @Get()
  async findAllOTPs(): Promise<OTP[]> {
    return await this.otpService.findAllOTPs();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  async findOTPsByUserUuid(@Param('uuid') uuid: string): Promise<OTP[]> {
    return await this.otpService.findOTPsByUserUuid(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':uuid/:purpose')
  async findOTPByUserUuidAndPurpose(@Param('uuid') uuid: string, @Param('purpose') purpose: Purpose): Promise<OTP | null> {
    return await this.otpService.findOTPByUserUuidAndPurpose(uuid, purpose);
  }

  @Post(':uuid/:purpose/update')
  async updateOTP(@Param('uuid') uuid: string, @Param('purpose') purpose: Purpose, @Body() updateOtpDto: UpdateOtpDto): Promise<OTP> {
    return this.otpService.updateOTPByUuidAndPurpose(uuid, purpose, updateOtpDto);
  }

  @Post(':uuid/:purpose/delete')
  async deleteOTP(@Param('uuid') uuid: string, @Param('purpose') purpose: Purpose): Promise<OTP> {
    return this.otpService.deleteOTP(uuid, purpose);
  }
}
