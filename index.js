import { Configuration, OpenAIApi } from "openai";
import { create } from "venom-bot";
import * as dotenv from "dotenv";
dotenv.config();

// Start Express Server
import hsp from "heroku-self-ping";
import express from "express";
const app = express();
const port = process.env.PORT || 3000;

// Self Ping - Keep Alive
hsp(`https://${process.env.HEROKU_APP_NAME}.herokuapp.com`);

app.get("/", (req, res) => {
  res.send("Hello World! 🤖 - Chat GPT Bot - Created by @imasimali 🚀");
});
app.listen(port, () => console.log(`App listening on port ${port}!`));
// End

create({
  session: "Chat-GPT",
  multidevice: true,
})
  .then((client) => start(client))
  .catch((error) => {
    console.log(error);
  });

const configuration = new Configuration({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

const getDavinciResponse = async (clientText) => {
  const options = {
    model: "text-davinci-003", // GPT model to use
    prompt: clientText, // Text submitted by the user
    temperature: 1, // Variation level of generated responses, 1 is the maximum
    max_tokens: 4000, // Number of tokens (words) to be returned by the bot, 4000 is the maximum
  };

  try {
    const response = await openai.createCompletion(options);
    let botResponse = "";
    response.data.choices.forEach(({ text }) => {
      botResponse += text;
    });
    return `Chat GPT 🤖\n\n${botResponse.trim()}`;
  } catch (e) {
    return `❌ OpenAI Response Error: ${e.response.data.error.message}`;
  }
};

const getDalleResponse = async (clientText) => {
  const options = {
    prompt: clientText, // Image description
    n: 1, // // Number of images to be generated
    size: "1024x1024", // Image size
  };

  try {
    const response = await openai.createImage(options);
    return response.data.data[0].url;
  } catch (e) {
    return `❌ OpenAI Response Error: ${e.response.data.error.message}`;
  }
};

const commands = (client, message) => {
  const botCommands = {
    davinci3: "/bot",
    dalle: "/img",
  };

  let firstWord = message.text.substring(0, message.text.indexOf(" "));

  switch (firstWord) {
    case botCommands.davinci3:
      const question = message.text.substring(message.text.indexOf(" "));
      getDavinciResponse(question).then((response) => {
        /*
         * We will do a validation on message.from
         * in case we send a command
         * the response is not sent to
         * our own number and yes to
         * the person or group I sent it to
         */
        client.sendText(
          message.from === process.env.BOT_NUMBER ? message.to : message.from,
          response
        );
      });
      break;

    case botCommands.dalle:
      const imgDescription = message.text.substring(message.text.indexOf(" "));
      getDalleResponse(imgDescription, message).then((imgUrl) => {
        client
          .sendImage(
            message.from === process.env.BOT_NUMBER ? message.to : message.from,
            imgUrl,
            imgDescription,
            "Image generated by DALL-E 🤖"
          )
          .catch((e) => {
            client.sendText(
              message.from === process.env.BOT_NUMBER
                ? message.to
                : message.from,
              imgUrl
            );
          });
      });
      break;
  }
};

async function start(client) {
  client.onAnyMessage((message) => commands(client, message));
}
