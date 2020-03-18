export function getTags(list) {
  return list.map((tag) => ({
    ...tag,
    search: { tag: tag.name },
  }))
}
