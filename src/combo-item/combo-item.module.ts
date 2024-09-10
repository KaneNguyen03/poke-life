import { Module } from '@nestjs/common';
import { ComboItemService } from './combo-item.service';
import { ComboItemController } from './combo-item.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ComboItemController],
  providers: [ComboItemService],
})
export class ComboItemModule {}
