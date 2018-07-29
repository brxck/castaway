import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["button", "menu"]

  toggle_menu() {
    this.buttonTarget.classList.toggle("is-active")
    this.menuTarget.classList.toggle("is-active")
  }
}
