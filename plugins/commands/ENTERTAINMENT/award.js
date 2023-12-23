import { loadImage, createCanvas } from 'canvas';
import Canvas from 'canvas';
import request from 'request';
import fs from 'fs-extra';
import axios from 'axios';
import path from 'path';

const config = {
  name: "award",
  version: "3.1.1",
  hasPermssion: 0,
  credits: "John Lester (Converted by Grim)",
  description: "Award for your self <3",
  usage: "[ name ] | [ text ]",
  cooldown: 10
};

async function wrapText(ctx, text, maxWidth) {
  return new Promise((resolve) => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText("W").width > maxWidth) return resolve(null);
    const words = text.split(" ");
    const lines = [];
    let line = "";
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth)
        line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = "";
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
};

const __dirname = path.dirname(new URL(import.meta.url).pathname);

async function onCall({ message, args, Users, prefix }) {
  let { senderID, threadID, messageID } = message;
  let pathImg = __dirname + `/cache/awardv1.png`;
  const text = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");
  if (!text) return global.api.sendMessage(`Invalid format! Usage: ${prefix}award [name] | [text]`, threadID, messageID);
  let getImage = (
    await axios.get(encodeURI(`https://i.ibb.co/QC0hdpJ/Picsart-22-08-15-17-00-15-867.jpg`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getImage, "utf-8"));
if(!fs.existsSync(__dirname+'/font/SVN-Arial 2.ttf')) { 
      let getfont = (await axios.get(`https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+"/font/SVN-Arial 2.ttf", Buffer.from(getfont, "utf-8"));
    };
  let baseImage = await loadImage(pathImg);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  Canvas.registerFont(__dirname+`/font/SVN-Arial 2.ttf`, {
        family: "SVN-Arial 2"
    });
  ctx.font = "30px SVN-Arial 2";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  
  const line = await wrapText(ctx, text[0], 464);
  const lines = await wrapText(ctx, text[1], 464);
  ctx.fillText(line.join("\n"), 325, 250)
  ctx.fillText(lines.join("\n"), 325, 280)
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  return global.api.sendMessage(
    { attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};

export default {
  wrapText,
  config,
  onCall
}