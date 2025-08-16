import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
      projectId: "flavors-express-52y57",
      appId: "1:929527125904:web:acb20ceff7a5864a218515",
      storageBucket: "flavors-express-52y57.appspot.com",
      apiKey: "AIzaSyDaMGzx2c2Qymv5V5qVCZwZ2ZKk6HY7B2I",
      authDomain: "flavors-express-52y57.firebaseapp.com",
      messagingSenderId: "929527125904",
};

// Initialize Firebase for the client
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, firebaseConfig };
