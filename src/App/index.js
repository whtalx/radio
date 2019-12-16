import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import Player from './components/Player'
import getStations from './functions/getStations'
import makeEndpoint from './functions/makeEndpoint'
import getURL from './functions/getURL'

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

/*
const type = [
  `countries`,
  `countrycodes`,
  `languages`,
  `stations`,
  `servers`,
  `url/${ stationid }`,
  `tags`,
]

const query = [
  `byid`,
  `byuuid`,
  `byname`,
  `bynameexact`,
  `bycodec`,
  `bycodecexact`,
  `bycountry`,
  `bycountryexact`,
  `bycountrycodeexact`,
  `bystate`,
  `bystateexact`,
  `bylanguage`,
  `bylanguageexact`,
  `bytag`,
  `bytagexact`,
]

const order = [
  `name`,
  `url`,
  `homepage`,
  `favicon`,
  `tags`,
  `country`,
  `state`,
  `language`,
  `votes`,
  `negativevotes`,
  `codec`,
  `bitrate`,
  `lastcheckok`,
  `lastchecktime`,
  `clicktimestamp`,
  `clickcount`,
  `clicktrend`,
]
*/

export default () => {

  const [current, setCurrent] = useState(null)
  const [stations, setStations] = useState([])
  const [params] = useState({
    server: `de1.api.radio-browser.info`,
    type: `stations`,
    search: {
      countrycode: `GB`,
      limit: 100,
      offset: 600,
      hidebroken: true,
    },
  })

  // const select = (id) =>
  //   getURL(
  //     makeEndpoint({
  //       server: params.server,
  //       type: `url/${ id }`,
  //     })
  //   ).then(setCurrent)

  useEffect(
    () => {
      getStations(makeEndpoint(params))
        .then(setStations)
        .catch(({ message }) => console.error(message))
    },// eslint-disable-next-line
    [params]
  )

  return (
    <div>
      <Player source={ current } />
      <List>
        {
          stations.map(({ id, stationuuid, name, src }) =>
            <Label key={ stationuuid } playing={ src === current } onClick={ () => current === src ? setCurrent(null) : setCurrent(src) }>
              { name }
            </Label>
          )
        }
      </List>
    </div>
  )
}
