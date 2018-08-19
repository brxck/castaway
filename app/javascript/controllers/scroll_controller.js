import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["area", "left", "right"]

  connect() {
    this.updateOverlays()
  }

  updateOverlays() {
    const scrollLeftMax =
      this.areaTarget.scrollWidth - this.areaTarget.clientWidth

    if (this.areaTarget.scrollLeft === 0) {
      this.toggleVisibility(this.leftTarget, true)
    } else if (this.areaTarget.scrollLeft === scrollLeftMax) {
      this.toggleVisibility(this.rightTarget, true)
    } else {
      this.toggleVisibility(this.rightTarget, false)
      this.toggleVisibility(this.rightTarget, false)
      this.toggleVisibility(this.leftTarget, false)
      this.toggleVisibility(this.leftTarget, false)
    }
  }

  scrollRight() {
    console.log(this.areaTarget.clientWidth, this.areaTarget.clientWidth % 220)
    this.areaTarget.scrollLeft +=
      220 * Math.floor(this.areaTarget.clientWidth / 220)
  }

  scrollLeft() {
    this.areaTarget.scrollLeft -=
      220 * Math.floor(this.areaTarget.clientWidth / 220)
  }

  toggleVisibility(element, force = false) {
    element.classList.toggle("is-transparent", force)
    setTimeout(() => {
      element.classList.toggle("is-invisible", force)
    }, 250)
  }
}
