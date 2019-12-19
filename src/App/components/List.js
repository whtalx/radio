import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import Flag from './Flag'
import countries from '../functions/iso3166-1-alpha-2'
import error from '../functions/error'

const Ul = styled.ul`
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

let controller

const List = ({
  list,
  player,
  dispatch,
  setStation,
}) => {
  const [current, setCurrent] = useState(``)
  useEffect(
    () => {
      if (!controller) return
      controller.abort()
      controller = null
    },
    [player.station]
  )

  const checkURL = (url, origin) => {
    if (url === ``) {
      setCurrent(url)
      setStation(url)
      return
    }

    origin && console.log(origin, ` recursive call: `, url)

    controller && controller.abort()
    controller = new AbortController()
    controller.signal.onabort = () => undefined

    fetch(url, { signal: controller.signal })
      .then((response) => {
        const type = response.headers.get(`content-type`)
        console.log(url, ` content-type: `, type)

        if (
          !type ||
          type.split(`/`)[0] === `audio` ||
          type === `application/ogg`
        ) {
          setStation(url)
          setCurrent(origin || url)
          return null
        } else if(/text\/html/.test(type)) {
          if (/index\.html\?sid=1/.test(response.url)) {
            checkURL(response.url.replace(/index\.html\?sid=1/, `;`), url)
          } else if (/webcast-server\.net:\d+\/$|castserver\.net:\d+\/$/.test(response.url)) {
            checkURL(`${ response.url };`, url)
          }

          return null
        } else {
          return response.blob()
        }
      })
      .then(blob => blob ? blob.text() : null)
      .then(text => {
        if (!text) return null

        console.log(`parsing: `, text)

        if (/http\S+/g.test(text)) {
          checkURL(text.match(/http\S+/g)[0], url)
        }

        return null
      })
      .catch(error)
  }

  return (
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
                  onClick={ () => checkURL(current === listItem.src ? `` : listItem.src) }
                >
                  { listItem.name }
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
  )
}


const mapStateToProps = ({ list, player }) => ({ list, player });
const mapDispatchToProps = (dispatch) => ({
  dispatch: action => dispatch(action),
  setStation: payload => dispatch({ type: `SET_STATION`, payload })
});

export default connect(mapStateToProps, mapDispatchToProps)(List)
