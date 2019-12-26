export default (error) =>
  error.type === `abort`
    ? undefined
    : Boolean(error.target)
      ? /empty.src/i.test(error.target.error.message)
        ? undefined
        : console.error(error)
      : /user\saborted/i.test(error.message)
        ? undefined
        : console.error(error)
