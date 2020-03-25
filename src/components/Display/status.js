import React from 'react'
import { connect } from 'react-redux'
import { Group } from './styled'

const Status = ({ state }) =>
  <Group fill="#00D500" className={ state }>
    <rect id="loading" x="13" y="11" width="3" height="3" fill="#4E0F00" />
    <rect id="loaded" x="13" y="5" width="3" height="3" />
    <path id="playing" d="M19 14V5H20V6H21V7H22V8H23V9H24V10H23V11H22V12H21V13H20V14H19Z" />
    <rect id="paused" x="17" y="7" width="5" height="5" />
  </Group>

const mapState = ({ player }) => ({ state: player.currentState })

export default connect(mapState)(Status)
