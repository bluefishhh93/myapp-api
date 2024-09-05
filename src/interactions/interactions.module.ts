import { Module } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { InteractionsResolver } from './interactions.resolver';
import { InteractionsController } from './interactions.controller';

@Module({
  imports: [],
  providers: [InteractionsService, InteractionsResolver],
  controllers: [InteractionsController],
})
export class InteractionsModule {}