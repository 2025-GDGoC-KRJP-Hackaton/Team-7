import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list-dto';
import { AddPlaceDto } from './dto/add-place.dto';
import { Firestore } from 'firebase-admin/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ListService {
  private db: Firestore;

  constructor() {
    this.db = getFirestore();
  }

  async createList(uid: string, dto: CreateListDto) {
    const shareId = uuidv4();
    const ref = await this.db.collection('users').doc(uid).collection('lists').add({
      name: dto.name,
      places: [],
      createdAt: new Date(),
      shareId,
    });
    return { id: ref.id, message: '리스트가 생성되었습니다. / List created.' };
  }

  async getLists(uid: string) {
    const snapshot = await this.db.collection('users').doc(uid).collection('lists')
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        createdAt: data.createdAt,
      };
    });
  }

  async getListById(uid: string, listId: string) {
    const doc = await this.db.collection('users').doc(uid).collection('lists').doc(listId).get();
    if (!doc.exists) throw new NotFoundException('리스트가 존재하지 않습니다.');
    return { id: doc.id, ...doc.data() };
  }

  async getListByShareId(shareId: string) {
  const snapshot = await this.db
    .collectionGroup('lists')
    .where('shareId', '==', shareId)
    .orderBy('createdAt')
    .get();

  if (snapshot.empty) throw new NotFoundException('공유된 리스트를 찾을 수 없습니다.');
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

  async getShareLink(uid: string, listId: string) {
    const doc = await this.db.collection('users').doc(uid).collection('lists').doc(listId).get();
    if (!doc.exists) throw new NotFoundException('리스트가 존재하지 않습니다.');
    const data = doc.data();
    if (!data?.shareId) throw new NotFoundException('공유 ID가 존재하지 않습니다.');
    return { shareUrl: `https://your-app-domain.com/lists/shared/${data.shareId}` };
  }

  async addPlaceToList(uid: string, listId: string, dto: AddPlaceDto) {
    const ref = this.db.collection('users').doc(uid).collection('lists').doc(listId);
    const doc = await ref.get();
    if (!doc.exists) throw new NotFoundException('리스트가 존재하지 않습니다.');

    const data = doc.data();
    const places = data?.places ?? [];
    const plainPlace = JSON.parse(JSON.stringify(dto));

    await ref.update({ places: [...places, plainPlace] });

    return { message: '장소가 리스트에 추가되었습니다. / Place added to list.' };
  }

  async removePlaceFromList(uid: string, listId: string, placeId: string) {
    const ref = this.db.collection('users').doc(uid).collection('lists').doc(listId);
    const doc = await ref.get();
    if (!doc.exists) throw new NotFoundException('리스트가 존재하지 않습니다.');

    const places = doc.data()?.places ?? [];
    const updatedPlaces = places.filter((p: any) => p.id !== placeId);
    await ref.update({ places: updatedPlaces });

    return { message: '장소가 삭제되었습니다. / Place removed from list.' };
  }

  async deleteList(uid: string, listId: string) {
    await this.db.collection('users').doc(uid).collection('lists').doc(listId).delete();
    return { message: '리스트가 삭제되었습니다. / List deleted.' };
  }
}
