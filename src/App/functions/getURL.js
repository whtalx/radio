export default (endpoint) =>
  fetch(endpoint)
    .then(response => response.json())
    .then(({ url }) => url)
