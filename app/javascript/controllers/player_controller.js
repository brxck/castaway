import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["audio", "toggle", "source", "playlist"]

  initialize() {
    this.playlist = []
    this.nowPlaying
  }

  connect() {
    console.log("player controller connected")
  }

  toggle() {
    if (this.isPlaying) {
      this.audioTarget.pause()
    } else {
      this.audioTarget.play()
    }
    this.toggleTarget.classList.toggle("playing")
  }

  forward() {
    this.seek(30)
  }

  back() {
    this.seek(-15)
  }

  seek(delta) {
    const newTime = this.audioTarget.currentTime + delta
    const startTime = this.audioTarget.seekable.start(0)
    const endTime = this.audioTarget.seekable.end(0)

    if (newTime < startTime) {
      this.audioTarget.currentTime = startTime
    } else if (newTime > endTime) {
      this.audioTarget.currentTime = endTime
    } else {
      this.audioTarget.currentTime = newTime
    }
  }

  play(e) {
    if (this.nowPlaying) {
      this.enqueuePlaying(this.nowPlaying)
    }

    this.nowPlaying = this.episodeFrom(e.target)

    this.audioTarget.src = e.target.dataset.audio
    this.audioTarget.play()
    this.toggleTarget.classList.toggle("playing", true)
  }

  enqueue() {}

  // Internal

  enqueuePlaying(episode) {
    this.playlist.push(episode)
    const entryTemplate = require("../partials/playlist_entry.pug")
    this.playlistTarget.insertAdjacentHTML(
      "beforeend",
      entryTemplate({ episode: episode })
    )
  }

  episodeFrom(element) {
    return {
      episode: element.dataset.episode,
      podcast: element.dataset.podcast,
      date: element.dataset.date,
      audio: element.dataset.audio
    }
  }

  isPlaying() {
    this.toggleTarget.classList.contains("playing")
  }
}
