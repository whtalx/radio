import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Output, Title as Container, Tick } from './styled'
import { ReactComponent as BitrateIcon } from '../../icons/kbps.svg'
import { ReactComponent as SamplerateIcon } from '../../icons/khz.svg'

const TitleWrapper = styled(Output)`
  width: 160px;
  position: absolute;
  left: 96px;
  top: 0;
`

const TitleContent = styled(Container)`
  width: 157px;
`

export function Title({ title }) {
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
    <TitleWrapper>
      <TitleContent ref={ container } title={ title }>
        <Tick>{ text }</Tick>
      </TitleContent>
    </TitleWrapper>
  )
}

const BitrateWrapper = styled(Output)`
  width: 24px;
  position: absolute;
  left: 96px;
  top: 17px;
  font-family: bm;
  text-align: right;
  -webkit-font-smoothing: none;

  svg {
    width: 15px;
    height: 7px;
    position: absolute;
    left: 26px;
    top: 3px;
  }
`

const Content = styled(Container)`
  width: 21px;
  height: 11px;
  font-size: 10px;
  line-height: 11px;
`

export function Bitrate({ bitrate }) {
  return (
    <BitrateWrapper>
      <Content>
        { Number.isFinite(bitrate) && Math.floor(bitrate) }
      </Content>
      <BitrateIcon />
    </BitrateWrapper>
  )
}

const SampleRateWrapper = styled(Output)`
  width: 24px;
  position: absolute;
  left: 143px;
  top: 17px;
  font-family: bm;
  text-align: right;
  -webkit-font-smoothing: none;

  svg {
    width: 13px;
    height: 6px;
    position: absolute;
    left: 26px;
    top: 3px;
  }
`

export function Samplerate({ samplerate }) {
  return (
    <SampleRateWrapper>
      <Content>
        { Number.isFinite(samplerate) && Math.floor(samplerate / 1000) }
      </Content>
      <SamplerateIcon />
    </SampleRateWrapper>)
}
