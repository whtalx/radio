import React, { useEffect, useRef, useState } from 'react'

import { Knob, Progress, Wrapper } from './styled'

import { limit, linearRamp } from '../../../functions'

export default function Range({ type, value, setValue, onSetExact, onDragStart, onDragStop, ...rest }) {
  const isVertical = type === `vertical`
  const [range, setRange] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const progress = useRef(null)
  const wrapper = useRef(null)
  const knob = useRef(null)
  const adaptedProgress = `${ value * range }px`
  const progressStyle = { width: adaptedProgress }
  const knobStyle = { transform: `translateX(${ adaptedProgress })` }

  function setExactValue(clickEvent) {
    if (
      isDragging || (
        clickEvent.target !== wrapper.current &&
        clickEvent.target !== progress.current
      )
    ) return

    onSetExact instanceof Function && onSetExact(clickEvent)
    const { pageX, pageY } = clickEvent
    const { top, left } = wrapper.current.getBoundingClientRect()
    const oldValue = value
    const newValue = limit(isVertical ? 1 - (pageY - top - 10) / range : (pageX - left - 10) / range)
    const increasing = oldValue < newValue
    const difference = Math.abs(oldValue - newValue)

    function callback(linearValue) {
      setValue(
        increasing
          ? oldValue + difference * linearValue
          : oldValue - difference * linearValue
      )
    }

    linearRamp(callback, difference * 300)
  }

  function startDragging(mouseDownEvent) {
    onDragStart instanceof Function && onDragStart(mouseDownEvent)
    setIsDragging(true)
    let animationId = NaN
    const oldValue = value
    const startCoordinate = getCoordinate(mouseDownEvent)

    function getCoordinate(event) {
      return isVertical ? event.pageY : event.pageX
    }

    function drag(mouseMoveEvent) {
      const currentCoordinate = getCoordinate(mouseMoveEvent)
      const difference = (currentCoordinate - startCoordinate) / range
      const newValue = isVertical ? oldValue - difference : oldValue + difference
      animationId && cancelAnimationFrame(animationId)
      animationId = requestAnimationFrame(() => setValue(limit(newValue)))
    }

    function stopDragging(mouseUpEvent) {
      onDragStop instanceof Function && onDragStop(mouseUpEvent)
      document.removeEventListener(`mousemove`, drag)
      setTimeout(() => setIsDragging(false), 100)
    }

    document.addEventListener(`mousemove`, drag)
    document.addEventListener(`mouseup`, stopDragging, { once: true })
  }

  function scroll(mouseWheelEvent) {
    onSetExact instanceof Function && onSetExact(mouseWheelEvent)
    const { deltaY: delta } = mouseWheelEvent
    const difference = limit(.25 * delta / range, -1)
    const newValue = value + difference
    setValue(limit(newValue))
  }

  useEffect(
    () => {
      if (!wrapper.current) return

      const { width, height } = wrapper.current.getBoundingClientRect()
      setRange((isVertical ? height : width) - 20)
    },
    [isVertical, wrapper]
  )

  return (
    <Wrapper
      { ...rest }
      ref={ wrapper }
      layout={ type }
      onWheel={ scroll }
      onClick={ setExactValue }
    >
      <Progress ref={ progress } style={ progressStyle } />
      <Knob ref={ knob } style={ knobStyle } onMouseDown={ startDragging } />
    </Wrapper>
  )
}
