import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateRecommendationInputDto } from './dto/create-input.dto';

@Injectable()
export class RecommendationInputService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async saveInput(uid: string, dto: CreateRecommendationInputDto) {
    const db = this.firebaseService.getFirestore();

    const docRef = db.collection('users').doc(uid).collection('recommendation_request').doc('latest');
    await docRef.set({
      location: dto.location,
      preferences: dto.preferences ?? null,
      createdAt: new Date(),
    });

    return { message: '입력 저장 완료 / Input saved successfully' };
  }

  async getInput(uid: string) {
    const db = this.firebaseService.getFirestore();

    const docRef = db.collection('users').doc(uid).collection('recommendation_request').doc('latest');
    const doc = await docRef.get();

    if (!doc.exists) return { location: null, preferences: null };

    return doc.data();
  }
}