import React, { useEffect, useRef, useState } from 'react'

import { Bar, Bottom, Top, Wrapper } from './styled'
import Thumb from './Thumb'

export default function Scrollbar({ container, length }) {
  const [heightRatio, setHeightRatio] = useState(1)
  const [scrollRatio, setScrollRatio] = useState(0)
  const bar = useRef(null)
  const hidden = heightRatio === 1

  function setScrollTop(props) {
    container.current.scrollTo(props)
  }

  function startScrolling(mouseDownEvent) {
    const { current: { scrollHeight: barHeight } } = bar
    const { current: { scrollTop: scrollStart, clientHeight, scrollHeight } } = container
    const cursorStart = mouseDownEvent.pageY
    let animationId = NaN

    function scroll(mouseMoveEvent) {
      const { current: { scrollTop } } = container
      const top = scrollStart - (cursorStart - mouseMoveEvent.pageY) / barHeight * scrollHeight
      const min = 0
      const max = scrollHeight - clientHeight

      if ((top < min && scrollTop === min) || (top > max && scrollTop === max)) return

      animationId && cancelAnimationFrame(animationId)
      animationId = requestAnimationFrame(() => setScrollTop({ top }))
    }

    function stopScrolling() {
      document.removeEventListener(`mousemove`, scroll)
    }

    document.addEventListener(`mousemove`, scroll)
    document.addEventListener(`mouseup`, stopScrolling, { once: true })
  }

  function scrollToPosition(clickEvent) {
    if (hidden || clickEvent.target !== bar.current) return

    const { current: { scrollHeight } } = container
    const rect = bar.current.getBoundingClientRect()
    const top = ((clickEvent.pageY - rect.top) / rect.height - heightRatio / 2) * scrollHeight
    setScrollTop({ top, behavior: `smooth` })
  }

  function scrollDelta(props) {
    const { current: { scrollTop, clientHeight, scrollHeight } } = container
    const max = scrollHeight - clientHeight
    const min = 0
    const top = scrollTop + props.top

    if (!(scrollTop === min && top < min) && !(scrollTop === max && top > max)) {
      setScrollTop({ ...props, top })
    }
  }

  function scrollUp() {
    scrollDelta({ top: -container.current.clientHeight, behavior: `smooth` })
  }

  function scrollDown() {
    scrollDelta({ top: container.current.clientHeight, behavior: `smooth` })
  }

  function onWheel(event) {
    scrollDelta({ top: event.deltaY })
  }

  function getStyle() {
    const { clientHeight } = bar.current
    const tooSmallRatio = heightRatio < .3
    const height = tooSmallRatio ? 30 : heightRatio * clientHeight
    return {
      height: `${ height }px`,
      transform: `translateY(${ scrollRatio * (clientHeight - height) }px)`,
    }
  }

  function calcHeightRatio(target) {
    const { clientHeight, scrollHeight } = target
    setHeightRatio(clientHeight / scrollHeight)
  }

  function calcScrollRatio(target) {
    const { clientHeight, scrollHeight, scrollTop } = target
    setScrollRatio(scrollTop / (scrollHeight - clientHeight))
  }

  useEffect(
    () => {
      function onScroll(event) {
        const { target } = event
        calcScrollRatio(target)
      }

      function onResize(props) {
        const { target } = props[0]
        calcHeightRatio(target)
      }

      const { current: target } = container
      const observer = new ResizeObserver(onResize)
      target.addEventListener(`scroll`, onScroll)
      calcScrollRatio(target)
      calcHeightRatio(target)
      observer.observe(target)

      return () => {
        observer.unobserve(target)
        target.removeEventListener(`scroll`, onScroll)
      }
    },
    [container, length]
  )

  return (
    <Wrapper onWheel={ onWheel } hidden={ hidden }>
      <Top onClick={ scrollUp } />
      <Bar ref={ bar } onClick={ scrollToPosition }>
        {
          bar.current && heightRatio < 1 && (
            <Thumb style={ getStyle() } onMouseDown={ startScrolling } />
          )
        }
      </Bar>
      <Bottom onClick={ scrollDown } />
    </Wrapper>
  )
}
