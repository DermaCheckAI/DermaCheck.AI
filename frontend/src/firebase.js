import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyAX7FY8N-BpAieoES1LUSlMoevoIIKsdoA",
  authDomain: "dermacheckai-ab190.firebaseapp.com",
  projectId: "dermacheckai-ab190",
  storageBucket: "dermacheckai-ab190.firebasestorage.app",
  messagingSenderId: "162279769290",
  appId: "1:162279769290:web:820010241c2cd2d40fe033"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "user"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email
    });
    toast.success("Account created successfully!");
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
    throw error; // Stops the loading state in the UI
  }
};

export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
    throw error; // Stops the loading state in the UI
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    toast.error("Logout failed");
  }
};