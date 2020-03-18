import { makeEndpoint, error } from '.'

export function request(props) {
  return fetch(typeof props === `string` ? props : makeEndpoint(props))
    .then(response => response.json())
    .catch(error)
}
