import { Controller } from "stimulus"

export default class extends Controller {
  static get targets() {
    return []
  }

  static get values() {
    return { id: String }
  }

  async initialize() {
    const res = await fetch(`/podcasts/${this.idValue}/new_episodes`)
    const { episodes } = await res.json()
    if (!episodes) return
    const refresh = confirm("New episodes available") // TODO UI
    if (refresh) document.getElementById("refresh-episodes").click()
  }
}
