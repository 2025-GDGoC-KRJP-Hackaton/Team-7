import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // .env 설정 로드

  const app = await NestFactory.create(AppModule);

  // ✅ CORS 설정 추가
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,      // 쿠키/인증 정보 전달 허용
  });

  // 전역 ValidationPipe 적용
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // DTO에 없는 값 제거
      forbidNonWhitelisted: true,   // 허용되지 않은 값 요청 시 에러
      transform: true,              // 요청값을 DTO 타입에 맞게 자동 변환
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Bridge7 API')
    .setDescription('인증 및 유저 관련 Swagger 문서 / Auth & User Swagger Docs')
    .setVersion('1.0')
    .addBearerAuth() // Authorization: Bearer 토큰 입력용
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // http://localhost:3000/api-docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
