const ytdl = require("ytdl-core")
const cp = require("child_process")
const inq = require("inquirer")
const ytsr = require("ytsr")

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
    const stream = info.formats.filter((t) => t.hasAudio && !t.hasVideo && t.audioQuality === "AUDIO_QUALITY_MEDIUM" && t.container === "mp4")[0]
    const proc = cp.spawn("ffplay", ["-hide_banner", "-autoexit", stream.url])

    console.log(`
    q, ESC
    Quit.
    
    p, SPC
    Pause.
    
    m
    Toggle mute.
    
    9, 0
    Decrease and increase volume respectively.
    
    /, *
    Decrease and increase volume respectively.
     
    left/right
    Seek backward/forward 10 seconds.
    
    down/up
    Seek backward/forward 1 minute.
`)

    proc.stderr.pipe(process.stderr)
    proc.stdout.pipe(process.stdout)
  })
})
