import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateNameDto } from './dto/update-name.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { DecodedIdToken } from 'firebase-admin/auth';
import axios from 'axios';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

@Injectable()
export class AuthService {
  private firebaseClientAuth;

  constructor(private readonly firebaseService: FirebaseService) {
    if (getApps().length === 0) {
      const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY!,
        authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
      };
      initializeApp(firebaseConfig);
    }

    this.firebaseClientAuth = getAuth();
  }

  // 회원가입 + Firestore 저장 / Sign up + store in Firestore
  async signUp(dto: CreateUserDto) {
    const auth = this.firebaseService.getAuth();
    const firestore = this.firebaseService.getFirestore();
    
    console.log('[DEBUG] 회원가입 요청 수신:', dto);
    
    const userRecord = await auth.createUser({
      email: dto.email,
      password: dto.password,
      displayName: dto.name,
    });
    
    try {
      const userData = {
        uid: userRecord.uid,
        email: userRecord.email,
        name: dto.name ?? null,
        createdAt: new Date(),
      };
      
    console.log('[DEBUG] Firestore 저장 시도:', userData);

    console.log('firestore >>>>>>>>>>>>>>> ', firestore)

    await firestore
    .collection('users')
    .doc(userRecord.uid)
    .create(userData);

    console.log('[DEBUG] Firestore 저장 성공');
  } catch (err) {
    console.error('[ERROR] Firestore 저장 실패:', err);
    throw err;
  }

  return {
    uid: userRecord.uid,
    email: userRecord.email,
    name: dto.name,
  };
}

  // 로그인 (토큰 검증) / Login (verify token)
  async signIn(dto: LoginDto) {
    const auth = this.firebaseService.getAuth();
    try {
      const decodedToken = await auth.verifyIdToken(dto.idToken);
      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
      };
    } catch (err) {
      console.error('[Firebase 로그인 실패 / Login failed]', err);
      throw new Error('토큰이 유효하지 않습니다. / Invalid token');
    }
  }

  // 이메일/비밀번호로 idToken 발급 (테스트용) / Issue idToken using email/password (for test)
  async loginWithEmail(dto: { email: string; password: string }) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.firebaseClientAuth,
        dto.email,
        dto.password,
      );
      const idToken = await userCredential.user.getIdToken();
      return { idToken };
    } catch (err: any) {
      console.error('[Firebase 로그인 실패 / Login failed]', err?.message);
      throw new UnauthorizedException('이메일 또는 비밀번호 오류 / Invalid email or password');
    }
  }

  // Google OAuth 로그인 / Google OAuth login
  async googleLogin(dto: GoogleLoginDto) {
    const auth = this.firebaseService.getAuth();
    const firestore = this.firebaseService.getFirestore();

    const decodedToken = await auth.verifyIdToken(dto.idToken);

    const userRef = firestore.collection('users').doc(decodedToken.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name ?? null,
        provider: 'google',
        createdAt: new Date(),
      });
    }

    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name ?? null,
    };
  }

  // 로그인된 유저 정보 조회 / Get logged-in user info
  getMe(user: DecodedIdToken) {
    return {
      uid: user.uid,
      email: user.email,
      name: user.name || null,
    };
  }

  // 비밀번호 변경 / Change password
  async updatePassword(user: DecodedIdToken, dto: UpdatePasswordDto) {
    const auth = this.firebaseService.getAuth();
    await auth.updateUser(user.uid, {
      password: dto.newPassword,
    });
    return { message: '비밀번호 변경 완료! / Password successfully changed!' };
  }

  async updateName(user: DecodedIdToken, dto: UpdateNameDto) {
    const auth = this.firebaseService.getAuth();
    const firestore = this.firebaseService.getFirestore();
    
    await auth.updateUser(user.uid, {
      displayName: dto.name,
    });
    
    await firestore.collection('users').doc(user.uid).update({
      name: dto.name,
      updatedAt: new Date(),
    });
    
    return { message: '이름 변경 완료! / Name successfully updated!' };
  }

  // Firestore에 유저 정보 저장 기능 (필요 시 수동 호출) / Save user info to Firestore (manual trigger if needed)
  async saveUserToFirestore(user: DecodedIdToken) {
    const firestore = this.firebaseService.getFirestore();
    const userRef = firestore.collection('users').doc(user.uid);

    await userRef.set(
      {
        uid: user.uid,
        email: user.email,
        name: user.name || null,
        lastLoginAt: new Date(),
      },
      { merge: true },
    );

    return { message: 'Firestore에 유저 정보 저장 완료 / User info saved to Firestore' };
  }

  // 회원 탈퇴 (Firebase + Firestore 삭제) / Delete account (Firebase + Firestore)
  async deleteAccount(uid: string) {
  const auth = this.firebaseService.getAuth();
  const firestore = this.firebaseService.getFirestore();

  try {
    await auth.deleteUser(uid);
    console.log('[DEBUG] Firebase Auth 유저 삭제 완료');

    await firestore.collection('users').doc(uid).delete();
    console.log('[DEBUG] Firestore 유저 문서 삭제 완료');

    return { message: '회원 탈퇴 완료! / Account deletion complete!' };
  } catch (err) {
    console.error('[ERROR] 회원탈퇴 실패:', err);
    throw err;
  }
}
}