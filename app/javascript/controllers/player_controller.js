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

  playEpisode(e) {
    // move already playing episode to playlist
    if (this.nowPlaying) {
      this.enqueuePlaying(this.nowPlaying)
    }

    this.nowPlaying = {
      episode: e.target.dataset.episode,
      podcast: e.target.dataset.podcast,
      date: e.target.dataset.date,
      audio: e.target.dataset.audio
    }
    console.log(this.nowPlaying)

    this.audioTarget.src = e.target.dataset.audio
    this.audioTarget.play()
    this.toggleTarget.classList.toggle("playing", true)
  }

  enqueuePlaying(episode) {
    this.playlist.push(episode)
    const entryTemplate = require("../partials/playlist_entry.pug")
    this.playlistTarget.insertAdjacentHTML(
      "beforeend",
      entryTemplate({ episode: episode })
    )
  }

  enqueue() {}

  isPlaying() {
    this.toggleTarget.classList.contains("playing")
  }
}
