import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { remote, ipcRenderer } from 'electron'
import styled, { css, keyframes } from 'styled-components'
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

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden scroll;
  background-color: hsl(0, 0%, 0%);
  color: hsl(120, 100%, 50%);
`

const Ul = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`

const Li = styled.li.attrs({
  tabIndex: 1,
})`
  cursor: pointer;
  position: relative;
  padding-left: 1em;
  color: ${ props => props.playing ? `hsl(0, 0%, 100%)` : `inherit` };

  :focus {
    border: none;
    outline: none;
    background-color: hsl(240, 100%, 50%);
  }

  ${
    props => props.processing && css`
      :focus:after {
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

  useEffect(
    () => {
      ipcRenderer.on(`playing`, (e, station) => setPlaying(station))
      ipcRenderer.on(`loading`, () => setPlaying({}))
      ipcRenderer.on(`paused`, () => setPlaying({}))
      ipcRenderer.on(`key`, (e, key) => setKey(key))
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

      key === `Enter` &&
      !controller &&
      current.src &&
      !current.src_resolved &&
      current.id !== playing.id &&
      setController(new AbortController())

      setKey(null)
    }, // eslint-disable-next-line
    [key]
  )

  useEffect(
    () => {
      if (!controller) return

      const signal = controller.signal
      signal.addEventListener(`abort`, () => setController(null))

      sniff({
        url: current.src,
        signal,
      })
        .then(({ src_resolved }) => {
          controller.abort()
          if (src_resolved) {
            const station = { ...current, src_resolved }
            setStation(station)
            player.webContents.send(`station`, station)
          } else {
            setCurrent({})
            player.webContents.send(`station`, {})
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
    <Container>
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
                    onDoubleClick={ () => dispatch(listItem.action) }
                  >
                    { country.name }
                  </Li>
                )
              }

              case `stations`:
                return (
                  <Li
                    key={ listItem.id }
                    playing={ playing.id === listItem.id }
                    processing={ controller !== null }
                    onFocus={ () => current.id !== listItem.id && setCurrent(listItem) }
                    onDoubleClick={ () =>
                      listItem.src_resolved
                        ? player.webContents.send(`station`, listItem)
                        : current.id !== playing.id && setController(new AbortController())
                    }
                  >
                    { listItem.name }
                  </Li>
                )

              default:
                return (
                  <Li key={ listItem.name } onDoubleClick={ () => dispatch(listItem.action) }>
                    { listItem.name }
                  </Li>
                )
            }
          })
        }
      </Ul>
    </Container>
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
