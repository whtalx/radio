import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const Canvas = styled.canvas`
  position: fixed;
  right: 0;
  top: 0;
  width: 50vw;
  height: 25vw;
`

const Player = ({ source, player, changeSource }) => {
  const visualization = useRef(null)

  const visualize = () => {
    const canvas = visualization.current
    const ctx = canvas.getContext(`2d`)
    const { width, height } = canvas

    const drawBar = (x, w, amp) => {
      ctx.strokeStyle =  `hsl(${ 100 - 100 / 255 * amp }, 100%, 50%)`
      ctx.lineWidth = w
      ctx.beginPath()
      ctx.moveTo(x + (w / 2), height)
      ctx.lineTo(x + (w / 2), height - height * amp / 255)
      ctx.stroke()
    }

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    const bufferLength = player.analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    player.analyser.getByteFrequencyData(dataArray)

    for(let i = 0; i < bufferLength; i++){
      const x = i * width / bufferLength
      const amp = dataArray[i]

      drawBar(x, width / bufferLength, amp)
    }

    !player.element.paused && requestAnimationFrame(visualize)
  }

  const play = ({ target }) => {
    console.log(target.currentSrc)
    target.play().catch(() => false)
    // visualize()
  }

  useEffect(
    () => {
      player.element.onloadeddata = play
      player.element.onplaying = visualize
    },// eslint-disable-next-line
    []
  )

  useEffect(
    () => {
      changeSource(source)
      source
        ? player.element.load()
        : player.element.pause()
    },// eslint-disable-next-line
    [source]
  )

  return (
    <Canvas ref={ visualization } />
  )
}

const mapStateToProps = (props) => ({ ...props });
const mapDispatchToProps = (dispatch) => ({
  changeSource: (payload) => dispatch({ type: `CHANGE_SOURCE`, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);