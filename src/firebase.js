import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import firebaseConfig from './firebase/config.js';

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export const ADMIN_EMAIL = 'martinaledesma2@gmail.com';

export const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);
export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);

// Este sitio usa documentos propios para mantener sus contenidos independientes.
const siteContentRef = doc(db, 'siteContent', 'creandoSonrisas-homepage');
export const subscribeSiteContent = (callback, errorCallback, options = {}) => (
  onSnapshot(siteContentRef, options, callback, errorCallback)
);
export const saveSiteContent = async (data) => setDoc(siteContentRef, data, { merge: true });

const nosotrosContentRef = doc(db, 'siteContent', 'creandoSonrisas-nosotros');
export const subscribeNosotrosContent = (callback, errorCallback) => onSnapshot(nosotrosContentRef, callback, errorCallback);
export const getNosotrosContent = async () => {
  const snapshot = await getDoc(nosotrosContentRef);
  return snapshot.exists() ? snapshot.data() : null;
};
export const saveNosotrosContent = async (data) => setDoc(nosotrosContentRef, data, { merge: true });

const sumateContentRef = doc(db, 'siteContent', 'creandoSonrisas-sumate');
export const subscribeSumateContent = (callback, errorCallback) => onSnapshot(sumateContentRef, callback, errorCallback);
export const getSumateContent = async () => {
  const snapshot = await getDoc(sumateContentRef);
  return snapshot.exists() ? snapshot.data() : null;
};
export const saveSumateContent = async (data) => setDoc(sumateContentRef, data, { merge: true });

const proyectosContentRef = doc(db, 'siteContent', 'creandoSonrisas-proyectos');
export const subscribeProyectosContent = (callback, errorCallback) => onSnapshot(proyectosContentRef, callback, errorCallback);
export const getProyectosContent = async () => {
  const snapshot = await getDoc(proyectosContentRef);
  return snapshot.exists() ? snapshot.data() : null;
};
export const saveProyectosContent = async (data) => setDoc(proyectosContentRef, data, { merge: true });


export const uploadImage = async (file, path) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};
