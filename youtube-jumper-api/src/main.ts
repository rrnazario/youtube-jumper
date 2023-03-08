import { NestFactory } from '@nestjs/core';
import { IntervalModule } from './interval.module';

async function bootstrap() {
  const app = await NestFactory.create(IntervalModule);
  app.enableCors({
    origin: [
      process.env.CORS_URL,
    ],
    methods: ["GET", "PUT"],
    credentials: true,
  });
  await app.listen(process.env.PORT || 8558);
}

bootstrap();
