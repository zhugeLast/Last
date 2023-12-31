import axios from 'axios';

export const config = {
  name: "buddy",
  version: "2.1.0",
  credits: "August Quinn",
  description: "An AI Chat Buddy, your ultimate companion.",
  usage: "[prompt]",
  cooldown: 5,
};

export async function onCall({ message, args }) {
  const prompt = args.join(" ");

  if (!prompt) {
    message.reply("Kamusta, ano ang maitutulong ko sa'yo ngayon?");
    return;
  }

  try {
    const userName = await getUserName(api, senderID);
    const buddyAPI = "https://ai-buddy.august-quinn-api.repl.co/prompt";
    const response = await axios.post(buddyAPI, { prompt, userName });

    if (response.data && response.data.openai && response.data.openai.generated_text) {
      const generatedText = response.data.openai.generated_text;
      message.reply(generatedText);
    } else {
      message.reply("Error processing the prompt. Please try again later.");
    }
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    message.reply("Error processing the prompt. Please try again later.");
  }
};

async function getUserName(userID) {
  try {
    const name = await global.api.getUserInfo(userID);
    return name[userID]?.firstName || "Friend";
  } catch (error) {
    console.error("Error getting user name:", error);
    return "Friend";
  }
}