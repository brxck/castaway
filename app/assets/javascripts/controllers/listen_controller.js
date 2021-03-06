import { Controller } from "stimulus"

export default class extends Controller {
  static get targets() {
    return ["yes", "no"]
  }

  initialize() {
    this.element.addEventListener(
      "ajax:success",
      this.toggleListened.bind(this)
    )

    this.element.addEventListener("ajax:failure", (e) =>
      console.error("(un)subscribe failed", e)
    )
  }

  toggleListened() {
    this.yesTarget.classList.toggle("hidden")
    this.noTarget.classList.toggle("hidden")
  }
}
