import makeSetAllAction from './makeSetAllAction'

export default (list) =>
  list.map((code) => ({
    ...code,
    action: makeSetAllAction({ countrycode: code.name }),
  }))
