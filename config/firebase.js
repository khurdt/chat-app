import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDRKQsEWdo-TnHBDaxYUBVF04uySLgM5kE",
  authDomain: "chat-app-54ecd.firebaseapp.com",
  projectId: "chat-app-54ecd",
  storageBucket: "chat-app-54ecd.appspot.com",
  messagingSenderId: "690320710091",
})

export const auth = getAuth(firebaseApp);

export const db = getFirestore(firebaseApp);