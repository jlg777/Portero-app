import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDWxBp9OgXbx5I8z6RDCQFPAdlp70m6NDg",
  authDomain: "portero-edificio-5b0ba.firebaseapp.com",
  projectId: "portero-edificio-5b0ba",
  storageBucket: "portero-edificio-5b0ba.firebasestorage.app",
  messagingSenderId: "85497313252",
  appId: "1:85497313252:web:e77aa089b3ed6535c8b9f1"
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)