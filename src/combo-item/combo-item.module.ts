import { Module } from '@nestjs/common';
import { ComboItemService } from './combo-item.service';
import { ComboItemController } from './combo-item.controller';

@Module({
  controllers: [ComboItemController],
  providers: [ComboItemService],
})
export class ComboItemModule {}
