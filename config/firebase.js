import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

//credentials from account
const firebaseApp = initializeApp({
  apiKey: "AIzaSyDRKQsEWdo-TnHBDaxYUBVF04uySLgM5kE",
  authDomain: "chat-app-54ecd.firebaseapp.com",
  projectId: "chat-app-54ecd",
  storageBucket: "chat-app-54ecd.appspot.com",
  messagingSenderId: "690320710091",
})

export const storage = getStorage(firebaseApp);

//getting authorization
export const auth = getAuth(firebaseApp);

//getting database
export const db = getFirestore(firebaseApp);