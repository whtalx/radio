import styled, { StyledComponentBase } from 'styled-components'
import { filter } from '../../functions'

export function Image(color: string): StyledComponentBase<'img', any> {
  return styled.img.attrs(({ width, height }: { width: string, height: string }) => ({
    draggable: false,
    width: width || `100%`,
    height: height || `100%`,
  }))`
    position: ${ ({ relative }: { relative: boolean }) => relative ? `relative` : `absolute` };
    left: 0;
    top: 0;
    ${ filter(color) }
  `
}
