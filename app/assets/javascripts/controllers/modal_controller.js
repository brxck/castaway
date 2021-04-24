import { Controller } from "stimulus"

export default class extends Controller {
  static get targets() {
    return []
  }

  close() {
    this.element.classList.remove("is-active")
  }
}
