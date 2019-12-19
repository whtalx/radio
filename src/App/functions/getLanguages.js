import makeSetAllAction from './makeSetAllAction'

export default (list) =>
  list.map((language) => ({
    ...language,
    action: makeSetAllAction({ language: language.name }),
  }))
