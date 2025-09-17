import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelInputDto } from './dto/model-input.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async test(@Body() inputText: ModelInputDto) {
    return await this.modelService.testMessage(inputText.text);
  } 

}
