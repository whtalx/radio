import makeSetAllAction from './makeSetAllAction'

export default (list) =>
  list.map((tag) => ({
    ...tag,
    action: makeSetAllAction({ tag: tag.name }),
  }))
