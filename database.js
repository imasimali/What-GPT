import * as dotenv from "dotenv";
dotenv.config();
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  push,
  query,
  limitToLast,
  serverTimestamp,
} from "firebase/database";

const firebase_app =
  process.env.FIREBASE_DB_URL &&
  initializeApp({
    databaseURL: process.env.FIREBASE_DB_URL,
  });

const db = process.env.FIREBASE_DB_URL && getDatabase(firebase_app);

export const writeUserData = async function (sender_id, sender_text, response) {
  const msgListRef = ref(db, sender_id + "/");
  const newMsgRef = push(msgListRef);
  set(newMsgRef, {
    question: sender_text.trim(),
    timestamp: serverTimestamp(),
    response,
  }).catch((error) => {
    console.error(error);
  });
};

export const readUserData = async function (sender_id) {
  const userDBRef = query(ref(db), limitToLast(50));
  const response = await get(child(userDBRef, sender_id + "/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return response;
};
