import React, { useEffect, useRef, useState } from 'react'
import { ipcRenderer } from 'electron'
import Header from '../Header'
import { Container, Ul, Li, Wrapper } from './styled'
import {
  request,
  getTags,
  getStations,
  getLanguages,
  getCountryCodes,
} from '../../functions'

export default ({
  api,
  setApi,
  setType,
  list,
  updateStation,
  setTags,
  setStations,
  setLanguages,
  setCountryCodes,
  favouritesAdd,
  favouritesRemove,
  player,
  setPlaying,
}) => {
  const focused = useRef({})
  const playing = useRef(player.playing)
  const container = useRef(null)
  const [offsets, setOffsets] = useState({})
  const [selected, setSelected] = useState(null)
  const [processing, setProcessing] = useState(null)
  const [contextMenuCalled, setContextMenuCalled] = useState(false)

  function handleContextMenu(event) {
    event.preventDefault()
    event.target.focus()
    setContextMenuCalled(true)
  }

  useEffect(
    () => {
      ipcRenderer.on(`resolved`, (_, data) => {
        setProcessing(null)
        updateStation(data)
      })

      ipcRenderer.on(`rejected`, (_, data) => {
        setProcessing(null)
        updateStation({ ...data, unresolvable: true })
      })

      ipcRenderer.on(`context`, (_, label) => {
        switch (label) {
          case `Play`: {
            playing.current === focused.current
              ? ipcRenderer.send(`ping`, `play`)
              : setSelected(focused.current)
            return
          }

          case `Stop`: {
            ipcRenderer.send(`ping`, `stop`)
            return
          }

          case `Add to favourites`: {
            favouritesAdd(focused.current)
            return
          }

          case `Remove from favourites`: {
            favouritesRemove(focused.current)
            return
          }

          case `Information`: {
            console.log(JSON.parse(JSON.stringify(focused.current)))
            return
          }

          default:
            return
        }
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
      if (!selected) return

      if (selected.unresolvable) {
        setSelected(null)
        return
      }

      if (selected.hls) {
        setPlaying(selected)
      } else if (selected.src_resolved) {
        setPlaying(selected)
        ipcRenderer.send(`request`, selected)
      } else if (selected.id !== player.playing.id) {
        setProcessing(selected.id)
        ipcRenderer.send(`request`, selected)
      }

      setSelected(null)
    },
    [selected] // eslint-disable-line
  )

  useEffect(
    () => {
      if (!contextMenuCalled) return

      const play = { label: `Play`, enabled: !focused.current.unresolvable }
      const stop = { label: `Stop` }
      const info = { label: `Information` }
      const add = { label: `Add to favourites` }
      const remove = { label: `Remove from favourites` }

      const menus = [
        player.playing.id === focused.current.id && player.currentState !== `paused` ? stop : play,
        list.favourites.findIndex(station => station.id === focused.current.id) >= 0 ? remove : add,
        info,
      ]

      ipcRenderer.send(`context`, menus)
      setContextMenuCalled(false)
    },
    [contextMenuCalled] // eslint-disable-line
  )

  useEffect(
    () => {
      api.type === `stations` && setOffsets(o => ({ ...o, stations: 0 }))
    },
    [api.type] // eslint-disable-line
  )

  useEffect(
    () => {
      container.current.scroll(0, offsets[list.show] || 0)
    },
    [list.show] // eslint-disable-line
  )

  useEffect(
    () => {
      playing.current = player.playing
    },
    [player.playing] // eslint-disable-line
  )

  return (
    <Wrapper>
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
                  onFocus={ () => focused.current = listItem }
                  onContextMenu={ handleContextMenu }
                  onDoubleClick={ () => setSelected(listItem) }
                  children={ listItem.name }
                />
              )
              : list.show && list[list.show] && list[list.show].map((listItem, index) => {
                switch (list.show) {
                  case `stations`:
                    return (
                      <Li
                        key={ listItem.id }
                        title={ listItem.src }
                        unresolvable={ listItem.unresolvable }
                        playing={ listItem.id === player.playing.id }
                        processing={ listItem.id === processing }
                        onFocus={ () => focused.current = listItem }
                        onContextMenu={ handleContextMenu }
                        onDoubleClick={ () => setSelected(listItem) }
                        children={ listItem.name }
                      />
                    )

                  case `countrycodes`:
                    return (
                      <Li
                        key={ listItem.name + index }
                        onDoubleClick={ () => setApi(listItem.search) }
                        title={ `Stations: ${ listItem.stationcount }` }
                        processing={ listItem.search.countrycode === processing }
                        playing={ player.playing.countrycode === listItem.search.countrycode }
                        children={ listItem.name }
                      />
                    )

                  case `languages`:
                    return (
                      <Li
                        key={ listItem.name + index }
                        processing={ listItem.name === processing }
                        onDoubleClick={ () => setApi(listItem.search) }
                        title={ `Stations: ${ listItem.stationcount }` }
                        playing={ player.playing.language === listItem.name }
                        children={ listItem.name }
                      />
                    )

                  case `tags`:
                    return (
                      <Li
                        key={ listItem.name + index }
                        processing={ listItem.name === processing }
                        onDoubleClick={ () => setApi(listItem.search) }
                        title={ `Stations: ${ listItem.stationcount }` }
                        playing={ player.playing.tag === listItem.name }
                        children={ listItem.name }
                      />
                    )

                  default:
                    return (
                      <Li
                        key={ listItem.name + index }
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
    </Wrapper>
  )
}
