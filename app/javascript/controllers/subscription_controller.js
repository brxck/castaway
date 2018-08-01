import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["button"]

  initialize() {
    this.buttonTarget.addEventListener("ajax:success", this.subscribe)
  }

  subscribe() {
    console.log("success")
  }
}
