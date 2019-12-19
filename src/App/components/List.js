import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import { v4 } from 'uuid'
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
  const [current, setCurrent] = useState(player.station)
  useEffect(
    () => {
      controller && controller.abort()
      controller = null
      setCurrent(player.station)
    },
    [player.station]
  )

  const checkURL = (url) => {
    controller && controller.abort()
    controller = new AbortController()
    controller.signal.onabort = () => { console.log(`aborted`) }

    fetch(url, { signal: controller.signal })
      .then((response) => {
        const type = response.headers.get(`content-type`)
        console.log(type, url)

        if (
          !type ||
          type.split(`/`)[0] === `audio` ||
          type === `application/ogg`
        ) {
          setStation(url)
          return null
        } else if(/text\/html/.test(type)) {
          if (/index\.html\?sid=1/.test(response.url)) {
            console.log(response.url, `recursive call`)
            checkURL(response.url.replace(/index\.html\?sid=1/, ';'))
          }

          return null
        } else {
          return response.blob()
        }
      })
      .then(blob => blob ? blob.text() : null)
      .then(text => {
        if (!text) return null

        console.log(`parsing`, text)

        if (/http\S+/g.test(text)) {
          console.log(`recursive call`)
          checkURL(text.match(/http\S+/g)[0])
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
                  key={ v4() }
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
                  key={ listItem.stationuuid }
                  active={ current === listItem.src }
                  onClick={ () => current === listItem.src ? setStation(``) : checkURL(listItem.src) }
                >
                  { listItem.name }
                </Li>
              )

            default:
              return (
                <Li key={ v4() } onClick={ () => dispatch(listItem.action) }>
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
  dispatch: (action) => dispatch(action),
  setStation: (payload) => dispatch({ type: `SET_STATION`, payload })
});

export default connect(mapStateToProps, mapDispatchToProps)(List)


/*

      <List>
        {
          stations.length > 0
            ? stations.map(({ stationuuid, name, src }) =>
              <Label key={ stationuuid } playing={ src === current } onClick={ () => current === src ? setCurrent(null) : setCurrent(src) }>
                { name }
              </Label>
            )
            : list.map(({ id, name, onClick }) =>
              <Label key={ id } onClick={ onClick }>
                {
                  lastType === `countrycodes`
                  ? <p key={ v4() } title={ countries(name).orig }>
                    <Flag code={ countries(name).flag ? countries(name).flag : name } />
                    { `\t${ countries(name).name }` }
                  </p>
                  : name
                }
              </Label>
            )
        }
      </List>
 */
