import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Set up Swagger options
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .addBearerAuth() // Add Bearer Auth
    .setVersion('1.0')
    .build()

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config)

  // Set up the Swagger module
  SwaggerModule.setup('api', app, document)

  await app.listen(3000)
}
bootstrap()
