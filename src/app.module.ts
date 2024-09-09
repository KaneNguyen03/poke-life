import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { AuthModule } from './auth/auth.module'
import { AtGuard } from './common/guards'
import { FoodModule } from './food/food.module'
import { PrismaModule } from './prisma/prisma.module'
import { OrderModule } from './order/order.module';
import { ComboModule } from './combo/combo.module';
import { ComboItemModule } from './combo-item/combo-item.module';
import { CustomerModule } from './customer/customer.module';
import { OrderDetailModule } from './order-detail/order-detail.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, PrismaModule, FoodModule, OrderModule, ComboModule, ComboItemModule, CustomerModule, OrderDetailModule, TransactionModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule { }
