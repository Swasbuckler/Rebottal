import { Body, Controller, Post } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelInputDto } from './dto/model-input.dto';

@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post()
  async test(@Body() inputText: ModelInputDto) {
    return await this.modelService.testMessage(inputText.text);
  } 

}
