import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { RefreshToken } from '@rebottal/app-definitions';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateRefreshTokenDto } from './dto/update-refresh-token.dto';
import { CheckDataDto } from 'src/user/dto/check-data.dto';

@Controller('refresh-token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Post()
  async createRefreshToken(@Body() inputData: CreateRefreshTokenDto): Promise<RefreshToken> {
    return await this.refreshTokenService.createRefreshToken(inputData);
  }

  @Get()
  async findAllRefreshTokens(): Promise<RefreshToken[]> {
    return await this.refreshTokenService.findAllRefreshTokens();
  }
  
  @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  async findRefreshTokensByUserUuid(@Param('uuid') uuid: string): Promise<RefreshToken[]> {
    return await this.refreshTokenService.findRefreshTokensByUserUuid(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':sub')
  async findRefreshTokenBySub(@Param('sub') sub: string): Promise<RefreshToken | null> {
    return await this.refreshTokenService.findRefreshTokenBySub(sub);
  }

  @Post(':sub/update')
  async updateRefreshToken(@Param('sub') sub: string, @Body() inputData: UpdateRefreshTokenDto): Promise<RefreshToken> {
    return await this.refreshTokenService.updateRefreshToken(sub, inputData);
  }

  @Post(':sub/delete')
  async deleteRefreshToken(@Param('sub') sub: string): Promise<RefreshToken> {
    return await this.refreshTokenService.deleteRefreshToken(sub);
  }

  @Post('check/sub')
  async checkSubAvailability(@Body() inputData: CheckDataDto): Promise<boolean> {
    return await this.refreshTokenService.doesSubExists(inputData.value);
  }
}
