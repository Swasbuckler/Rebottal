import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './prisma/prisma-client-exception/prisma-client-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL!,
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle('Swagger')
    .setDescription('To test and observe APIs')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const {httpAdapter} = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

  await app.listen(process.env.PORT ?? 5000);
  console.log("Server is listening to Port", process.env.PORT ?? 5000);
}
bootstrap();
