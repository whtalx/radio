import React from 'react'

import { PrimaryImage, SecondaryImage, Wrapper } from './styled'

import primaryLeft from './images/primary-left.png'
import primaryCenter from './images/primary-center.png'
import primaryRight from './images/primary-right.png'
import secondaryLeft from './images/secondary-left.png'
import secondaryCenter from './images/secondary-center.png'
import secondaryRight from './images/secondary-right.png'
import secondaryRightResizable from './images/secondary-right-resizable.png'

export default function Main({ resizable, children }) {
  return (
    <Wrapper>
      <div>
        <PrimaryImage src={ primaryLeft } />
        <SecondaryImage src={ secondaryLeft } />
      </div>
      <div>
        <PrimaryImage src={ primaryCenter } />
        <SecondaryImage src={ secondaryCenter } />
      </div>
      <div>
        <PrimaryImage src={ primaryRight } />
        <SecondaryImage src={ resizable ? secondaryRightResizable : secondaryRight } />
      </div>
      { children }
    </Wrapper>
  )
}
