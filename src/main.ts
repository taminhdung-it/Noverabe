import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configservice = app.get(ConfigService)
  await app.listen(configservice.get<number>("application.port") ?? 3000);
  const url = await app.getUrl()
  console.log(`Novera Sever có đường link ${url.replace("[::1]", configservice.get<string>("application.host")!)}`)
}
bootstrap();
