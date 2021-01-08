import React, { useState } from 'react'
import { v4 } from 'uuid'

import Tab from './Tab'
import List from './List'
import { Content, Image, Space, Tabs, Toggle, Wrapper } from './styled'

import topLeft from './images/top-left.png'
import topCenter from './images/top-center.png'
import topRight from './images/top-right.png'
import middleLeft from './images/middle-left.png'
import middleCenter from './images/middle-center.png'
import middleRight from './images/middle-right.png'
import bottomLeft from './images/bottom-left.png'
import bottomCenter from './images/bottom-center.png'
import bottomRight from './images/bottom-right.png'

export default function Drawer({ opened, toggle }) {
  const tabs = [`станции`, `настройки`, `темы`]
  const [activeTab, setActiveTab] = useState(tabs[0])
  const items = [...Array(Math.floor(Math.random() * 100))].map(() => v4())

  return (
    <Wrapper data-opened={ opened }>
      <Image src={ topLeft } />
      <Image src={ topCenter } />
      <Image src={ topRight } />
      <Image src={ middleLeft } />
      <Image src={ middleCenter } />
      <Image src={ middleRight } />
      <Image src={ bottomLeft } />
      <Tabs>
        {
          tabs.map((item) =>
            <Tab
              key={ v4() }
              children={ item }
              active={ activeTab === item }
              onClick={ () => setActiveTab(item) }
            />
          )
        }
        <Space src={ bottomCenter } relative />
      </Tabs>
      <div>
        <Image src={ bottomRight } />
        <Toggle onClick={ toggle } />
      </div>
      <Content>
        <List items={ items } />
      </Content>
    </Wrapper>
  )
}
