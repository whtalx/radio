export function error(error) {
  return error.type === `abort`
    ? undefined
    : /200\s\(OK/i.test(error.message)
      ? undefined
      : Boolean(error.target)
        ? /empty.src/i.test(error.target.error.message)
          ? undefined
          : console.log
        : /user\saborted/i.test(error.message)
          ? undefined
          : console.log
}
