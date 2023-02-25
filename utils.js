import { readUserData } from "./firebaseDB.js";
export const AI_NAME = "SAVAGE-AI";

export const getUserID = (userID) => {
  if (userID.includes("-")) {
    return userID.split("-")[0];
  }
  return userID.split("@")[0];
};

//Updates the conversation history and generates a response using GPT-3
export const getHistory = async (userID, messageSender, question) => {
  const user = getUserID(userID);
  let conversation_history = "";

  // Get the conversation history from the database
  let fireHistory = await readUserData(user);
  fireHistory = Object.values(fireHistory);

  // convert the object to a string
  fireHistory.map((conversation) => {
    conversation_history += `${conversation.sender}: ${conversation.question}\n`;
    conversation_history += `${AI_NAME}: ${conversation.response}\n`;
  });

  // Add current question to conversation history
  conversation_history += `${getUserID(messageSender)}: ${question.trim()}\n`;

  // trim the conversation history to less than 4000 tokens for GPT-3
  if (conversation_history.split(" ").length > 2000) {
    conversation_history = conversation_history
      .split(" ")
      .slice(conversation_history.split(" ").length - 2000)
      .join(" ");
  }

  return conversation_history;
};
