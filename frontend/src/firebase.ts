// src/firebase.ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBz7KVwjfAnRl0_D_e7ua9s_TL2UdVCcuQ",
  authDomain: "bridge78-12345.firebaseapp.com",
  projectId: "bridge78-12345",
  storageBucket: "bridge78-12345.firebasestorage.app",
  messagingSenderId: "373122911084",
  appId: "1:373122911084:web:9367df7769ee0299d54149"
};

export const firebaseApp = initializeApp(firebaseConfig);
