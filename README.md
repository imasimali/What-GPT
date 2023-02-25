# what-gpt

The integration will allow users to interact with ChatGPT via WhatsApp text messages, providing automated responses based on their questions and commands with message history saved on Firebase Realtime Database.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Technologies

- [OpenAI](https://beta.openai.com/)
- [Venom-Bot](https://github.com/orkestral/venom/)
- [Firebase-RTDB](https://console.firebase.google.com/)

## Run the project

Clone this project with the command:

```bash
  git clone https://github.com/imasimali/what-gpt.git
```

Get OpenAI api keys for .env from [OpenAI](https://platform.openai.com/account/api-keys/).

Go to the .env.example file and rename it to .env, and change the necessary values ​​for it to work.

Now install the project dependencies with the command:

```bash
  npm install
```

Finally run the command below to start the project and read the QR Code with your Whasapp to connect with the service.

```bash
  npm start
```

### Optional (Save Message History on Firebase):

Create a Firebase Project. Goto Realtime Database and Create it. Copy the Database URL from Project Settings.
Use the following rules for Firebase Realtime Database to allow access and prevent deletion.

```bash
  {
  "rules": {
    ".read": true,
    ".write": "newData.exists()"
    }
  }
```
