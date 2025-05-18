import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Bucket } from '@google-cloud/storage';
// import serviceAccount from '../config/bridge7-e8194-firebase-adminsdk-fbsvc-f1c313ab42.json';
import serviceAccount from '../config/bridge78_sa.json';

@Injectable()
export class FirebaseService {
  private firestore: admin.firestore.Firestore;

  constructor() {
    if (!admin.apps.length) {
      // Initialize Firebase Admin SDK
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        storageBucket: `${serviceAccount.project_id}.appspot.com`,
      });
      console.log('[DEBUG] Firebase Admin initialized');
      console.log('[DEBUG] Admin app options:', admin.app().options);
      console.log('[DEBUG] Service account project_id:', serviceAccount.project_id);
    }

    // Create Firestore instance
    this.firestore = admin.firestore();
    console.log('[DEBUG] Firestore instance created');

    // Inspect internal Firestore settings for debugging
    console.log('[DEBUG] Firestore settings:', (this.firestore as any)._settings);
  }

  getFirestore(): admin.firestore.Firestore {
    return this.firestore;
  }

  getAuth(): admin.auth.Auth {
    return admin.auth();
  }

  getStorage(): Bucket {
    return admin.storage().bucket();
  }
}
