import { Telegraf } from "telegraf";
import { config } from "dotenv";
import ytdl from "ytdl-core";
import { createWriteStream } from "fs"

config();

const bot = new Telegraf(process.env.TOKEN);


bot.command("start", (ctx) => {
    ctx.reply("Send me a link");
});

// bot.hears(message("entities:url"))
bot.entity("url", async (ctx) => {
    const url = ctx.message.text;

    ytdl.getInfo(url).then((info) => {
        // Select the video format and quality
        const format = ytdl.chooseFormat(info.formats, { quality: "lowest" });
        // Create a write stream to save the video file
        const outputFilePath = `${info.videoDetails.title}.${format.container}`;
        const outputStream = createWriteStream(outputFilePath);
        // Download the video file
        ytdl.downloadFromInfo(info, { format: format }).pipe(outputStream);
        // When the download is complete, show a message
        outputStream.on('finish', () => {
            console.log(`Finished downloading: ${outputFilePath}`);
        });
    }).catch((err) => {
        console.error(err);
    });
});


bot.catch(err => {
    console.log(err);
})


bot.launch();