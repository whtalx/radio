export function getSavedState({ list, player }) {
  return {
    list: {
      ...list(undefined, {}),
      ...JSON.parse(localStorage.list || `{}`),
      visible: false,
    },

    player: {
      ...player(undefined, {}),
      ...JSON.parse(localStorage.player || `{}`),
      currentState: `paused`,
      videoHeight: 0,
    }
  }
}
