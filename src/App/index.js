import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import Player from './components/Player'
import request from './functions/request'
import getStations from './functions/getStations'
import makeEndpoint from './functions/makeEndpoint'
import { v4 } from 'uuid'
import Flag from './components/Flag'
import countries from './functions/iso3166-1-alpha-2'
// import getURL from './functions/getURL'

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

const App = ({
  api,
  query,
  setType,
}) => {
  const [current, setCurrent] = useState(null)
  const [lastType, setLastType] = useState(null)
  const [stations, setStations] = useState([])
  const [list, setList] = useState([
    {
      id: v4(),
      name: `by countries`,
      onClick: () => {
        setLastType(`countrycodes`)
        setType(`countrycodes`)
      }
    },
    {
      id: v4(),
      name: `by languages`,
      onClick: () => {
        setLastType(`languages`)
        setType(`languages`)
      }
    },
    {
      id: v4(),
      name: `by tags`,
      onClick: () => {
        setLastType(`tags`)
        setType(`tags`)
      }
    },
  ])

  // const select = (id) =>
  //   getURL(
  //     makeEndpoint({
  //       server: params.server,
  //       type: `url/${ id }`,
  //     })
  //   ).then(setCurrent)

  useEffect(
    () => {
      if (api.type === `stations`) {
        getStations(makeEndpoint(api))
          .then(setStations)
          .catch(({ message }) => console.error(message))
        return
      }

      if (api.type === `countrycodes` || api.type === `languages` || api.type === `tags`) {
        request(makeEndpoint(api))
          .then((data) => {
            setList(
              data.map(item => ({
                ...item,
                onClick: () => query({
                  type: `stations`,
                  search: {
                    countrycode: lastType === `countrycodes` ? item.name : undefined,
                    language: lastType === `languages` ? item.name : undefined,
                    languageExact: lastType === `languages` ? true : undefined,
                    tag: lastType === `tags` ? item.name : undefined,
                    tagExact: lastType === `tags` ? true : undefined,
                    hidebroken: true,
                  },
                })
              }))
            )
          })
          .catch(({ message }) => console.error(message))
      }
    },// eslint-disable-next-line
    [api.type]
  )

  return (
    <div>
      <Player source={ current } />
      <List>
        {
          stations.length > 0
            ? stations.map(({ stationuuid, name, src }) =>
              <Label key={ stationuuid } playing={ src === current } onClick={ () => current === src ? setCurrent(null) : setCurrent(src) }>
                { name }
              </Label>
            )
            : list.map(({ id, name, onClick }) =>
              <Label key={ id } onClick={ onClick }>
                {
                  lastType === `countrycodes`
                  ? <p key={ v4() } title={ countries(name).orig }>
                    <Flag code={ countries(name).flag ? countries(name).flag : name } />
                    { countries(name).name }
                  </p>
                  : name
                }
              </Label>
            )
        }
      </List>
    </div>
  )
}

const mapStateToProps = (props) => ({ ...props });
const mapDispatchToProps = (dispatch) => ({
  setType: (payload) => dispatch({ type: `SET_TYPE`, payload }),
  query: (payload) => dispatch({ type: `SET_ALL`, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App)
