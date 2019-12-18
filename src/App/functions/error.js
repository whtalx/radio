export default ({ message }) =>
  message === `body is undefined`
    ? false
    : console.error(message)
