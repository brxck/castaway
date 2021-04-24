import { Controller } from "stimulus"

export default class extends Controller {
  static get targets() {
    return ["area", "left", "right"]
  }

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
    this.areaTarget.scrollLeft +=
      220 * Math.floor(this.areaTarget.clientWidth / 220)
  }

  scrollLeft() {
    this.areaTarget.scrollLeft -=
      220 * Math.floor(this.areaTarget.clientWidth / 220)
  }

  toggleVisibility(element, force = false) {
    const delay = force === true ? 0 : 300
    element.classList.toggle("is-transparent", force)
    setTimeout(() => {
      element.classList.toggle("is-invisible", force)
    }, delay)
  }
}
