export default (list) =>
  list.map((tag) => ({
    ...tag,
    search: { tag: tag.name },
  }))
