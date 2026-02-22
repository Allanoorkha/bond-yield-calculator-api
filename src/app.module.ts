import { Module } from '@nestjs/common';
import { BondModule } from './modules/bond/bond.module';

@Module({
  imports: [BondModule],
})
export class AppModule { }