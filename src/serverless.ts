import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

let app: NestExpressApplication;

async function bootstrap(): Promise<NestExpressApplication> {
  if (app) return app;
  app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://www.livefootballarena.online',
      'https://livefootballarena.online',
      'https://sportszone-frontend.vercel.app',
      'https://sportszone-frontend-git-main-imtiazz.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  });
  const swaggerCfg = new DocumentBuilder()
    .setTitle('SportsZone API')
    .setDescription('Sports News & Live Match Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swaggerCfg));
  await app.init();
  return app;
}

export default async (req: any, res: any) => {
  const nestApp = await bootstrap();
  nestApp.getHttpAdapter().getInstance()(req, res);
};
