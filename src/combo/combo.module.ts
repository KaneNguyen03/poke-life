import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module'
import { ComboService } from './combo.service';
import { ComboController } from './combo.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ComboController],
  providers: [ComboService],
})
export class ComboModule {}
