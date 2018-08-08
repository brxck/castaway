import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [
    "audio",
    "toggle",
    "scrub",
    "volume",
    "speed",
    "time",
    "art",
    "episode",
    "podcast"
  ]

  /* Controller Actions */

  initialize() {
    this.listenEvent = this.audioTarget.addEventListener(
      "ended",
      this.markListened.bind(this)
    )
  }

  connect() {
    this.scrubUpdater = setInterval(this.updateScrub.bind(this), 500)
    this.timeUpdater = setInterval(this.markTime.bind(this), 60000)
  }

  disconnect() {
    clearInterval(this.scrubUpdater)
    clearInterval(this.timeUpdater)
  }

  togglePlay() {
    if (this.playing()) {
      this.audioTarget.pause()
    } else {
      this.audioTarget.play()
    }
    this.updateButton()
  }

  seekForward() {
    if (this.loaded()) {
      this.seek(30)
    }
  }

  seekBack() {
    if (this.loaded()) {
      this.seek(-15)
    }
  }

  setPosition() {
    this.audioTarget.currentTime =
      this.scrubTarget.value * this.audioTarget.seekable.end(0)
  }

  loadEpisode(e) {
    if (this.loaded()) {
      this.markTime()
    }
    this.field = e.target.parentNode.parentNode

    const episode = this.episodeFrom(e.currentTarget)
    this.audioTarget.src = episode.audio
    this.data.set("episodeId", episode.episodeId)
    this.data.set("podcastId", episode.podcastId)

    this.setNowPlaying(episode)
    this.audioTarget.currentTime = episode.time

    this.audioTarget.addEventListener("canplay", () => {
      this.audioTarget.play()
      this.setSpeed()
      this.updateButton()
    })
  }

  setVolume() {
    this.audioTarget.volume = this.volumeTarget.value
  }

  setSpeed() {
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

  setNowPlaying(episode) {
    this.artTarget.src = episode.art
    this.episodeTarget.textContent = episode.episode
    this.podcastTarget.textContent = episode.podcast + " - " + episode.date
  }

  updateButton() {
    if (this.playing()) {
      this.toggleTarget.firstChild.classList.toggle("hidden", true)
      this.toggleTarget.lastChild.classList.toggle("hidden", false)
    } else {
      this.toggleTarget.firstChild.classList.toggle("hidden", false)
      this.toggleTarget.lastChild.classList.toggle("hidden", true)
    }
  }

  markTime() {
    if (this.audioTarget.currentTime === "0" || !this.loaded()) {
      return
    }

    if (document.getElementById("signed-in")) {
      const historyParams = {
        history: {
          episode_id: this.data.get("episodeId"),
          podcast_id: this.data.get("podcastId"),
          listened: false,
          time: this.audioTarget.currentTime
        }
      }
      this.sendHistory(historyParams)
    } else {
      const cookieParams = {
        cookie: {
          podcast_id: this.data.get("podcastId"),
          podcast_name: this.podcastTarget.textContent,
          art_url: this.artTarget.src,
          episode_name: this.episodeTarget.textContent,
          episode_id: this.data.get("episodeId"),
          time: this.audioTarget.currentTime
        }
      }
      this.sendCookie(cookieParams)
    }
  }

  markListened() {
    if (document.getElementById("signed-in") === null) {
      return
    }

    const historyParams = {
      history: {
        episode_id: this.data.get("episodeId"),
        podcast_id: this.data.get("podcastId"),
        listened: true
      }
    }

    this.sendHistory(historyParams)

    this.field.getElementsByClassName("yes")[0].classList.toggle("hidden", true)
    this.field.getElementsByClassName("no")[0].classList.toggle("hidden", false)
  }

  sendHistory(params) {
    const token = document.querySelector("meta[name=csrf-token]").content

    fetch("/histories", {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token
      }
    })
  }

  sendCookie(params) {
    console.log("sending cookie")
    const token = document.querySelector("meta[name=csrf-token]").content

    fetch("/cookies", {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token
      }
    })
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
      audio: element.dataset.audio,
      art: element.dataset.art,
      time: parseFloat(element.dataset.time),
      episodeId: element.dataset.episodeId,
      podcastId: element.dataset.podcastId
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

      this.timeTarget.textContent = `${this.formatTime(
        this.audioTarget.currentTime
      )} / ${this.formatTime(this.audioTarget.seekable.end(0))}`
    }
  }

  formatTime(seconds) {
    return new Date(1000 * seconds)
      .toISOString()
      .substr(11, 8)
      .replace(/^[0:]{3,4}/, "")
  }
}
