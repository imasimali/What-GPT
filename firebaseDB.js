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
import * as dotenv from "dotenv";
dotenv.config();

const firebase_app = initializeApp({
  apiKey: process.env.FIREBASE_APIKEY,
  databaseURL: process.env.FIREBASE_DB_URL,
});

const db = getDatabase(firebase_app);

export const writeUserData = async function (
  userId,
  messageSender,
  question,
  response
) {
  const user = getUserID(userId);
  const sender = getUserID(messageSender);

  const msgListRef = ref(db, user + "/");
  const newMsgRef = push(msgListRef);
  set(newMsgRef, {
    question: question.trim(),
    sender,
    response,
    timestamp: serverTimestamp(),
  });
};

export const readUserData = async function (userId) {
  const user = getUserID(userId);
  const userDBRef = query(ref(db), limitToLast(20));
  const response = await get(child(userDBRef, user + "/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return `{
          'INITIAL': {
            sender: ${AI_NAME},
            question: "Hello, who are you?",
            response:
              "Hi, I'm a friendly artificial intelligence bot. I'm here to answer your questions.",
          },
        }`;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return response;
};
