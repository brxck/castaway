import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["audio", "toggle", "source", "playlist"]

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
    this.audioTarget.src = e.target.dataset.audio
    this.audioTarget.play()
    this.toggleTarget.classList.toggle("playing", true)
  }

  // Internal

  render(template, locals) {
    const pug = require(`../partials/${template}.pug`)
    return pug(locals)
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
