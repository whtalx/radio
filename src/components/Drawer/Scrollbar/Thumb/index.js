import React, { forwardRef } from 'react'

import { Bottom, Center, Fill, Top, Wrapper } from './styled'

function Thumb(props, ref) {
  return (
    <Wrapper { ...props } ref={ ref }>
      <Top />
      <Fill />
      <Center />
      <Fill />
      <Bottom />
    </Wrapper>
  )
}

export default forwardRef(Thumb)
