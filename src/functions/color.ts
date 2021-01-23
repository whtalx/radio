export function color(color: string) {
  return function ({ theme }: { [key: string]: any }): string {
    return `color: ${ (color && theme[color] && theme[color].color && theme[color].color) || `black` };`
  }
}
