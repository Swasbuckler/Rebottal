import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenController } from './refresh-token.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService],
  imports: [PrismaModule],
  exports: [RefreshTokenService]
})
export class RefreshTokenModule {}
