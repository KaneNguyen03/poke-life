import { Module } from '@nestjs/common';
import { ComboService } from './combo.service';
import { ComboController } from './combo.controller';

@Module({
  controllers: [ComboController],
  providers: [ComboService],
})
export class ComboModule {}
