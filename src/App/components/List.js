import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import { v4 } from 'uuid'
import countries from '../functions/iso3166-1-alpha-2'
import Flag from './Flag'
import error from "../functions/error"

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

const List = ({
  list,
  player,
  dispatch,
  setStation,
}) => {
  const [current, setCurrent] = useState(player.station)
  useEffect(
    () => {
      setCurrent(player.station)
    },
    [player.station]
  )

  const checkURL = (url) => {
    if (url === player.station) {
      setStation(``)
      return
    }

    const controller = new AbortController()

    fetch(url, { signal: controller.signal })
      .then((response) => {
        const type = response.headers.get(`content-type`)
        console.log(type, url)

        if (
          type.split(`/`)[0] === `audio` ||
          type === `application/ogg`
        ) {
          setStation(url)
          controller.abort()          // throw new Error(`it's OK`)
        } else if(/text\/html/.test(type)) {
          if (/index\.html\?sid=1/.test(response.url)) {
            console.log(response.url, `recursive call`)
            checkURL(response.url.replace(/index\.html\?sid=1/, ';'))
          }

          controller.abort()
        } else {
          return response.body
        }
      })
      .then(body => {
        const reader = body.getReader();

        return new ReadableStream({
          start(controller) {
            return pump()

            function pump() {
              return reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close()
                  return;
                }

                controller.enqueue(value)
                return pump()
              })
            }
          }
        })
      })
      .then(stream => new Response(stream))
      .then(response => response.blob())
      .then(blob => blob.text())
      .then(response => {
        if (/http\S+/g.test(response)) {
          console.log(response, `recursive call`)
          checkURL(response.match(/http\S+/g)[0])
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
                  onClick={ () => checkURL(listItem.src) }
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
