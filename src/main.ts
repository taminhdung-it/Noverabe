import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { document } from './swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "https://api.novera.dpdns.org",
      "https://localhost:9999"
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  const configservice = app.get(ConfigService);
  const port = process.env.PORT || configservice.get<number>("application.port") || 3000;
  SwaggerModule.setup('api-docs',
    app,
    {
      ...document,
      servers: [
        port === 10000 ?
          {
            url: `https://api.novera.dpdns.org`,
            description: 'Production server',
          }
          : {
            url: `http://${configservice.get<string>("application.host")}:${port}`,
            description: 'Development server',
          }
      ]
    },
    {
      swaggerOptions: {
        docExpansion: 'none',
      }
    });

  await app.listen(port);
  const url = await app.getUrl()
  if (url.split(":")[2].split("/")[0] === "10000") {
    console.log(`Novera Sever dang chay tai cổng ${url.split(":")[2].split("/")[0]} voi duong link https://api.novera.dpdns.org/api-docs/`)
  } else {
    console.log(`Novera Sever đang chạy tại cổng ${url.replace("[::1]", configservice.get<string>("application.host")!).split(":")[2].split("/")[0]} với đường link ${url.replace("[::1]", configservice.get<string>("application.host")!)}/api-docs/`)
  }
}
bootstrap();
