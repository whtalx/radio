import React, { useRef, useState } from 'react'
import { v4 } from 'uuid'

import Scrollbar from '../Scrollbar'
import { Container, UL, Wrapper } from './styled'

function getRandomContent() {
  return [
    [...Array(Math.floor(Math.random() * 100))].map(() => v4()),
    [...Array(Math.floor(Math.random() * 100))].map(() => v4()),
    [...Array(Math.floor(Math.random() * 100))].map(() => v4()),
  ]
}

export default function List({ activeTab }: { activeTab: number }) {
  const [content, setContent] = useState(getRandomContent())
  const items = content[activeTab]
  const container = useRef(null)
  const name = v4()

  function reset() {
    setContent(getRandomContent())
  }

  return (
    <Wrapper>
      <Container ref={container}>
        <UL>
          {
            items.map((item, index) => {
              const key = String(index)
              return (
                <li key={key} onDoubleClick={reset}>
                  <input hidden id={key} type="radio" name={name} />
                  <label htmlFor={key} title={item}>
                    {item}
                  </label>
                </li>
              )
            })
          }
        </UL>
      </Container>
      <Scrollbar container={container} length={items.length} />
    </Wrapper>
  )
}
