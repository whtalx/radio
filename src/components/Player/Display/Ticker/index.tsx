import React, { useContext, useEffect, useRef, useState } from 'react'

import { StateContext } from '../../../../store'

import { Status, Title, Wrapper } from './styled'

export default function Ticker({ status }: { status?: string }) {
  const state = useContext(StateContext)
  const timeoutId = useRef(NaN)
  const container = useRef<HTMLDivElement>(null)
  const [direction, setDirection] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const { station } = state.player
  const title = station?.title || `\u200a`

  function tick({ target, left }: { target: HTMLDivElement, left: number }) {
    return function scroll() {
      target.scrollTo({ left })
    }
  }

  function startScrolling(timeout: number) {
    clearAnimations()
    container?.current && setDirectionAndScroll(container.current, timeout)
  }

  function onScroll(event: React.MouseEvent<HTMLDivElement>) {
    if (isDragging) return

    const target = event.target as HTMLDivElement

    clearAnimations()
    setDirectionAndScroll(target)
  }

  function startDragging(mouseDownEvent: React.MouseEvent<HTMLDivElement>) {
    const target = container?.current

    if (!target) return

    setIsDragging(true)
    const { clientWidth, scrollWidth, scrollLeft: startScroll } = target
    const startCoordinate = mouseDownEvent.pageX

    if (clientWidth === scrollWidth) return

    function drag(mouseMoveEvent: MouseEvent) {
      const currentCoordinate = mouseMoveEvent.pageX
      const difference = currentCoordinate - startCoordinate
      const left = startScroll - difference
      target && target.scrollTo({ left })

    }

    function stopDragging() {
      document.removeEventListener(`mousemove`, drag)
      setTimeout(continueScrolling, 100)
    }

    function continueScrolling() {
      setIsDragging(false)
      startScrolling(100)
    }

    clearAnimations()
    document.addEventListener(`mousemove`, drag)
    document.addEventListener(`mouseup`, stopDragging, { once: true })
  }

  function setDirectionAndScroll(target: HTMLDivElement, timeout: number = 0) {
    const { clientWidth, scrollWidth, scrollLeft } = target

    if (clientWidth === scrollWidth) return

    let newDirection = direction
    const newLeft = scrollLeft + direction

    if (newLeft >= scrollWidth - clientWidth && direction > 0) {
      newDirection = -1
      setDirection(newDirection)
      const left = scrollLeft + newDirection
      timeoutId.current = window.setTimeout(tick({ target, left }), timeout || 1000)
    } else if (newLeft <= 0 && direction < 0) {
      newDirection = 1
      setDirection(newDirection)
      const left = scrollLeft + newDirection
      timeoutId.current = window.setTimeout(tick({ target, left }), timeout || 2000)
    } else {
      const left = scrollLeft + newDirection
      timeoutId.current = window.setTimeout(tick({ target, left }), timeout || 33.33)
    }
  }

  function clearAnimations() {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
      timeoutId.current = NaN
    }
  }

  useEffect(
    () => {
      startScrolling(1500)
    },
    [container, status, title] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <Wrapper ref={container} onScroll={onScroll} onMouseDown={startDragging}>
      {
        status
          ? <Status>{status}</Status>
          : <Title>{title}</Title>
      }
    </Wrapper>
  )
}
