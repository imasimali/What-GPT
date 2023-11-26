import * as dotenv from "dotenv";
dotenv.config();
import { readUserData } from "./database.js";

export const AI_NAME = process.env.BOT_PERSONALITY
  ? `${process.env.BOT_PERSONALITY} Bot`
  : "AI";

//Updates the conversation history and generates a response using GPT-3
export const getHistory = async (sender_id, sender_text) => {
  let conversation_history = "";

  if (process.env.FIREBASE_DB_URL) {
    // Get the conversation history from the database
    let fireHistory = await readUserData(sender_id);
    if (!fireHistory) {
      fireHistory = {};
    }

    fireHistory = Object.values(fireHistory);

    // convert the object to a string
    fireHistory.map((conversation) => {
      conversation_history += `${sender_id}: ${conversation.question}\n`;
      conversation_history += `${AI_NAME}: ${conversation.response}\n`;
    });
  } else {
    conversation_history = `${AI_NAME}: Hi, I'm here to answer your questions.\n`;
  }

  // Add current question to conversation history
  conversation_history += `${sender_id}: ${sender_text}\n`;

  // trim the conversation history to less than 4000 tokens for GPT-3
  if (conversation_history.split(" ").length > 2000) {
    conversation_history = conversation_history
      .split(" ")
      .slice(conversation_history.split(" ").length - 2000)
      .join(" ");
  }

  return conversation_history;
};
