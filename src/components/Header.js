import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import countries from '../functions/iso3166-1-alpha-2'
import {
  listShow,
  listBack,
  listForward,
  favouritesToggle,
} from '../actions'

const StatusBar = styled.div`
  position: sticky;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 1.1em;
  display: flex;
  flex-flow: row;
  align-items: center;
  background-color: hsl(0, 0%, 0%);
`

const NavigateButton = styled.button`
  margin: 0;
  padding: 0;
  width: 1em;
  height: 1em;
`

const Status = styled.p`
  flex-grow: 1;
`

const Nav = styled.span`
  cursor: pointer;
`

const Fav = styled.div`
  width: 1em;
  height: 1em;
  color: ${ props => props.showing ? `hsl(0, 0%, 100%)` : `hsl(120, 100%, 50%)` };
`

const makeTitle = (props = {}) => {
  const { countrycode, language, tag } = props
  if (tag) return tag
  if (language) return language
  if (countrycode) return countries(countrycode).name
}

const Header = ({
  list,
  listShow,
  listBack,
  listForward,
  favouritesToggle,
}) => {
  const [titles, setTitles] = useState({
    start: <Nav key={ `start` } onClick={ () => listShow(`start`) }>stations</Nav>,
    countrycodes: <Nav key={ `countrycodes` } onClick={ () => listShow(`countrycodes`) }>from</Nav>,
    languages: <Nav key={ `languages` } onClick={ () => listShow(`languages`) }>in</Nav>,
    tags: <Nav key={ `tags` } onClick={ () => listShow(`tags`) }>tagged</Nav>,
    stations: <Nav key={ `stations` } onClick={ () => listShow(`stations`) }>{ makeTitle(list.lastSearch) }</Nav>,
  })

  useEffect(
    () => {
      setTitles(t => {
        t.stations = <Nav key={ `stations` } onClick={ () => listShow(`stations`) }>{ makeTitle(list.lastSearch) }</Nav>
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
      <NavigateButton onClick={ listBack } disabled={ list.history.findIndex(i => i === list.show) === 0 } />
      <NavigateButton onClick={ listForward } disabled={ list.history.findIndex(i => i === list.show) === list.history.length - 1 } />
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

const mapState = ({ list }) => ({ list })
const mapDispatch = {
  listShow,
  listBack,
  listForward,
  favouritesToggle,
}

export default connect(mapState, mapDispatch)(Header)
