const { OpenAI } = require("openai");
// const readlineSync = require("readline-sync");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

async function main() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "Say this is a test" }],
    model: "gpt-3.5-turbo",
  });

  console.log(chatCompletion.choices);
}

main();
