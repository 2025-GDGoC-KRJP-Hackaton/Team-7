import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { ToggleLikePlaceDto } from './dto/toggle-like-place.dto';

@Injectable()
export class LikeService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async toggleLikePlace(uid: string, dto: ToggleLikePlaceDto): Promise<{ liked: boolean }> {
    const db = this.firebaseService.getFirestore();

    const likeRef = db
      .collection('users')
      .doc(uid)
      .collection('liked_places')
      .doc(dto.id); // 문서 ID = 장소 ID

    const doc = await likeRef.get();

    if (doc.exists) {
      await likeRef.delete();
      return { liked: false };
    } else {
      await likeRef.set({
        // 🔽 저장할 필드에서 id 제외 (문서 ID로 대체되므로)
        name: dto.name,
        address: dto.address,
        description: dto.description,
        createdAt: new Date(),
      });
      return { liked: true };
    }
  }

  async getLikedPlaces(uid: string): Promise<any[]> {
    const db = this.firebaseService.getFirestore();

    const snapshot = await db
      .collection('users')
      .doc(uid)
      .collection('liked_places')
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      // 🔽 문서 ID를 id로 반환
      id: doc.id,
      ...doc.data(),
    }));
  }
}
