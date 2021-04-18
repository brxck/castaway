const showSpinner = () => {
  document.getElementById("loading").classList.add("is-active")
}

const hideSpinner = () => {
  document.getElementById("loading").classList.remove("is-active")
}

document.addEventListener("turbo:load", hideSpinner)
document.addEventListener("turbo:request-start", showSpinner)
document.addEventListener("turbo:request-end", hideSpinner)
