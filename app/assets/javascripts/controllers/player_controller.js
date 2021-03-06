import { Controller } from "stimulus"

export default class extends Controller {
  static get targets() {
    return [
      "audio",
      "toggle",
      "scrub",
      "volume",
      "speed",
      "time",
      "art",
      "episode",
      "podcast",
      "artLink",
      "loading",
    ]
  }

  initialize() {
    this.audioListeners = []

    this.audioListeners <<
      this.audioTarget.addEventListener("ended", this.markListened.bind(this))

    if (this.data.get("lastPlayed") === "true" && this.loaded()) {
      this.audioTarget.addEventListener("loadedmetadata", () => {
        this.audioTarget.currentTime =
          this.data.get("lastTime") * this.audioTarget.seekable.end(0)
        this.updateScrub(true)
      })
    }

    document.body.addEventListener("keydown", this.keyboardShortcut.bind(this))

    this.audioTarget.addEventListener("playing", () => {
      this.loadingTarget.classList.toggle("player-loading-show", false)
    })
  }

  connect() {
    this.scrubUpdater = setInterval(this.updateScrub.bind(this), 500)
    this.timeUpdater = setInterval(this.markTime.bind(this), 60000)
  }

  disconnect() {
    clearInterval(this.scrubUpdater)
    clearInterval(this.timeUpdater)

    for (let listener in this.audioListeners) {
      this.audioTarget.removeEventListener(listener)
    }
  }

  /* Controller Actions */

  togglePlay() {
    if (!this.loaded()) {
      return
    } else if (this.playing()) {
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
    this.data.set("lastPlayed", "false")
    this.field = e.target.parentNode.parentNode

    const episode = this.episodeFrom(e.currentTarget)
    this.audioTarget.src = episode.audio
    this.data.set("episodeId", episode.episodeId)
    this.data.set("podcastId", episode.podcastId)

    this.setNowPlaying(episode)

    this.audioTarget.currentTime = episode.time
    this.audioTarget.play()
    this.setSpeed()
    this.updateButton()

    this.loadingTarget.classList.toggle("player-loading-show", true)
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

    const episodeUrl = `/podcasts/${episode.podcastId}?episode_id=${episode.episodeId}`
    this.artLinkTarget.href = episodeUrl
    this.episodeTarget.href = episodeUrl
    this.podcastTarget.href = `/podcasts/${episode.podcastId}`
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
    if (this.audioTarget.currentTime === "0" || !this.playing()) {
      return
    }

    if (document.getElementById("signed-in")) {
      this.post("/histories", {
        history: {
          episode_id: this.data.get("episodeId"),
          podcast_id: this.data.get("podcastId"),
          listened: false,
          time: this.audioTarget.currentTime,
        },
      })
    }

    this.post("/plays", {
      cookie: {
        podcast_id: this.data.get("podcastId"),
        podcast_name: this.podcastTarget.textContent,
        art_url: this.artTarget.src,
        episode_title: this.episodeTarget.textContent,
        episode_id: this.data.get("episodeId"),
        episode_url: this.audioTarget.src,
        time_played:
          this.audioTarget.currentTime / this.audioTarget.seekable.end(0),
      },
    })
  }

  markListened() {
    if (document.getElementById("signed-in") === null) {
      return
    }

    this.post("/history", {
      history: {
        episode_id: this.data.get("episodeId"),
        podcast_id: this.data.get("podcastId"),
        listened: true,
      },
    })

    this.field.getElementsByClassName("yes")[0].classList.toggle("hidden", true)
    this.field.getElementsByClassName("no")[0].classList.toggle("hidden", false)
  }

  post(path, params) {
    const token = document.querySelector("meta[name=csrf-token]").content

    fetch(path, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token,
      },
    })
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
      podcastId: element.dataset.podcastId,
    }
  }

  loaded() {
    return this.audioTarget.src === "" ? false : true
  }

  playing() {
    return !this.audioTarget.paused
  }

  // Scrub value is the fraction of played audio
  updateScrub(force) {
    if (force || (this.playing() && this.loaded())) {
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

  keyboardShortcut(e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      return
    }

    switch (e.key) {
      case " ":
        this.togglePlay()
        e.preventDefault()
        break
      case "d":
        this.seekForward()
        e.preventDefault()
        break
      case "a":
        this.seekBack()
        e.preventDefault()
        break
      case "w":
        this.volumeTarget.value = parseFloat(this.volumeTarget.value) + 0.1
        this.setVolume()
        e.preventDefault()
        break
      case "s":
        this.volumeTarget.value = parseFloat(this.volumeTarget.value) - 0.1
        this.setVolume()
        e.preventDefault()
        break
    }
  }
}
