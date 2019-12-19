import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import Flag from './Flag'
import countries from '../functions/iso3166-1-alpha-2'
import error from '../functions/error'

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

  const checkURL = ({ url, origin }) => {
    if (url === ``) {
      setCurrent(url)
      setStation(url)
      return
    }

    origin && console.log(origin, ` recursive call: `, url)

    controller && controller.abort()
    controller = new AbortController()
    controller.signal.onabort = () => undefined

    fetch(url, { signal: controller.signal, })
      .then((response) => {
        const [type, subtype] = (response.headers.get(`content-type`) || ``).split(`/`)
        console.log(url, ` content-type: ${ type }/${ subtype }`)

        if (
          !type ||
          subtype === `aac` ||
          subtype === `ogg` ||
          subtype === `mp4` ||
          subtype === `mpeg` ||
          subtype === `aacp` ||
          subtype === `opus`
        ) {
          setStation(url)
          setCurrent(origin || url)
          return null
        } else if(type === `text` && subtype === `html`) {
          response
            .text()
            .then(text => console.log(`response text: `, text))
            .catch(e => console.log(`can't resolve ${ url } response text: `, e))

          if (!/http(s)*:\/\/[\w\d.:-]+\/;/.test(response.url)) {
            checkURL({ url: url.match(/http(s)*:\/\/[\w\d.:-]+\//g) + `;`, origin: url })
          }
          return null
        } else if (type === `video`) {
          return null
        }

        return response.text()
      })
      .then(text => {
        if (!text) return null

        console.log(`parsing: `, text)

        const isM3U = text.substr(0,7) === `#EXTM3U`
        /*
         * works with:
         * application/vnd.apple.mpegurl
         * application/x-mpegURL
         */

        if (isM3U) {
          const links = text.replace(/#.+\n/g, ``).split(`\n`).filter(i => i)
          checkURL({
            url: /^http/.test(links[links.length - 1])
              ? links[links.length - 1]
              : url.replace(/[\d\w-]+\.[\d\w-]+$/g, links[links.length - 1]),
            orig: url,
          })
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
                  onClick={ () => checkURL({ url : current === listItem.src ? `` : listItem.src }) }
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
