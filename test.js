import { create } from "venom-bot";
create({
  session: "Chat-GPT",
  multidevice: true,
})
  .then((client) => {
    client.close();
  })
  .catch((error) => {
    console.log(error);
  });
