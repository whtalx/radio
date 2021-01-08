import styled from 'styled-components'
import { filter } from '../../functions'

export function Image(color) {
  return styled.img.attrs(({ width, height }) => ({
    draggable: false,
    width: width || `100%`,
    height: height || `100%`,
  }))`
    position: ${ ({ relative }) => relative ? `relative` : `absolute` };
    left: 0;
    top: 0;
    ${ filter(color) }
  `
}
