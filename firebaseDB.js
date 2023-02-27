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
import { getUserID, AI_NAME } from "./utils.js";

const firebase_app =
  process.env.FIREBASE_DB_URL &&
  initializeApp({
    databaseURL: process.env.FIREBASE_DB_URL,
  });

const db = process.env.FIREBASE_DB_URL && getDatabase(firebase_app);

export const writeUserData = async function (
  userId,
  messageSender,
  question,
  response
) {
  const user = getUserID(userId);

  const msgListRef = ref(db, user + "/");
  const newMsgRef = push(msgListRef);
  set(newMsgRef, {
    question: question.trim(),
    sender: messageSender,
    timestamp: serverTimestamp(),
    response,
  }).catch((error) => {
    console.error(error);
  });
};

export const readUserData = async function (userId) {
  const user = getUserID(userId);
  const userDBRef = query(ref(db), limitToLast(50));
  const response = await get(child(userDBRef, user + "/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return `{
          'INITIAL': {
            sender: ${AI_NAME},
            question: "Hello",
            response:
              "Hi, I'm here to answer your questions.",
          },
        }`;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return response;
};
