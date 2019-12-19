export default ({ message }) =>
  /user\saborted/i.test(message)
    ? false
    : console.error(message)
