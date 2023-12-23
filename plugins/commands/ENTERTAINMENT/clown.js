const config = {
  name: "clown",
  description: "clown image creator",
  usage: "[@mention/reply]",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "Grim"
}

const langData = {
  "vi_VN": {
    "error": "Có lỗi xảy ra, vui lòng thử lại sau"
  },
  "en_US": {
    "error": "An error occurred, please try again later"
  },
  "ar_SY": {
    "error": "لقد حدث خطأ، رجاء أعد المحاولة لاحقا"
  }
}

async function onCall({ message, getLang }) {
  try {
    const { mentions, messageReply, senderID } = message;
    const targetID = Object.keys(mentions)[0] || messageReply?.senderID || senderID;

    const avatarURL = global.getAvatarURL(targetID);

    const clown = await global.getStream(`https://api.popcat.xyz/clown?image=${encodeURIComponent(avatarURL)}`);

    return message.reply({
      attachment: clown
    });

  } catch (e) {
    console.error(e);
    return message.reply(getLang("error"));
  }
}

export default {
  config,
  langData,
  onCall
}
