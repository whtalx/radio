import React, { useRef } from 'react'
import { v4 } from 'uuid'

import Scrollbar from '../Scrollbar'
import { Container, UL, Wrapper } from './styled'

const content = [
  [...Array(Math.floor(Math.random() * 100))].map(() => v4()),
  [...Array(Math.floor(Math.random() * 100))].map(() => v4()),
  [...Array(Math.floor(Math.random() * 100))].map(() => v4()),
]

export default function List({ activeTab }) {
  const container = useRef(null)
  const name = v4()
  const items = content[activeTab]

  return (
    <Wrapper>
      <Container ref={ container }>
        <UL>
          {
            items.map((item, index) => {
              const key = index
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