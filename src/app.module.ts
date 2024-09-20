import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { AuthModule } from './auth/auth.module'
import { AtGuard } from './common/guards'
import { FoodModule } from './food/food.module'
import { PrismaModule } from './prisma/prisma.module'
import { OrderModule } from './order/order.module'
import { ComboModule } from './combo/combo.module'
import { ComboItemModule } from './combo-item/combo-item.module'
import { CustomerModule } from './customer/customer.module'
import { OrderDetailModule } from './order-detail/order-detail.module'
import { TransactionModule } from './transaction/transaction.module'
import { ReviewModule } from './review/review.module'
import { PassportModule } from '@nestjs/passport'
import { IngredientModule } from './ingredient/ingredient.module';
import { CustomDishModule } from './custom-dish/custom-dish.module';
import { CustomDishIngredientModule } from './custom-dish-ingredient/custom-dish-ingredient.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    AuthModule, PrismaModule, FoodModule, OrderModule, ComboModule, ComboItemModule, CustomerModule, OrderDetailModule, TransactionModule, ReviewModule,
  PassportModule.register({ session: true }),
  IngredientModule,
  CustomDishModule,
  CustomDishIngredientModule,
    
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule { }
