export function saveState(store) {
  return () => {
    const { list, player } = store.getState()
    localStorage.setItem(`list`, JSON.stringify(list))
    localStorage.setItem(`player`, JSON.stringify(player))
  }
}
