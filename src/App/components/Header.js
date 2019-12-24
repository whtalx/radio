import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import countries from '../functions/iso3166-1-alpha-2'

const Wrapper = styled.div`
  position: sticky;
  left: 0;
  top: 0;
  width: 100%;
  height: 2em;
  background-color: #fff;
  display: flex;
  flex-flow: column;
  align-items: stretch;
  z-index: 1;
`

const StatusBar = styled.div`
  height: 1em;
  display: flex;
  flex-flow: row;
  -webkit-app-region: drag;

  span,
  button {
    -webkit-app-region: no-drag;
  }
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

  :hover {
    color: lightslategray;
  }
`

const TableHead = styled.div`
  height: 1em;
  border-top: 1px solid lightslategray;
  border-bottom: 1px solid lightslategray;
`

const makeTitle = (props = {}) => {
  const { countrycode, language, tag } = props
  if (tag) return tag
  if (language) return language
  if (countrycode) return countries(countrycode).name
}

const Header = ({
  list,
  back,
  forward,
  show,
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
    },// eslint-disable-next-line
    [list.lastSearch]
  )

  if (!list.history) return (
    <Wrapper>
      <StatusBar />
    </Wrapper>
  )

  return (
    <Wrapper>
      <StatusBar>
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
      </StatusBar>
      { list.show === `stations` && <TableHead /> }
    </Wrapper>
  )
}

const mapStateToProps = ({ list }) => ({ list })
const mapDispatchToProps = (dispatch) => ({
  back: () => dispatch({ type: `LIST_BACK` }),
  forward: () => dispatch({ type: `LIST_FORWARD` }),
  show: (payload) => dispatch({ type: `SHOW`, payload }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
