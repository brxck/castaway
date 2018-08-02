import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["yes", "no"]

  initialize() {
    console.log("connected")
    this.element.addEventListener(
      "ajax:success",
      this.toggleListened.bind(this)
    )

    this.element.addEventListener("ajax:failure", e =>
      console.log("(un)subscribe failed", e)
    )
  }

  toggleListened() {
    console.log("toggle")
    this.yesTarget.classList.toggle("hidden")
    this.noTarget.classList.toggle("hidden")
  }
}
