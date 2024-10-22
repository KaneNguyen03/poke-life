import { IoAdapter } from '@nestjs/platform-socket.io'
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

  // Define CORS options
  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'https://poke-life-fe.vercel.app',
        'http://localhost:3000',
        'https://poke-life.onrender.com'
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

  // Enable CORS with the defined options
  app.enableCors(corsOptions)

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

  // Create Swagger options
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

  // Class validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove properties not in DTO
    forbidNonWhitelisted: true, // Return error for invalid properties
    transform: true, // Automatically transform input types according to DTO
  }))

  // Set up the IoAdapter for Socket.IO
  app.useWebSocketAdapter(new IoAdapter(app))

  await app.listen(3000)
}

bootstrap()
