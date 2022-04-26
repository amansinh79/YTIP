#!/usr/bin/env node

const ytdl = require("ytdl-core")
const cp = require("child_process")
const inq = require("inquirer")
const ytsr = require("ytsr")
const Speaker = require("speaker")

const searchString = process.argv.slice(2).join(" ")

ytsr(searchString, { limit: 20 }).then(async (result) => {
  const video = (
    await inq.prompt({
      name: "video",
      type: "list",
      message: "choose audio",
      choices: result.items.map((t) => [t.id, t.title, t.author?.name, t.duration].join(" ")),
      loop: false,
    })
  ).video.split(" ")[0]

  ytdl.getInfo(result.items.find((t) => t.id === video).url).then(async (info) => {
    const { url } = info.formats.filter((t) => t.hasAudio && !t.hasVideo && t.audioQuality === "AUDIO_QUALITY_MEDIUM" && t.container === "mp4")[0]

    // audioSpeaker(url)
    electron(url)
  })
})

function audioSpeaker(url) {
  const pcm = cp.spawn("ffmpeg", ["-i", `${url}`, "-acodec", "pcm_s16le", "-f", "s16le", "-ac", "2", "-ar", "44100", "-"])

  const speaker = new Speaker({
    channels: 2, // 2 channels
    bitDepth: 16, // 16-bit samples
    sampleRate: 44100, // 44,100 Hz sample rate
  })

  pcm.stdout.pipe(speaker)

  console.log("Playing...")
}

function electron(url) {
  cp.spawn("electron", ["main.js", `${url}`], { cwd: __dirname })
  console.log("Playing...")
}
