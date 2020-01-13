import React, { useEffect, useState } from 'react'
import { StatusBar, NavigateButton, Status, Nav, Fav } from './styled'
import makeTitle from '../../functions/makeTitle'

export default ({
  list,
  show,
  back,
  forward,
  favouritesToggle,
}) => {
  const [titles, setTitles] = useState({
    start: <Nav key={ `start` } onClick={ () => show(`start`) }>stations</Nav>,
    countrycodes: <Nav key={ `countrycodes` } onClick={ () => show(`countrycodes`) }>from</Nav>,
    languages: <Nav key={ `languages` } onClick={ () => show(`languages`) }>in</Nav>,
    tags: <Nav key={ `tags` } onClick={ () => show(`tags`) }>tagged</Nav>,
    stations: <Nav key={ `stations` } onClick={ () => show(`stations`) }>{ makeTitle(list.lastSearch) }</Nav>,
  })

  useEffect(
    () => {
      setTitles(t => {
        t.stations = <Nav key={ `stations` } onClick={ () => show(`stations`) }>{ makeTitle(list.lastSearch) }</Nav>
        return t
      })
    },
    [list.lastSearch] // eslint-disable-line
  )

  return list.showFavourites
    ? <StatusBar>
      <Fav showing={ true } onClick={ favouritesToggle }>&#9825;</Fav>
    </StatusBar>
    : <StatusBar>
      <NavigateButton onClick={ back } disabled={ list.history.findIndex(i => i === list.show) === 0 } />
      <NavigateButton onClick={ forward } disabled={ list.history.findIndex(i => i === list.show) === list.history.length - 1 } />
      <Status>
        {
          list.history
            .slice(0, list.history.findIndex(i => i === list.show) + 1)
            .reduce(
              (all, item, index, orig) =>
                index === 0
                  ? orig.length === 2
                  ? [...all, titles[item], ` > `]
                  : [...all, titles[item]]
                  : index === orig.length - 1
                  ? [...all, titles[item]]
                  : [...all, ` > `, titles[item], ` > `],
              []
            )
        }
      </Status>
      <Fav showing={ false } onClick={ favouritesToggle }>&#9825;</Fav>
    </StatusBar>
}