import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 5000);
  console.log("Server is listening to Port", process.env.PORT ?? 5000);
}
bootstrap();
