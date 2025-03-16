import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, VersioningType } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { cors: true });
  // Allow Cors
  // app.enableCors({
  //   // origin: '*',
  //   origin: ['http://localhost:4201'],
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   allowedHeaders: [
  //     'Content-Type,Authorization',
  //     'Content-Type,administrator',
  //   ],
  // });

  // File  and Image
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Version Control
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Global Prefix
  if (process.env.PREFIX) {
    app.setGlobalPrefix(process.env.PREFIX);
  }

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('Course Selling API')
    .setDescription('This is course selling api, powered by Reja')
    .setVersion('1.0')
    .addTag('Basic Api')
    .addBearerAuth(
      {
        name: 'Authorization',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.SWAGGER_PREFIX, app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
}
bootstrap();
