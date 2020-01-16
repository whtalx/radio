import React, { useEffect, useState } from 'react'
import { StatusBar, Button, Status, Nav } from './styled'
import navProps from '../../functions/navProps'

export default ({
  list,
  show,
  back,
  forward,
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

  return list.showFavourites
    ? <StatusBar favs={ true }>
      <Button onClick={ favouritesToggle } title={ `Back` }>&lt;</Button>
      <span>Favourites</span>
      <Button onClick={ favouritesToggle } title={ `Back` }>&#9825;</Button>
    </StatusBar>
    : <StatusBar>
      <Button onClick={ back } disabled={ list.history.findIndex(i => i === list.show) === 0 } title={ `Back` }>&lt;</Button>
      <Button onClick={ forward } disabled={ list.history.findIndex(i => i === list.show) === list.history.length - 1 } title={ `Forward` }>&gt;</Button>
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
      <Button showing={ false } onClick={ favouritesToggle } title={ `Show favourite stations` }>&#9825;</Button>
    </StatusBar>
}
