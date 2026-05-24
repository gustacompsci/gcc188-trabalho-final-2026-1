import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { env } from "./common/env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  await app.listen(env.PORT);
}
bootstrap();
