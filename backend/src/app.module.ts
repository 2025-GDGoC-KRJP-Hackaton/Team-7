import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ListModule } from './lists/list.module';
import { LikeModule } from './lists/likes/like.module';
import { RecommendationInputModule } from './recommendation-input/recommendation-input.module';
import { AiAssistantModule } from './ai-assistant/ai-assistant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule,
    AuthModule,
    ListModule,
    LikeModule,
    RecommendationInputModule,
    AiAssistantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
