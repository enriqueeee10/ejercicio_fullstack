import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // URL de tu frontend React (ahora forzado a 3000)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(3001); // El backend se ejecutará en el puerto 3001
  console.log(`Backend is running on: ${await app.getUrl()}`);
}
bootstrap();
