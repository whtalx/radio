import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import Player from './components/Player'
import getStations from './functions/getStations'
import makeEndpoint from './functions/makeEndpoint'

const List = styled.ul`
  padding: 0 0 0 1em;
  list-style-type: none;
`

const Label = styled.li`
  cursor: pointer;

  ${
    props => props.playing 
      ? css`
        background-color: lightslategray;
        color: white;
      `
      : css`
        :hover {
          color: slategray;
        }

        :nth-child(2n) {
          background-color: ghostwhite;
        }
      `
  }
`

// const type = [
//   `byid`,
//   `byuuid`,
//   `byname`,
//   `bynameexact`,
//   `bycodec`,
//   `bycodecexact`,
//   `bycountry`,
//   `bycountryexact`,
//   `bycountrycodeexact`,
//   `bystate`,
//   `bystateexact`,
//   `bylanguage`,
//   `bylanguageexact`,
//   `bytag`,
//   `bytagexact`,
// ]

// const order = [
//   `name`,
//   `url`,
//   `homepage`,
//   `favicon`,
//   `tags`,
//   `country`,
//   `state`,
//   `language`,
//   `votes`,
//   `negativevotes`,
//   `codec`,
//   `bitrate`,
//   `lastcheckok`,
//   `lastchecktime`,
//   `clicktimestamp`,
//   `clickcount`,
//   `clicktrend`,
// ]


export default () => {
  const [current, setCurrent] = useState(null)
  const [stations, setStations] = useState([])
  const [params] = useState({
    countrycode: `GB`,
    limit: 100,
    offset: 200,
    hidebroken: true,
  })

  useEffect(
    () => {
      getStations(makeEndpoint(params), setStations)
    },// eslint-disable-next-line
    [params]
  )
  return (
    <div>
      <Player source={ current } />
      <List>
        {
          stations.map(({ uuid, name, src }) =>
            <Label key={ uuid } playing={ src === current } onClick={ () => setCurrent(src) }>
              { name }
            </Label>
          )
        }
      </List>
    </div>
  )
}
