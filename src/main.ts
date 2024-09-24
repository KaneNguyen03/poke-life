import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import session from 'express-session'
import passport from 'passport'
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'https://poke-life-fe.vercel.app',
        'http://localhost:3000',
      ]
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true) // Allow the request
      } else {
        callback(new Error('Not allowed by CORS')) // Deny the request
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }

  app.enableCors(corsOptions)

  // Set up Swagger options
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .addBearerAuth() // Add Bearer Auth
    .setVersion('1.0')
    .build()

  // Enable CORS for http://localhost:5173
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  // Configure session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'my-secret', // Use environment variable for the secret
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000, // Cookie expiry time
        secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
      },
    }),
  )
  app.use(passport.initialize())
  app.use(passport.session())
  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config)

  // Set up the Swagger module
  SwaggerModule.setup('api', app, document)

  //Class validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Xóa các thuộc tính không nằm trong DTO
    forbidNonWhitelisted: true, // Trả về lỗi khi có thuộc tính không hợp lệ
    transform: true, // Tự động chuyển đổi kiểu dữ liệu đầu vào theo DTO
  }))

  await app.listen(3000)
}
bootstrap()
