import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAX7FY8N-BpAieoES1LUSlMoevoIIKsdoA",
  authDomain: "dermacheckai-ab190.firebaseapp.com",
  projectId: "dermacheckai-ab190",
  storageBucket: "dermacheckai-ab190.firebasestorage.app",
  messagingSenderId: "162279769290",
  appId: "1:162279769290:web:820010241c2cd2d40fe033"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Firebase helper functions
const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "user"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email
    });
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const logout = () => {
  signOut(auth);
};

export { auth, db, signup, login, logout };
