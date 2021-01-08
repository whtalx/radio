import React, { useRef } from 'react'
import { v4 } from 'uuid'

import Scrollbar from '../Scrollbar'
import { Container, UL, Wrapper } from './styled'

export default function List({ items }) {
  const container = useRef(null)
  const name = v4()

  return (
    <Wrapper>
      <Container ref={ container }>
        <UL>
          {
            items.map((item) => {
              const key = v4()
              return (
                <li key={ key }>
                  <input hidden id={ key } type="radio" name={ name } />
                  <label htmlFor={ key } title={ item }>
                    { item }
                  </label>
                </li>
              )
            })
          }
        </UL>
      </Container>
      <Scrollbar container={ container } length={ items.length } />
    </Wrapper>
  )
}