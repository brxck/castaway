import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["subscribe", "unsubscribe"]

  initialize() {
    this.element.addEventListener(
      "ajax:success",
      this.toggleSubscription.bind(this)
    )

    this.element.addEventListener("ajax:failure", e =>
      console.log("(un)subscribe failed", e)
    )
  }

  toggleSubscription() {
    this.subscribeTarget.classList.toggle("hidden")
    this.unsubscribeTarget.classList.toggle("hidden")
  }
}
