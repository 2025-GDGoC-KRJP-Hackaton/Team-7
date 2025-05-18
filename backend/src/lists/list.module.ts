import { Module } from '@nestjs/common';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { LikeModule } from './likes/like.module';

@Module({
  imports: [LikeModule],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}