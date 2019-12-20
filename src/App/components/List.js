import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import Flag from './Flag'
import sniff from '../functions/sniff'
import countries from '../functions/iso3166-1-alpha-2'

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
  list,
  dispatch,
  setStation,
}) => {
  const [current, setCurrent] = useState(``)
  const [controller, setController] = useState(null)

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
                  _________
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
  )
}

const mapStateToProps = ({ list }) => ({ list });
const mapDispatchToProps = (dispatch) => ({
  dispatch: action => dispatch(action),
  setStation: payload => dispatch({ type: `SET_STATION`, payload })
});

export default connect(mapStateToProps, mapDispatchToProps)(List)
