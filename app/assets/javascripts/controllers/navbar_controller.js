import { Controller } from "stimulus"

export default class extends Controller {
  static get targets() {
    return ["button", "menu"]
  }

  toggleMenu() {
    this.buttonTarget.classList.toggle("is-active")
    this.menuTarget.classList.toggle("is-active")
  }

  toggleDropdown(e) {
    e.currentTarget.classList.toggle("is-active")
  }
}
