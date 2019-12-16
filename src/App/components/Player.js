import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const Canvas = styled.canvas`
  position: fixed;
  right: 0;
  top: 0;
  width: calc(.5vw * 79);
  height: calc(.5vw * 19);
`

const bands = [2,3,4,5,6,7,10,15,21,30,42,60,84,116,167,237,334,464,696]

const Player = ({ source, player, changeSource }) => {
  const visualization = useRef(null)

  const visualize = () => {
    const canvas = visualization.current
    const ctx = canvas.getContext(`2d`)
    const { width, height } = canvas
    const gradient = ctx.createLinearGradient(0, 0, 0, height / 19 * 16)

    gradient.addColorStop(0, `hsl(0, 100%, 50%)`)
    gradient.addColorStop(.25, `hsl(30, 100%, 50%)`)
    gradient.addColorStop(.5, `hsl(60, 100%, 50%)`)
    gradient.addColorStop(.75, `hsl(90, 100%, 50%)`)
    gradient.addColorStop(1, `hsl(120, 100%, 50%)`)

    const clear = () => {
      ctx.fillStyle = `hsl(0, 0%, 0%)`
      ctx.fillRect(0, 0, width, height);

      [...Array(19).keys()].forEach((y) => {
        [...Array(79).keys()].forEach((x) => {
          if (x % 2 === 0 && y % 2 === 0) {
            ctx.fillStyle = x === 0
              ? y % 4 === 0
                ? `hsl(216, 60%, 81%)`
                : `hsl(205, 100%, 71%)`
              : y === 18
                ? x % 4 === 0
                  ? `hsl(216, 60%, 81%)`
                  : `hsl(205, 100%, 71%)`
                : `hsl(240, 41%, 16%)`

            ctx.fillRect(x * width / 79, y * height / 19, width / 79, height / 19)
          }
        })
      })
    }

    const drawBar = (x, w, amp) => {
      ctx.strokeStyle = gradient//`hsl(${ 100 - 100 / 16 * amp }, 100%, 50%)`
      ctx.lineWidth = w
      ctx.beginPath()
      ctx.moveTo(x + (width / 39.5), height - height / 19 * 2)
      ctx.lineTo(x + (width / 39.5), height / 19 * (16 - amp))
      ctx.stroke()
    }

    const bufferLength = player.analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    player.analyser.getByteFrequencyData(dataArray)

    clear()

    bands.forEach((band, i) => {
      const x = i === 0
        ? 2 * width / 79
        : (((i - 1) * 4) + 6) * width / 79
      const amp = Math.floor(16 / 255 * dataArray[band])

      drawBar(x, width / 79 * 3, amp)
    })

    player.element.paused 
      ? clear()
      : requestAnimationFrame(visualize)
  }

  const play = ({ target }) => {
    target.play().catch(() => false)
    // visualize()
  }

  useEffect(
    () => {
      player.element.onloadeddata = play
      player.element.onloadedmetadata = ({ target: { currentSrc } }) => console.log(currentSrc)
      player.element.onplaying = visualize
      player.element.onerror = ({ message }) => console.warn(message)
      player.element.onstalled = changeSource()
      player.element.onsuspend = ({ target: { readyState } }) => {
        if (readyState !== 0) return

        if (/\/source+$/.test(player.element.currentSrc)) {
          changeSource()
          return
        }

        changeSource(`${ player.element.currentSrc.replace(/[/]+$/g, ``) }/stream`)
        player.element.load()
      }
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