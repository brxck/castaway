import { Controller } from "stimulus"

export default class extends Controller {
  static get targets() {
    return []
  }

  toggleSublist(e) {
    e.currentTarget.parentNode.parentNode
      .getElementsByTagName("ul")[0]
      .classList.toggle("hidden")
    e.target.classList.toggle("mdi-rotate-90")
    e.preventDefault()
  }
}
