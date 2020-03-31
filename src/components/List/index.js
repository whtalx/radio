import React, { useEffect, useReducer, useRef, useState } from 'react'
import { ipcRenderer } from 'electron'
import { reducer, initialState } from './reducer'
import Header from './Header'
import { Container, Ul, Li, Wrapper } from './styled'
import {
  request,
  getTags,
  getStations,
  getLanguages,
  getCountryCodes,
} from '../../functions'

export default () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [player, setPlayer] = useState(JSON.parse(localStorage.player || `null`))
  const focused = useRef({})
  const showing = useRef(state.list.show)
  const playing = useRef(player.playing)
  const container = useRef(null)
  const [offsets, setOffsets] = useState({})
  const [showCount, setShowCount] = useState(150)
  const [selected, setSelected] = useState(null)
  const [processing, setProcessing] = useState(null)
  const [contextMenuCalled, setContextMenuCalled] = useState(false)

  useEffect(
    () => {
      window.addEventListener(`storage`, () => {
        setPlayer(JSON.parse(localStorage.player || `null`))
      })

      ipcRenderer.on(`resolved`, (_, data) => {
        setProcessing(null)
        updateStation(data)
      })

      ipcRenderer.on(`toggle_list`, () => {
        dispatch({ type: `LIST_TOGGLE` })
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

      ipcRenderer.send(`list`, state.list.visible)

      return () => {
        ipcRenderer.removeAllListeners(`resolved`)
        ipcRenderer.removeAllListeners(`rejected`)
        ipcRenderer.removeAllListeners(`context`)
      }
    },
    [] // eslint-disable-line
  )

  useEffect(
    () => {
      switch (state.api.type) {
        case `stations`: {
          const { countrycode, language, tag } = state.api.search
          setProcessing(countrycode || language || tag)
          request(state.api)
            .then(data => setStations(getStations(data).map(item => ({ ...item, countrycode, language, tag }))))
            .then(() => setProcessing(null))
          return
        }

        case `countrycodes`: {
          setProcessing(`by countries`)
          request(state.api)
            .then(data => setCountryCodes(getCountryCodes(data)))
            .then(() => setProcessing(null))
          return
        }

        case `languages`: {
          setProcessing(`by languages`)
          request(state.api)
            .then(data => setLanguages(getLanguages(data)))
            .then(() => setProcessing(null))
          return
        }

        case `tags`: {
          setProcessing(`by tags`)
          request(state.api)
            .then(data => setTags(getTags(data)))
            .then(() => setProcessing(null))
          return
        }

        default:
          return
      }
    },
    [state.api.type] // eslint-disable-line
  )

  useEffect(
    () => {
      if (!selected) return

      setProcessing(selected.id)
      ipcRenderer.send(`request`, selected)
      setSelected(null)
    },
    [selected] // eslint-disable-line
  )

  useEffect(
    () => {
      if (!contextMenuCalled) return

      const play = { label: `Play` }
      const stop = { label: `Stop` }
      const info = { label: `Information` }
      const add = { label: `Add to favourites` }
      const remove = { label: `Remove from favourites` }

      const menus = [
        playing.current.id === focused.current.id && player.currentState !== `paused` ? stop : play,
        state.list.favourites.findIndex(station => station.id === focused.current.id) >= 0 ? remove : add,
        info,
      ]

      ipcRenderer.send(`context`, menus)
      setContextMenuCalled(false)
    },
    [contextMenuCalled] // eslint-disable-line
  )

  useEffect(
    () => {
      state.api.type === `stations` && setOffsets(o => ({ ...o, stations: 0 }))
    },
    [state.api.type] // eslint-disable-line
  )

  useEffect(
    () => {
      container.current.scroll(0, offsets[state.list.show] || 0)
      showing.current = state.list.show
      setShowCount(150)
    },
    [state.list.show] // eslint-disable-line
  )

  useEffect(
    () => {
      state !== initialState && localStorage.setItem(`list`, JSON.stringify(state.list))
    },
    [
      state.list,
      state.list.tags,
      state.list.show,
      state.list.visible,
      state.list.history,
      state.list.stations,
      state.list.languages,
      state.list.lastSearch,
      state.list.favourites,
      state.list.countrycodes,
      state.list.showFavourites,
    ]
  )

  useEffect(
    () => {
      playing.current = player.playing
    },
    [player] // eslint-disable-line
  )

  function setApi(payload) {
    dispatch({ type: `SET_API`, payload })
  }

  function setType(payload) {
    dispatch({ type: `SET_TYPE`, payload })
  }

  function updateStation(payload) {
    dispatch({ type: `UPDATE_STATION`, payload })
  }

  function setTags(payload) {
    dispatch({ type: `SET_TAGS_LIST`, payload })
  }

  function setStations(payload) {
    dispatch({ type: `SET_STATIONS_LIST`, payload })
  }

  function setLanguages(payload) {
    dispatch({ type: `SET_LANGUAGES_LIST`, payload })
  }

  function setCountryCodes(payload) {
    dispatch({ type: `SET_COUNTRY_CODES_LIST`, payload })
  }

  function favouritesAdd(payload) {
    dispatch({ type: `FAVOURITES_ADD`, payload })
  }

  function favouritesRemove(payload) {
    dispatch({ type: `FAVOURITES_REMOVE`, payload })
  }

  function handleContextMenu(event) {
    event.preventDefault()
    event.target.focus()
    setContextMenuCalled(true)
  }

  function handleScroll({ target }) {
    setOffsets(last => ({ ...last, [showing.current]: target.scrollTop }))

    showCount < state.list[showing.current].length &&
    target.scrollTop / target.lastElementChild.clientHeight > .7 &&
    setShowCount(last => last + 100)
  }

  return (
    <Wrapper>
      <Container ref={ container } onScroll={ handleScroll }>
        <Header
          list={ state.list }
          show={ payload => dispatch({ type: `SHOW`, payload }) }
          back={ () => dispatch({ type: `HISTORY_BACK` }) }
          forward={ () => dispatch({ type: `HISTORY_FORWARD` }) }
          favouritesToggle={ () => dispatch({ type: `FAVOURITES_TOGGLE` }) }
        />
        <Ul>
          {
            state.list.showFavourites
              ? state.list.favourites.slice(0, showCount).map((listItem) =>
                <Li
                  key={ listItem.id }
                  title={ listItem.src }
                  unresolvable={ listItem.unresolvable }
                  playing={ listItem.id === playing.current.id }
                  processing={ listItem.id === processing }
                  onFocus={ () => focused.current = listItem }
                  onContextMenu={ handleContextMenu }
                  onDoubleClick={ () => setSelected(listItem) }
                  children={ listItem.name }
                />
              )
              : state.list.show && state.list[state.list.show] && state.list[state.list.show].slice(0, showCount).map((listItem, index) => {
              switch (state.list.show) {
                case `stations`:
                  return (
                    <Li
                      key={ listItem.id }
                      title={ listItem.src }
                      unresolvable={ listItem.unresolvable }
                      playing={ listItem.id === playing.current.id }
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
                      playing={ playing.current.countrycode === listItem.search.countrycode }
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
                      playing={ playing.current.language === listItem.name }
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
                      playing={ playing.current.tag === listItem.name }
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
