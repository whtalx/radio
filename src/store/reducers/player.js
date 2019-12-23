export default (state = {}, { type, payload }) => {
  switch (type) {
    case `SET_STATION`:
      return {
      ...state,
      station: payload,
    }

    default:
      return state
  }
}
