import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RefreshToken } from '@rebottal/app-definitions';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { UpdateRefreshTokenDto } from './dto/update-refresh-token.dto';

@Injectable()
export class RefreshTokenService {
  constructor(private prismaService: PrismaService) {}

  private readonly saltRounds = 10;

  async createRefreshToken(data: CreateRefreshTokenDto): Promise<RefreshToken> {
    const newRefreshTokenData: CreateRefreshTokenDto = JSON.parse(JSON.stringify(data));
  
    const hash = await bcrypt.hash(data.token, this.saltRounds)
    newRefreshTokenData.token = hash;
  
    return await this.prismaService.refreshToken.create({data: newRefreshTokenData});
  }

  async findAllRefreshTokens(): Promise<RefreshToken[]> {
    return await this.prismaService.refreshToken.findMany();
  }

  async findRefreshTokensByUserUuid(uuid: string): Promise<RefreshToken[]> {
    return await this.prismaService.refreshToken.findMany({
      where: {
        userUuid: uuid
      },
    });
  }
  
  async findRefreshTokenBySub(sub: string): Promise<RefreshToken | null> {
    return await this.prismaService.refreshToken.findUnique({
      where: {
        sub
      }
    });
  }

  async updateRefreshToken(sub: string, data: UpdateRefreshTokenDto): Promise<RefreshToken> {
    const newRefreshTokenData: UpdateRefreshTokenDto = JSON.parse(JSON.stringify(data));
      
    if (newRefreshTokenData.token) {
      const hash = await bcrypt.hash(newRefreshTokenData.token, this.saltRounds)
      newRefreshTokenData.token = hash;
    }

    return await this.prismaService.refreshToken.update({
      data: newRefreshTokenData,
      where: {
        sub
      },
    });
  }
  
  async deleteRefreshToken(sub: string): Promise<RefreshToken> {
    return await this.prismaService.refreshToken.delete({
      where: {
        sub
      }
    })
  }

  async doesSubExists(sub: string): Promise<boolean> {
    const refreshToken = await this.prismaService.refreshToken.findUnique({
      where: {
        sub
      }
    });

    if (refreshToken) return true;
    else return false;
  }

  async countRefreshTokensByUserUuid(uuid: string, rememberMe: boolean): Promise<number> {
    return await this.prismaService.refreshToken.count({
      where: {
        userUuid: uuid,
        rememberMe
      },
    });
  }

  async getEarliestRefreshToken(uuid: string): Promise<RefreshToken | null> {
    return await this.prismaService.refreshToken.findFirst({
      where: {
        userUuid: uuid,
      },
      orderBy: {
        accessedAt: 'asc'
      }
    });
  }

  async deleteEarliestRefreshToken(uuid: string): Promise<RefreshToken> {
    const earliestToken = await this.getEarliestRefreshToken(uuid);
    if (earliestToken) {
      return await this.deleteRefreshToken(earliestToken!.sub);
    }
    throw new InternalServerErrorException();
  }
}
