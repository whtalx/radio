import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { remote, ipcRenderer } from 'electron'
import styled, { css, keyframes } from 'styled-components'
// import Flag from './Flag'
import Header from './Header'
import sniff from '../functions/sniff'
import error from '../functions/error'
import request from '../functions/request'
import getTags from '../functions/getTags'
import getStations from '../functions/getStations'
import getLanguages from '../functions/getLanguages'
import countries from '../functions/iso3166-1-alpha-2'
import getCountryCodes from '../functions/getCountryCodes'

const barSpin = keyframes`
  0% { content: '\\005C' }
  33% { content: '\\2013' }
  66% { content: '\\002F' }
  to { content: '\\007C' }
`

const Ul = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`

const Li = styled.li`
  cursor: pointer;
  position: relative;
  padding-left: 1em;

  ${
    props => props.active
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

  ${
    props => props.playing && css`
      :before {
        content: '\\25B8';
        position: absolute;
        top: 0;
        left: -.1em;
        font-size: 1.8em;
        line-height: .66;
      }
    `
  }

  ${
    props => props.processing && props.active && css`
      :after {
        content: '\\005C';
        position: absolute;
        top: 0;
        right: 0;
        width: 1em;
        text-align: center;
        animation: ${ barSpin } .5s linear infinite;
      }
    `
  }
`

const List = ({
  api,
  list,
  setTags,
  dispatch,
  setStation,
  setStations,
  setLanguages,
  setCountryCodes,
}) => {
  const [current, setCurrent] = useState({})
  const [controller, setController] = useState(null)
  const [playing, setPlaying] = useState({})
  const [player] = useState(remote.getGlobal(`player`))
  const [key, setKey] = useState(null)

  const tune = (station, play = false) => {
    setCurrent(station)
    play && player.webContents.send(`station`, station)
  }

  const snoop = () => {
    setController(new AbortController())
    console.log(`creating controller`)
  }

  useEffect(
    () => {
      ipcRenderer.on(`playing`, (event, station) => {
        setPlaying(station)
        console.log(`playing: `, station.name)
      })

      ipcRenderer.on(`paused`, () => {
        setPlaying({})
        console.log(`paused`)
      })

      ipcRenderer.on(`loading`, (event, station) => {
        setPlaying({})
        console.log(`loading: `, station.name)
      })

      ipcRenderer.on(`key`, (event, key) => {
        setKey(key)
      })
    }, // eslint-disable-next-line
    []
  )

  useEffect(
    () => {
      switch (api.type) {
        case `stations`: {
          request(api).then(data => setStations(getStations(data)))
          return
        }

        case `countrycodes`: {
          request(api).then(data => setCountryCodes(getCountryCodes(data)))
          return
        }

        case `languages`: {
          request(api).then(data => setLanguages(getLanguages(data)))
          return
        }

        case `tags`: {
          request(api).then(data => setTags(getTags(data)))
          return
        }

        default:
          return
      }
    },// eslint-disable-next-line
    [api.type]
  )

  useEffect(
    () => {
      if (!key) return

      if (
        key === `Enter` &&
        !controller &&
        current.src &&
        !current.src_resolved &&
        current.id !== playing.id
      ) {
        snoop()
      }

      setKey(null)
    }, // eslint-disable-next-line
    [key]
  )

  useEffect(
    () => {
      if (!controller) return

      const signal = controller.signal
      signal.addEventListener(`abort`, () => {
        console.log(`destroying controller`)
        setController(null)
      })

      sniff({
        url: current.src,
        signal,
      })
        .then(({ src_resolved }) => {
          controller.abort()
          if (src_resolved) {
            const station = { ...current, src_resolved }
            setStation(station)
            tune(station, true)
          } else {
            tune({}, true)
          }
        })
        .catch((e) => {
          controller.abort()
          error(e)
        })
    }, // eslint-disable-next-line
    [controller]
  )

  return (
    <div>
      <Header />
      <Ul>
        {
          list.show && list[list.show].map((listItem) => {
            switch (list.show) {
              case `countrycodes`: {
                const country = countries(listItem.name)
                return (
                  <Li
                    key={ listItem.name }
                    title={ country.orig }
                    onClick={ () => dispatch(listItem.action) }
                  >
                    {/*<Flag code={ country.flag ? country.flag : listItem.name }/>*/}
                    { `\t${ country.name }` }
                  </Li>
                )
              }

              case `stations`:
                return (
                  <Li
                    key={ listItem.id }
                    active={ current.id === listItem.id }
                    playing={ playing.id === listItem.id }
                    processing={ controller !== null }
                    onClick={ () => current.id !== listItem.id && tune(listItem) }
                    onDoubleClick={
                      () => {
                        if (listItem.src_resolved) {
                          tune(listItem, true)
                        } else if (current.id !== playing.id) {
                          snoop()
                        }
                      }
                    }
                  >
                    { listItem.name }
                  </Li>
                )

              default:
                return (
                  <Li key={ listItem.name } onClick={ () => dispatch(listItem.action) }>
                    { listItem.name }
                  </Li>
                )
            }
          })
        }
      </Ul>
    </div>
  )
}

const mapStateToProps = ({ api, list }) => ({ api, list })
const mapDispatchToProps = (dispatch) => ({
  setTags: payload => dispatch({ type: `SET_TAGS`, payload }),
  dispatch: action => dispatch(action),
  setStation: payload => dispatch({ type: `SET_STATION`, payload }),
  setStations: payload => dispatch({ type: `SET_STATIONS`, payload }),
  setLanguages: payload => dispatch({ type: `SET_LANGUAGES`, payload }),
  setCountryCodes: payload => dispatch({ type: `SET_COUNTRY_CODES`, payload }),
})

export default connect(mapStateToProps, mapDispatchToProps)(List)
