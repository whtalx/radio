import React, { forwardRef } from 'react'

import { Bottom, Center, Fill, Top, Wrapper } from './styled'

interface Props {
  style: React.CSSProperties
  onMouseDown: (e: React.MouseEvent) => void
  [key: string]: any
}

function Thumb(props: Props, ref: React.Ref<HTMLDivElement>) {
  return (
    <Wrapper {...props} ref={ref}>
      <Top />
      <Fill />
      <Center />
      <Fill />
      <Bottom />
    </Wrapper>
  )
}

export default forwardRef(Thumb)
