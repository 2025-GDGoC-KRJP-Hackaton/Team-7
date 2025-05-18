import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { FirebaseService } from '../../firebase/firebase.service';

@Module({
  controllers: [LikeController],
  providers: [LikeService, FirebaseService],
})
export class LikeModule {}
