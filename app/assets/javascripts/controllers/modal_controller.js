import { Controller } from "stimulus"

export default class extends Controller {
  static targets = []

  close() {
    this.element.classList.remove("is-active")
  }
}
