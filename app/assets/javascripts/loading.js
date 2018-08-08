const showSpinner = () => {
  document.getElementById("loading").classList.add("is-active")
}

const hideSpinner = () => {
  document.getElementById("loading").classList.remove("is-active")
}

document.addEventListener("turbolinks:load", hideSpinner)
document.addEventListener("turbolinks:request-start", showSpinner)
document.addEventListener("turbolinks:request-end", hideSpinner)
