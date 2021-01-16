import React, { useContext } from 'react'

import { State } from '../../../../reducer'

import { Wrapper } from './styled'

export default function Info() {
  const state = useContext(State)
  const { station } = state.player
  const { bitrate, channels, type, favourite, samplerate } = station?.info || {}

  function getOpacity(value) {
    return (typeof value === `number` && !Number.isFinite(value)) || !value
      ? .1
      : undefined
  }

  function getMode(value) {
    if (!value) {
      return null
    } else if (value === 1) {
      return `mono`
    } else if (value === 2) {
      return `stereo`
    } else {
      return `surround`
    }
  }

  return (
    <Wrapper viewBox="0 0 105 18">
      <text x="1" y="6">kbps:</text>
      <g transform="translate(21,0)" opacity={ getOpacity(bitrate) }>
        <mask id="bitrate">
          <rect x="0" y="0" width="22" height="7" />
          <text x="11" y="6" textAnchor="middle" fill="black">
            { bitrate }
          </text>
        </mask>
        <rect x="0" y="0" width="22" height="7" rx="1" mask="url(#bitrate)" />
      </g>
      <text x="47" y="6">~khz:</text>
      <g transform="translate(67,0)" opacity={ getOpacity(samplerate) }>
        <mask id="samplerate">
          <rect x="0" y="0" width="22" height="7" />
          <text x="11" y="6" textAnchor="middle" fill="black">
            { samplerate && `${ (samplerate / 1000).toFixed(1) }` }
          </text>
        </mask>
        <rect x="0" y="0" width="22" height="7" rx="1" mask="url(#samplerate)" />
      </g>
      <g transform="translate(94,0)" opacity={ getOpacity(favourite) }>
        <path d="M0.5 3C0.5 4 3 6 4.5 7C6 6 8.5 4 8.5 3C9 -0 5.5 -0 4.5 1.5C3.5 -0 0 0 0.5 3Z" />
      </g>
      <text x="0" y="17">mode:</text>
      <g transform="translate(21, 11)" opacity={ getOpacity(channels) }>
        <mask id="mode">
          <rect x="0" y="0" width="36" height="7" />
          <text x="18" y="6" textAnchor="middle" fill="black">
            { getMode(channels) }
          </text>
        </mask>
        <rect x="0" y="0" width="36" height="7" rx="1" mask="url(#mode)" />
      </g>
      <text x="59" y="17">type:</text>
      <g transform="translate(79, 11)" opacity={ getOpacity(type) }>
        <mask id="type">
          <rect x="0" y="0" width="26" height="7" />
          <text x="13" y="6" textAnchor="middle" fill="black">
            { type }
          </text>
        </mask>
        <rect x="0" y="0" width="26" height="7" rx="1" mask="url(#type)" />
      </g>
    </Wrapper>
  )
}
