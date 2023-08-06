const URL = window.location.href
let address

// use localhost for backend calls if running locally for dev, use azure for production.
if (URL === "http://localhost:3000/" || URL === "http://localhost:3000/bed" || URL === "http://localhost:3000/garden") {
  address = "http://localhost:3001/"
}
else {
  address = "https://kgp-web.azurewebsites.net/"
}

export { address }