import React from 'react'
import { Background } from './styled'

export default ({ children }) =>
  <Background width="92" height="41" viewBox="0 0 92 41" fill="none" fillRule="evenodd">
    <defs>
      <pattern id="dot" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
        <rect x="1" y="1" width="1" height="1" fill="#181829" />
      </pattern>
    </defs>
    <g>
      <rect width="92" height="41" fill="#000" />
      <rect width="92" height="41" fill="url(#dot)" />
      <path d="M11.5 19 V37.5 H88" stroke="#005284" strokeWidth="1" strokeDasharray="1 3" />
      <path d="M11.5 21 V37.5 H88" stroke="#639CF7" strokeWidth="1" strokeDasharray="1 3" />
    </g>
    { children }
  </Background>
