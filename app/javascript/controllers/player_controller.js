import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["audio", "toggle", "scrub", "volume", "speed"]

  /* Controller Actions */

  connect() {
    this.scrubUpdater = setInterval(this.updateScrub.bind(this), 500)
  }

  disconnect() {
    clearInterval(this.scrubUpdater)
  }

  togglePlay() {
    if (this.playing()) {
      this.audioTarget.pause()
    } else {
      this.audioTarget.play()
    }
    this.toggleTarget.classList.toggle("playing")
  }

  seekForward() {
    this.seek(30)
  }

  seekBack() {
    this.seek(-15)
  }

  setPosition() {
    this.audioTarget.currentTime =
      this.scrubTarget.value * this.audioTarget.seekable.end(0)
  }

  loadEpisode(e) {
    this.audioTarget.src = e.target.dataset.audio
    this.audioTarget.play()
    this.toggleTarget.classList.toggle("playing", true)
  }

  setVolume() {
    this.audioTarget.volume = this.volumeTarget.value
  }

  setSpeed() {
    const newSpeed = parseFloat(this.speedTarget.value, 10)
    if (newSpeed < 0) {
      this.speedTarget.value = 0.25
    } else if (newSpeed > 2) {
      this.speedTarget.value = 2
    }

    this.audioTarget.playbackRate = this.speedTarget.value
  }

  /* Internal functions */

  // Seek forward or backward without overshooting audio range
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

  // Compile HTML from Pug template
  compileTemplate(template, locals) {
    const pug = require(`../partials/${template}.pug`)
    return pug(locals)
  }

  // Create object from HTML data tags
  episodeFrom(element) {
    return {
      episode: element.dataset.episode,
      podcast: element.dataset.podcast,
      date: element.dataset.date,
      audio: element.dataset.audio
    }
  }

  loaded() {
    return this.audioTarget.src === "" ? false : true
  }

  playing() {
    return !this.audioTarget.paused
  }

  // Scrub value is the fraction of played audio
  updateScrub() {
    if (this.playing() && this.loaded()) {
      this.scrubTarget.value =
        this.audioTarget.currentTime / this.audioTarget.seekable.end(0)
    }
  }
}
