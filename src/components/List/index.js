import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'
import Header from './Header'
import { Wrapper, Reservoir, Container, Ul, Li } from './styled'

import {
  request,
  getTags,
  getStations,
  getLanguages,
  getCountryCodes,
} from '../../functions'

import {
  setApi,
  setType,
  setState,
  setPlaying,
  setTagsList,
  updateStation,
  favouritesAdd,
  setStationsList,
  setLanguagesList,
  favouritesRemove,
  setCountryCodesList,
} from '../../actions'

export default connect(
  ({ api, list, player }) => ({ api, list, player }),
  (dispatch) => ({
    setApi: state => dispatch(setApi(state)),
    setType: type => dispatch(setType(type)),
    setTags: tags => dispatch(setTagsList(tags)),
    setState: state => dispatch(setState(state)),
    setPlaying: station => dispatch(setPlaying(station)),
    updateStation: station => dispatch(updateStation(station)),
    favouritesAdd: station => dispatch(favouritesAdd(station)),
    setStations: stations => dispatch(setStationsList(stations)),
    setLanguages: languages => dispatch(setLanguagesList(languages)),
    favouritesRemove: station => dispatch(favouritesRemove(station)),
    setCountryCodes: countryCodes => dispatch(setCountryCodesList(countryCodes)),
  }),
)(
  ({
    api,
    list,
    setApi,
    setTags,
    setType,
    setState,
    setPlaying,
    setStations,
    setLanguages,
    setCountryCodes,
    favouritesAdd,
    favouritesRemove,
    player,
  }) => {
    const showing = useRef(list.show)
    const playing = useRef(player.playing)
    const focused = useRef({})
    const container = useRef(null)
    const [offsets, setOffsets] = useState({})
    const [showCount, setShowCount] = useState(150)
    const [selected, setSelected] = useState(null)
    const [processing, setProcessing] = useState(null)
    const [contextMenuCalled, setContextMenuCalled] = useState(false)

    useEffect(
      () => {
        ipcRenderer.on(`resolved`, () => {
          setProcessing(null)
        })

        ipcRenderer.on(`rejected`, () => {
          setProcessing(null)
        })

        ipcRenderer.on(`context`, (_, label) => {
          switch (label) {
            case `Play`: {
              playing.current === focused.current
                ? setPlaying(focused.current)
                : setSelected(focused.current)
              return
            }

            case `Stop`: {
              setState(`paused`)
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
            setOffsets(o => ({ ...o, stations: 0 }))
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
          list.favourites.findIndex(({ id }) => id === focused.current.id) >= 0 ? remove : add,
          info,
        ]

        ipcRenderer.send(`context`, menus)
        setContextMenuCalled(false)
      },
      [contextMenuCalled] // eslint-disable-line
    )

    useEffect(
      () => {
        container.current.scroll(0, offsets[list.show] || 0)
        showing.current = list.show
        setShowCount(150)
      },
      [list.show] // eslint-disable-line
    )

    useEffect(
      () => {
        playing.current = player.playing
      },
      [player.playing] // eslint-disable-line
    )

    function handleContextMenu(event) {
      event.preventDefault()
      event.target.focus()
      setContextMenuCalled(true)
    }

    function handleScroll({ target }) {
      setOffsets(last => ({ ...last, [showing.current]: target.scrollTop }))

      showCount < list[showing.current].length &&
      target.scrollTop / target.lastElementChild.clientHeight > .5 &&
      setShowCount(last => last + 100)
    }

    return (
      <Wrapper>
        <Reservoir>
          <Header />
          <Container ref={ container } onScroll={ handleScroll }>
            <Ul>
              {
                list.showFavourites
                  ? list.favourites.slice(0, showCount).map((listItem) =>
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
                  : list.show && list[list.show] && list[list.show].slice(0, showCount).map((listItem, index) => {
                    switch (list.show) {
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
        </Reservoir>
      </Wrapper>
    )
  }
)
