import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["audio", "toggle", "source", "info", "episode", "podcast"]

  connect() {
    console.log("player controller connected")
  }

  play() {
    this.audioTarget.play()
    this.toggleTarget.classList.toggle("playing", true)
  }

  toggle() {
    if (this.toggleTarget.classList.contains("playing")) {
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

  load(e) {
    this.audioTarget.src = e.target.dataset.audio
    this.episodeTarget.textContent = e.target.dataset.episode
    this.podcastTarget.textContent =
      e.target.dataset.podcast + " - " + e.target.dataset.date
    this.play()
  }
}
