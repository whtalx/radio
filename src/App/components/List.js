import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import Flag from './Flag'
import Header from './Header'
import sniff from '../functions/sniff'
import request from '../functions/request'
import getTags from '../functions/getTags'
import getStations from '../functions/getStations'
import getLanguages from '../functions/getLanguages'
import countries from '../functions/iso3166-1-alpha-2'
import getCountryCodes from '../functions/getCountryCodes'

const Ul = styled.ul`
  margin: 0;
  padding: 0 0 0 1em;
  list-style-type: none;
`

const Li = styled.li`
  cursor: pointer;

  ${
    props => props.active
      ? css`
        background-color: lightslategray;
        color: white;
      `
      : css`
        :hover {
          color: slategray;
        }

        :nth-child(2n) {
          background-color: ghostwhite;
        }
      `
  }
`

const List = ({
  api,
  list,
  setTags,
  dispatch,
  setStation,
  setStations,
  setLanguages,
  setCountryCodes,
}) => {
  const [current, setCurrent] = useState(``)
  const [controller, setController] = useState(null)

  useEffect(
    () => {
      switch (api.type) {
        case `stations`: {
          request(api).then(data => setStations(getStations(data)))
          return
        }

        case `countrycodes`: {
          request(api).then(data => setCountryCodes(getCountryCodes(data)))
          return
        }

        case `languages`: {
          request(api).then(data => setLanguages(getLanguages(data)))
          return
        }

        case `tags`: {
          request(api).then((data) => setTags(getTags(data)))
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
      if (current) {
        setController(new AbortController())
        console.log(`creating controller`)
      } else {
        if (controller) {
          console.log(`this should never happen. if you read this, god bless you`)
          setController(null)
        }
        setStation(``)
      }
    }, // eslint-disable-next-line
    [current]
  )

  useEffect(
    () => {
      if (!controller) return

      const signal = controller.signal
      signal.addEventListener(`abort`, () => {
        console.log(`destroying controller`)
        setController(null)
      })

      sniff({
        url: current,
        signal,
      })
        .then(({ station = `` }) => {
          setStation(station)
          controller.abort()
          station === `` && setCurrent(station) // TODO: change color of list item
        })
        // .catch(error)
    }, // eslint-disable-next-line
    [controller]
  )

  return (
    <div>
      <Header />
      <Ul>
        {
          list[list.show].map(listItem => {
            switch (list.show) {
              case `countrycodes`: {
                const country = countries(listItem.name)
                return (
                  <Li
                    key={ listItem.name }
                    title={ country.orig }
                    onClick={ () => dispatch(listItem.action) }
                  >
                    <Flag code={ country.flag ? country.flag : listItem.name }/>
                    { `\t${ country.name }` }
                  </Li>
                )
              }

              case `stations`:
                return (
                  <Li
                    key={ listItem.id }
                    active={ current === listItem.src }
                    onClick={ () => setCurrent(last => last === listItem.src ? `` : listItem.src ) }
                  >
                    <span>{ listItem.name }</span>
                    <br />
                    <span>{ listItem.src }</span>
                  </Li>
                )

              default:
                return (
                  <Li key={ listItem.name } onClick={ () => dispatch(listItem.action) }>
                    { listItem.name }
                  </Li>
                )
            }
          })
        }
      </Ul>
    </div>
  )
}

const mapStateToProps = ({ api, list }) => ({ api, list })
const mapDispatchToProps = (dispatch) => ({
  setTags: payload => dispatch({ type: `SET_TAGS`, payload }),
  dispatch: action => dispatch(action),
  setStation: payload => dispatch({ type: `SET_STATION`, payload }),
  setStations: payload => dispatch({ type: `SET_STATIONS`, payload }),
  setLanguages: payload => dispatch({ type: `SET_LANGUAGES`, payload }),
  setCountryCodes: payload => dispatch({ type: `SET_COUNTRY_CODES`, payload }),
})

export default connect(mapStateToProps, mapDispatchToProps)(List)
