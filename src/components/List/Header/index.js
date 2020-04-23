import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { StatusBar, Button, Status, Nav } from './styled'
import { ReactComponent as FavouriteIcon } from '../../../icons/favourite.svg'

import { navProps } from '../../../functions'

import {
  show,
  historyBack,
  historyForward,
  favouritesToggle,
} from '../../../actions'

export default connect(
  ({ list }) => ({ list }),
  (dispatch) => ({
    show: (list) => dispatch(show(list)),
    historyBack: () => dispatch(historyBack()),
    historyForward: () => dispatch(historyForward()),
    favouritesToggle: () => dispatch(favouritesToggle()),
  }),
)(
  ({
    list,
    show,
    historyBack,
    historyForward,
    favouritesToggle,
  }) => {
    const [titles, setTitles] = useState({
      tags: <Nav { ...navProps(`tags`, show) }  />,
      start: <Nav { ...navProps(`start`, show) } />,
      stations: <Nav { ...navProps(`stations`, show, list.lastSearch) } />,
      languages: <Nav { ...navProps(`languages`, show) } />,
      countrycodes: <Nav { ...navProps(`countrycodes`, show) } />,
    })

    useEffect(
      () => {
        setTitles(t => ({
          ...t,
          stations: <Nav { ...navProps(`stations`, show, list.lastSearch) } />,
        }))
      },
      [list] // eslint-disable-line
    )

    function currentListIndex() {
      return list.history.findIndex(i => i === list.show)
    }

    return list.showFavourites ? (
      <StatusBar favs={ true }>
        <Button onClick={ favouritesToggle } title={ `Back` }>&lt;</Button>
        <span>Favourites</span>
        <Button onClick={ favouritesToggle } title={ `Back` }><FavouriteIcon fill="currentColor" /></Button>
      </StatusBar>
    ) : (
      <StatusBar>
        <Button onClick={ historyBack } disabled={ currentListIndex() === 0 } title={ `Back` }>&lt;</Button>
        <Button onClick={ historyForward } disabled={ currentListIndex() === list.history.length - 1 } title={ `Forward` }>&gt;</Button>
        <Status>
          {
            list.history
              .slice(0, list.history.findIndex(i => i === list.show) + 1)
              .reduce(
                (all, item, index, orig) =>
                  index === 0
                    ? orig.length === 2
                      ? [...all, titles[item], ` `]
                      : [...all, titles[item]]
                    : index === orig.length - 1
                      ? [...all, titles[item]]
                      : [...all, ` `, titles[item], ` `],
                []
              )
          }
        </Status>
        <Button showing={ false } onClick={ favouritesToggle } title={ `Show favourite stations` }>
          <FavouriteIcon fill="currentColor" />
        </Button>
      </StatusBar>
    )
  }
)
