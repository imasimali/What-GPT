# what-gpt

The integration will allow users to interact with ChatGPT via WhatsApp text messages, providing automated responses based on their questions and commands with message history saved on Firebase Realtime Database.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Technologies

- [Firebase-RLTB](https://console.firebase.google.com/)
- [OpenAI](https://beta.openai.com/)
- [Venom-Bot](https://github.com/orkestral/venom/)

## Run the project

Clone this project with the command:

```bash
  git clone https://github.com/imasimali/what-gpt.git
```

Create a Firebase Project. Goto Realtime Database and Enable it. Copy the Database URL and API key from Project Settings.

Also get OpenAI api keys for .env from [OpenAI](https://platform.openai.com/account/api-keys/).

Go to the .env.example file and rename it to .env, and change the necessary values ​​for it to work.

Now install the project dependencies with the command:

```bash
  npm install
```

Finally run the command below to start the project and read the QR Code with your Whasapp to connect with the service.

```bash
  npm start
```
