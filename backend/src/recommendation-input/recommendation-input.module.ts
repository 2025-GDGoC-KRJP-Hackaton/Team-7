import { Module } from '@nestjs/common';
import { RecommendationInputController } from './recommendation-input.controller';
import { RecommendationInputService } from './recommendation-input.service';
import { FirebaseService } from '../firebase/firebase.service';

@Module({
  controllers: [RecommendationInputController],
  providers: [RecommendationInputService, FirebaseService],
})
export class RecommendationInputModule {}