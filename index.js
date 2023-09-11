import { config } from "dotenv";
import { Bot, GrammyError, HttpError } from "grammy";
import * as ytdl from "ytdl-core";
import { createWriteStream } from "fs"

config();

const BOT_TOKEN = process.env.TOKEN;
if (!BOT_TOKEN) {
    throw new Error("Bot token is invalid");
}

const bot = new Bot(BOT_TOKEN);

bot.command("start", async (ctx, next) => {
    try {
        await ctx.reply("Send me link!");
    } catch (err) {
        next(err);
    }
});




bot.on("message::url", async (ctx, next) => {
    try {
        const url = ctx.message.text;
        await ctx.replyWithChatAction("upload_video");
        const video = await ytdl(url, { quality: "lowest" });

        await ctx.replyWithVideo({
            source: video
        })
        // ytdl.getInfo(url).then((info) => {
        //     console.log(info);
        //     const format = ytdl.chooseFormat(videoInfo.formats, { quality: "lowest" });
        //     const outputFilePath = `${info.videoDetails.title}.${format.container}`;

        //     const outputStream = createWriteStream(outputFilePath);

        //     // download the video file
        //     ytdl.downloadFromInfo(info, { format: format }).pipe(outputStream);

        //     // when the download is complete , show a message
        //     outputStream.on("finish", () => {
        //         console.log("Finished downloading : " + outputFilePath);
        //     })
        // });

    } catch (err) {
        next(err);
    }
});



bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});

bot.start();


// conversations 
async function videoExists(url) {
    await ytdl.getBasicInfo(url);
}