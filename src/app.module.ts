import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BondModule } from './modules/bond/bond.module';

@Module({
  imports: [BondModule],
  controllers: [AppController],
})
export class AppModule { }