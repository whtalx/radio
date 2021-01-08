export function color(color) {
  return function ({ theme }) {
    return `color: ${ (color && theme[color] && theme[color].color && theme[color].color) || `black` };`
  }
}
