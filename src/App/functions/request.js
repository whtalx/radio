import { v4 } from 'uuid'

export default (endpoint) =>
  fetch(endpoint)
    .then(response => response.json())
    .then((data) =>
      data.map((item) => ({
        ...item,
        id: v4(),
      }))
    )
