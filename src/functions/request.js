import makeEndpoint from './makeEndpoint'
import error from './error'

export default (props) =>
  fetch(typeof props === `string` ? props : makeEndpoint(props))
    .then(response => response.json())
    .catch(error)
