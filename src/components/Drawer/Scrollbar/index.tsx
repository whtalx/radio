import React, { useEffect, useRef, useState } from 'react'

import { Bar, Bottom, Top, Wrapper } from './styled'
import Thumb from './Thumb'

interface Props {
  container: React.RefObject<HTMLDivElement>
  length: number
}

export default function Scrollbar({ container, length }: Props) {
  const [heightRatio, setHeightRatio] = useState(1)
  const [scrollRatio, setScrollRatio] = useState(0)
  const bar = useRef<HTMLDivElement>(null)
  const hidden = heightRatio === 1

  function setScrollTop(props: { top: number, behavior?: `smooth` }) {
    container.current!.scrollTo(props)
  }

  function startScrolling(mouseDownEvent: React.WheelEvent) {
    const { scrollHeight: barHeight } = bar.current!
    const { scrollTop: scrollStart, clientHeight, scrollHeight } = container.current!
    const cursorStart = mouseDownEvent.pageY
    let animationId = NaN

    function scroll(mouseMoveEvent: MouseEvent) {
      const { scrollTop } = container.current!
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

  function scrollToPosition(clickEvent: React.MouseEvent) {
    if (hidden || clickEvent.target !== bar.current) return

    const { scrollHeight } = container.current!
    const rect = bar.current.getBoundingClientRect()
    const top = ((clickEvent.pageY - rect.top) / rect.height - heightRatio / 2) * scrollHeight
    setScrollTop({ top, behavior: `smooth` })
  }

  function scrollDelta(props: { top: number, behavior?: `smooth` }) {
    const { scrollTop, clientHeight, scrollHeight } = container.current!
    const max = scrollHeight - clientHeight
    const min = 0
    const top = scrollTop + props.top

    if (!(scrollTop === min && top < min) && !(scrollTop === max && top > max)) {
      setScrollTop({ ...props, top })
    }
  }

  function scrollUp() {
    scrollDelta({ top: -container.current!.clientHeight, behavior: `smooth` })
  }

  function scrollDown() {
    scrollDelta({ top: container.current!.clientHeight, behavior: `smooth` })
  }

  function onWheel(event: React.WheelEvent) {
    scrollDelta({ top: event.deltaY })
  }

  function getStyle() {
    const { clientHeight = 0 } = bar.current || {}
    const tooSmallRatio = heightRatio < .3
    const height = tooSmallRatio ? 30 : heightRatio * clientHeight
    return {
      height: `${ height }px`,
      transform: `translateY(${ scrollRatio * (clientHeight - height) }px)`,
    }
  }

  function calcHeightRatio(target: HTMLDivElement) {
    const { clientHeight, scrollHeight } = target
    setHeightRatio(clientHeight / scrollHeight)
  }

  function calcScrollRatio(target: HTMLDivElement) {
    const { clientHeight, scrollHeight, scrollTop } = target
    setScrollRatio(scrollTop / (scrollHeight - clientHeight))
  }

  useEffect(
    () => {
      function onScroll(event: Event) {
        const target = event.target as HTMLDivElement
        calcScrollRatio(target)
      }

      function onResize(entries: ResizeObserverEntry[]) {
        const target = entries[0].target as HTMLDivElement
        calcHeightRatio(target)
      }

      const { current: target } = container

      if (!target) return

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
    <Wrapper onWheel={onWheel} hidden={hidden}>
      <Top onClick={scrollUp} />
      <Bar ref={bar} onClick={scrollToPosition}>
        {
          bar.current && heightRatio < 1 && (
            <Thumb style={getStyle()} onMouseDown={startScrolling} />
          )
        }
      </Bar>
      <Bottom onClick={scrollDown} />
    </Wrapper>
  )
}
