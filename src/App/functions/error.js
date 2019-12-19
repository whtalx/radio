export default (error) =>
  error.type === `abort`
    ? undefined
    : error.target
      ? error.target.currentSrc === `` || error.target.error.code === 1
        ? undefined
        : console.error(error)
      : /user\saborted/i.test(error.message)
        ? undefined
        : console.error(error)
