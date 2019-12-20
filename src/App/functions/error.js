export default (error) => void error
  // error.type === `abort`
  //   ? undefined
  //   : error.target
  //     ? error.target.currentSrc === `` || error.target.error.code === 1
  //       ? undefined
  //       : console.error(error)
  //     : error.path
  //       ? /empty.src/i.test(error.path[0].error.message)
  //         ? undefined
  //         : console.error(error)
  //       : /user\saborted/i.test(error.message)
  //         ? undefined
  //         : console.error(error)
