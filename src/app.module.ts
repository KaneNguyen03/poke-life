import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { PassportModule } from '@nestjs/passport'
import { CustomDishIngredientModule } from './custom-dish-ingredient/custom-dish-ingredient.module'
import { IngredientModule } from './ingredient/ingredient.module'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AuthModule } from './auth/auth.module'
import { ComboItemModule } from './combo-item/combo-item.module'
import { ComboModule } from './combo/combo.module'
import { AtGuard } from './common/guards'
import { CustomerModule } from './customer/customer.module'
import { FoodModule } from './food/food.module'
import { OrderDetailModule } from './order-detail/order-detail.module'
import { OrderModule } from './order/order.module'
import { PrismaModule } from './prisma/prisma.module'
import { ReviewModule } from './review/review.module'
import { TransactionModule } from './transaction/transaction.module'
import { ChatGateway } from './chat/chat.gateway'
import { ChatMessageModule } from './chat/chat-message.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ChatService } from './chat/chat.service'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    FoodModule,
    OrderModule,
    ComboModule,
    ComboItemModule,
    CustomerModule,
    OrderDetailModule,
    TransactionModule,
    ReviewModule,
    PassportModule.register({ session: true }),
    IngredientModule,
    CustomDishIngredientModule,
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    ChatMessageModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  providers: [
    ChatGateway,
    ChatService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule { }
