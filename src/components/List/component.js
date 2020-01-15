import React, { useEffect, useRef, useState } from 'react'
import { ipcRenderer, remote } from 'electron'
import Header from '../Header'
import { Container, Ul, Li } from './styled'
import request from '../../functions/request'
import getTags from '../../functions/getTags'
import getStations from '../../functions/getStations'
import getLanguages from '../../functions/getLanguages'
import getCountryCodes from '../../functions/getCountryCodes'

const { Menu, MenuItem } = remote

export default ({
  api,
  setApi,
  setType,
  list,
  setStation,
  setTags,
  setStations,
  setLanguages,
  setCountryCodes,
  favouritesAdd,
  favouritesRemove,
  player,
  setPlaying,
}) => {
  const container = useRef(null)
  const [tune, setTune] = useState(null)
  const [current, setCurrent] = useState({})
  const [offsets, setOffsets] = useState({})
  const [processing, setProcessing] = useState(null)
  const [contextMenuCalled, setContextMenuCalled] = useState(false)

  const handleContextMenu = (event) => {
    event.preventDefault()
    event.target.focus()
    setContextMenuCalled(true)
  }

  useEffect(
    () => {
      ipcRenderer.on(`resolved`, (_, data) => {
        setProcessing(null)
        setStation(data)
      })

      ipcRenderer.on(`rejected`, (_, data) => {
        setProcessing(null)
        setStation({ ...data, unresolvable: true })
      })
    },
    [] // eslint-disable-line
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
    },
    [api.type] // eslint-disable-line
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
        setProcessing(tune.id)
        ipcRenderer.send(`fetch`, current)
      }
    },
    [tune] // eslint-disable-line
  )

  useEffect(
    () => {
      if (!contextMenuCalled) return

      const play = {
        label: `Play`,
        enabled: !current.unresolvable,
        click() {
          player.playing.id === current.id
            ? remote.getCurrentWebContents().send(`player`, `play`)
            : setTune(current)
        },
      }

      const stop = {
        label: `Stop`,
        click() {
          remote.getCurrentWebContents().send(`player`, `stop`)
        },
      }

      const add = {
        label: `Add to favourites`,
        click() {
          favouritesAdd(current)
        },
      }

      const remove = {
        label: `Remove from favourites`,
        click() {
          favouritesRemove(current)
        },
      }

      const info = {
        label: `Information`,
        click() {
          console.log(JSON.parse(JSON.stringify(current)))
        },
      }

      const menu = new Menu()
      menu.append(new MenuItem(player.playing.id === current.id ? player.currentState === `paused` ? play : stop : play))
      menu.append(new MenuItem(list.favourites.findIndex(station => station.id === current.id) >= 0 ? remove : add))
      menu.append(new MenuItem(info))
      menu.popup({ window: remote.getCurrentWindow() })
      setContextMenuCalled(false)
    },
    [contextMenuCalled] // eslint-disable-line
  )

  useEffect(
    () => {
      if (api.type !== `stations`) return
      setOffsets(o => ({ ...o, stations: 0 }))
    },
    [api.type] // eslint-disable-line
  )

  useEffect(
    () => {
      offsets[list.show]
        ? container.current.scroll(0, offsets[list.show])
        : container.current.scroll(0, 0)
    },
    [list.show] // eslint-disable-line
  )

  return (
    <Container ref={ container } onScroll={ ({ target }) => setOffsets(o => ({ ...o, [list.show]: target.scrollTop })) }>
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
                children={ listItem.name }
              />
            )
            : list.show && list[list.show] && list[list.show].map((listItem) => {
              switch (list.show) {
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
                      children={ listItem.name }
                    />
                  )

                case `countrycodes`:
                  return (
                    <Li
                      key={ listItem.name }
                      title={ `Stations: ${ listItem.stationcount }` }
                      processing={ listItem.search.countrycode === processing }
                      onDoubleClick={ () => setApi(listItem.search) }
                      playing={ player.playing.countrycode === listItem.search.countrycode }
                      children={ listItem.name }
                    />
                  )

                case `languages`:
                  return (
                    <Li
                      key={ listItem.name }
                      processing={ listItem.name === processing }
                      onDoubleClick={ () => setApi(listItem.search) }
                      playing={ player.playing.language === listItem.name }
                      children={ listItem.name }
                    />
                  )

                case `tags`:
                  return (
                    <Li
                      key={ listItem.name }
                      processing={ listItem.name === processing }
                      onDoubleClick={ () => setApi(listItem.search) }
                      playing={ player.playing.tag === listItem.name }
                      children={ listItem.name }
                    />
                  )

                default:
                  return (
                    <Li
                      key={ listItem.name }
                      processing={ listItem.name === processing }
                      onDoubleClick={ () => setType(listItem.type) }
                      children={ listItem.name }
                    />
                  )
              }
          })
        }
      </Ul>
    </Container>
  )
}
