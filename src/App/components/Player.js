import React, { useEffect, useRef } from 'react'

const play = ({ target }) => {
  target.play().catch(() => false);
}

export default ({ source }) => {
  if (!source) return null;

  const player = useRef(null)

  useEffect(
    () => {
      player.current.load();
    },
    [source]
  )

  return (
      <video ref={ player } onLoadedData={ play } hidden>
        <source src={ source } />
      </video>
  )
}
