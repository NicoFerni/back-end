import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
<<<<<<< HEAD
 


  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API login and profile')
    .setDescription('In this API, I will show you all the methods that I created. Both Profile and User')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(10000);
=======
  await app.listen(3000);
>>>>>>> parent of 5aed90c (all done, part 1)
}
bootstrap();
