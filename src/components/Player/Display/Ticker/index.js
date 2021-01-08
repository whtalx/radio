import React, { useEffect, useRef, useState } from 'react'

import { Status, Title, Wrapper } from './styled'

export default function Ticker({ title, status }) {
  const timeoutId = useRef(NaN)
  const container = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [direction, setDirection] = useState(1)

  function tick({ target, left }) {
    return function scroll() {
      target.scrollTo({ left })
    }
  }

  function startScrolling(timeout) {
    clearAnimations()

    if (!container.current) return

    const { current: target } = container
    setDirectionAndScroll(target, timeout)
  }

  function onScroll({ target }) {
    if (isDragging) return

    clearAnimations()
    setDirectionAndScroll(target)
  }

  function startDragging(mouseDownEvent) {
    setIsDragging(true)
    const { current: target } = container
    const { clientWidth, scrollWidth, scrollLeft: startScroll } = target
    const startCoordinate = mouseDownEvent.pageX

    if (clientWidth === scrollWidth) return

    function drag(mouseMoveEvent) {
      const currentCoordinate = mouseMoveEvent.pageX
      const difference = currentCoordinate - startCoordinate
      const left = startScroll - difference
      target.scrollTo({ left })

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

  function setDirectionAndScroll(target, timeout = 0) {
    const { clientWidth, scrollWidth, scrollLeft } = target

    if (clientWidth === scrollWidth) return

    let newDirection = direction
    const newLeft = scrollLeft + direction

    if (newLeft >= scrollWidth - clientWidth && direction > 0) {
      newDirection = -1
      setDirection(newDirection)
      const left = scrollLeft + newDirection
      timeoutId.current = setTimeout(tick({ target, left }), timeout || 1000)
    } else if (newLeft <= 0 && direction < 0) {
      newDirection = 1
      setDirection(newDirection)
      const left = scrollLeft + newDirection
      timeoutId.current = setTimeout(tick({ target, left }), timeout || 2000)
    } else {
      const left = scrollLeft + newDirection
      timeoutId.current = setTimeout(tick({ target, left }), timeout || 33.33)
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
    [container, status, title]
  )

  return (
    <Wrapper ref={ container } onScroll={ onScroll } onMouseDown={ startDragging }>
      {
        status
          ? <Status>{ status }</Status>
          : <Title>{ title }</Title>
      }
    </Wrapper>
  )
}
