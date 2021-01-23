import React, { useContext, useState } from 'react'

import { StateContext, DispatchContext } from '../../store'
import Localise from '../../i18n'

import Tab from './Tab'
import List from './List'
import Settings from './Settings'
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

export default function Drawer() {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const localise = useContext(Localise)
  const [activeTab, setActiveTab] = useState(0)
  const { drawer } = state.window
  const tabs = [
    localise(`stations`),
    localise(`settings`),
    localise(`themes`),
  ]

  function toggle() {
    dispatch({ type: `setDrawer`, payload: !drawer })
  }

  function renderTab(item: string, index: number) {
    const active = activeTab === index

    function onClick() {
      setActiveTab(index)
    }

    return (
      <Tab
        key={item}
        children={item}
        active={active}
        onClick={onClick}
      />
    )
  }

  return (
    <Wrapper data-opened={drawer}>
      <Image src={topLeft} />
      <Image src={topCenter} />
      <Image src={topRight} />
      <Image src={middleLeft} />
      <Image src={middleCenter} />
      <Image src={middleRight} />
      <Image src={bottomLeft} />
      <Tabs>
        {tabs.map(renderTab)}
        <Space src={bottomCenter} relative />
      </Tabs>
      <div>
        <Image src={bottomRight} />
        <Toggle onClick={toggle} />
      </div>
      <Content>
        {
          activeTab === 1
            ? <Settings />
            : <List activeTab={activeTab} />
        }
      </Content>
    </Wrapper>
  )
}