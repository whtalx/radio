import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Output, Title, Tick } from './styled'

const Wrapper = styled(Output)`
  width: 160px;
  position: absolute;
  left: 96px;
  top: 0;
`

const Content = styled(Title)`
  width: 157px;
`

export default ({ title }) => {
  const container = useRef(null)
  const [text, setText] = useState(title)

  useEffect(
    () => {
      setText(title)
    },
    [title],
  )

  // useEffect(
  //   () => {
  //     if (text === `${ title } *** ${ title }`) return
  //
  //     const { current } = container
  //     const containerWidth = current.clientWidth
  //     const textWidth = current.firstElementChild.clientWidth
  //     // console.log(textWidth, containerWidth)
  //
  //     if (textWidth > containerWidth) {
  //       text === title && setText(`${ title } *** ${ title }`)
  //     } else {
  //       text !== title && setText(title)
  //     }
  //   },
  //   [text] // eslint-disable-line
  // )

  return (
    <Wrapper>
      <Content ref={ container } title={ title }>
        <Tick>{ text }</Tick>
      </Content>
    </Wrapper>
  )
}
