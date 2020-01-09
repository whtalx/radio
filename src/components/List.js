import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer, remote } from 'electron'
import styled, { css, keyframes } from 'styled-components'
import Header from './Header'
import sniff from '../functions/sniff'
import request from '../functions/request'
import getTags from '../functions/getTags'
import getStations from '../functions/getStations'
import getLanguages from '../functions/getLanguages'
import countries from '../functions/iso3166-1-alpha-2'
import getCountryCodes from '../functions/getCountryCodes'

const { Menu, MenuItem } = remote

const barSpin = keyframes`
  0% { content: '\\005C' }
  33% { content: '\\2013' }
  66% { content: '\\002F' }
  to { content: '\\007C' }
`

const Container = styled.div`
  width: 100%;
  height: 500px;
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
  padding-left: .5em;
  width: 100%;
  height: 1.1em;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  color: ${ props => props.playing ? `hsl(0, 0%, 100%)` : props.unresolvable && `hsl(0, 100%, 50%)` };

  :focus {
    border: none;
    outline: none;
    background-color: hsl(240, 100%, 50%);
  }

  ${
    props => props.processing && css`
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
  player,
  setTags,
  dispatch,
  setPlaying,
  setStation,
  setStations,
  setLanguages,
  addFavourite,
  removeFavourite,
  setCountryCodes,
}) => {
  const [key, setKey] = useState(null)
  const [tune, setTune] = useState(null)
  const [current, setCurrent] = useState({})
  const [processing, setProcessing] = useState(null)
  const [controller, setController] = useState(null)
  const [contextMenuCalled, setContextMenuCalled] = useState(false)

  const handleContextMenu = (event) => {
    event.preventDefault()
    event.target.focus()
    setContextMenuCalled(true)
  }

  useEffect(
    () => {
      ipcRenderer.on(`key`, (e, key) => setKey(key))
    }, // eslint-disable-next-line
    []
  )

  useEffect(
    () => {
      switch (api.type) {
        case `stations`: {
          const { countrycode, language, tag } = api.search
          setProcessing(countrycode || language || tag)
          request(api)
            .then(data => setStations(getStations(data).map(item => ({ ...item, countrycode, language, tag }))))
            .then(() => setProcessing(null))
          return
        }

        case `countrycodes`: {
          setProcessing(`by countries`)
          request(api)
            .then(data => setCountryCodes(getCountryCodes(data)))
            .then(() => setProcessing(null))
          return
        }

        case `languages`: {
          setProcessing(`by languages`)
          request(api)
            .then(data => setLanguages(getLanguages(data)))
            .then(() => setProcessing(null))
          return
        }

        case `tags`: {
          setProcessing(`by tags`)
          request(api)
            .then(data => setTags(getTags(data)))
            .then(() => setProcessing(null))
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
      if (!tune) return

      if (tune.unresolvable) {
        setTune(null)
      } else if (tune.src_resolved) {
        setPlaying(tune)
        setTune(null)
      } else if (tune.id !== player.playing.id) {
        controller && controller.abort()
        setController(new AbortController())
      }
    }, // eslint-disable-next-line
    [tune]
  )

  useEffect(
    () => {
      if (!key) return

      key === `Enter` && setTune(current)
      setKey(null)
    }, // eslint-disable-next-line
    [key]
  )

  useEffect(
    () => {
      if (!controller) {
        tune && setTune(null)
        processing && setProcessing(null)
        return
      }

      const signal = controller.signal
      signal.addEventListener(`abort`, () => setController(null))
      setProcessing(current.id)

      sniff({ station: { ...current }, signal })
        .then((station) => {
          if (!signal.aborted) {
            controller.abort()
            setStation(station)
            station.src_resolved && setPlaying(station)
          }
        })
    }, // eslint-disable-next-line
    [controller]
  )

  useEffect(
    () => {
      if (!contextMenuCalled) return

      const play = {
        label: `Play`,
        enabled: !current.unresolvable,
        click() {
          setTune(current)
        },
      }

      const stop = {
        label: `Stop`,
        click() {
          player.playing.id === current.id && setPlaying({})
        },
      }

      const add = {
        label: `Add to favourites`,
        click() {
          addFavourite(current)
        },
      }

      const remove = {
        label: `Remove from favourites`,
        click() {
          removeFavourite(current)
        },
      }

      const info = {
        label: `Information`,
        click() {
          console.log(JSON.parse(JSON.stringify(current)))
        },
      }

      const menu = new Menu()
      menu.append(new MenuItem(player.playing.id === current.id ? stop : play))
      menu.append(new MenuItem(list.favourites.findIndex(station => station.id === current.id) >= 0 ? remove : add))
      menu.append(new MenuItem(info))
      menu.popup({ window: remote.getCurrentWindow() })
      setContextMenuCalled(false)
    }, // eslint-disable-next-line
    [contextMenuCalled]
  )

  return (
    <Container>
      <Header />
      <Ul>
        {
          list.showFavourites
            ? list.favourites.map((listItem) =>
              <Li
                key={ listItem.id }
                title={ listItem.src }
                unresolvable={ listItem.unresolvable }
                playing={ listItem.id === player.playing.id }
                processing={ listItem.id === processing }
                onFocus={ () => setCurrent(listItem) }
                onContextMenu={ handleContextMenu }
                onDoubleClick={ () => setTune(listItem) }
              >
                { listItem.name }
              </Li>
            )
            : list.show && list[list.show] && list[list.show].map((listItem) => {
              switch (list.show) {
                case `countrycodes`: {
                  const country = countries(listItem.name)
                  return (
                    <Li
                      key={ listItem.name }
                      title={ country.orig }
                      playing={ player.playing.countrycode === listItem.name }
                      processing={ listItem.name === processing }
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
                      title={ listItem.src }
                      unresolvable={ listItem.unresolvable }
                      playing={ listItem.id === player.playing.id }
                      processing={ listItem.id === processing }
                      onFocus={ () => setCurrent(listItem) }
                      onContextMenu={ handleContextMenu }
                      onDoubleClick={ () => setTune(listItem) }
                    >
                      { listItem.name }
                    </Li>
                  )

                case `languages`:
                  return (
                    <Li
                      key={ listItem.name }
                      processing={ listItem.name === processing }
                      onDoubleClick={ () => dispatch(listItem.action) }
                      playing={ player.playing.language === listItem.name }
                    >
                      { listItem.name }
                    </Li>
                  )

                case `tags`:
                  return (
                    <Li
                      key={ listItem.name }
                      processing={ listItem.name === processing }
                      playing={ player.playing.tag === listItem.name }
                      onDoubleClick={ () => dispatch(listItem.action) }
                    >
                      { listItem.name }
                    </Li>
                  )

                default:
                  return (
                    <Li
                      key={ listItem.name }
                      processing={ listItem.name === processing }
                      onDoubleClick={ () => dispatch(listItem.action) }
                    >
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

const mapStateToProps = ({ api, list, player }) => ({ api, list, player })
const mapDispatchToProps = (dispatch) => ({
  setTags: payload => dispatch({ type: `SET_TAGS`, payload }),
  dispatch: action => dispatch(action),
  setPlaying: payload => dispatch({ type: `SET_PLAYING`, payload }),
  setStation: payload => dispatch({ type: `SET_STATION`, payload }),
  setStations: payload => dispatch({ type: `SET_STATIONS`, payload }),
  setLanguages: payload => dispatch({ type: `SET_LANGUAGES`, payload }),
  addFavourite: payload => dispatch({ type: `ADD_FAVOURITE`, payload }),
  removeFavourite: payload => dispatch({ type: `REMOVE_FAVOURITE`, payload }),
  setCountryCodes: payload => dispatch({ type: `SET_COUNTRY_CODES`, payload }),
})

export default connect(mapStateToProps, mapDispatchToProps)(List)
