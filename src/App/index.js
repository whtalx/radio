import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Visualization from './components/Visualization'
import request from './functions/request'
import getStations from './functions/getStations'
import makeEndpoint from './functions/makeEndpoint'
import error from './functions/error'
import List from './components/List'
// import getURL from './functions/getURL'

const App = ({
  api,
  setCountryCodes,
  setLanguages,
  setStations,
  setTags,
}) => {
  // const select = (id) =>
  //   getURL(
  //     makeEndpoint({
  //       server: params.server,
  //       type: `url/${ id }`,
  //     })
  //   ).then(setCurrent)

  useEffect(
    () => {
      switch (api.type) {
        case `stations`: {
          getStations(makeEndpoint(api))
            .then(setStations)
            .catch(error)
          return
        }

        case `countrycodes`: {
          request(makeEndpoint(api))
            .then((data) => {
              setCountryCodes(
                data.map(
                  (item) => ({
                    ...item,
                    action: {
                      type: `SET_ALL`,
                      payload: {
                        type: `stations`,
                        search: {
                          countrycode: item.name,
                          hidebroken: true,
                        },
                      }
                    }
                  })
                )
              )
            })
            .catch(error)

          return
        }

        case `languages`: {
          request(makeEndpoint(api))
            .then((data) => {
              setLanguages(
                data.map(
                  (item) => ({
                    ...item,
                    action: {
                      type: `SET_ALL`,
                      payload: {
                        type: `stations`,
                        search: {
                          language: item.name,
                          languageExact: true,
                          hidebroken: true,
                        },
                      }
                    }
                  })
                )
              )
            })
            .catch(error)

          return
        }

        case `tags`: {
          request(makeEndpoint(api))
            .then((data) => {
              setTags(
                data.map(
                  (item) => ({
                    ...item,
                    action: {
                      type: `SET_ALL`,
                      payload: {
                        type: `stations`,
                        search: {
                          tag: item.name,
                          tagExact: true,
                          hidebroken: true,
                        },
                      }
                    }
                  })
                )
              )
            })
            .catch(error)

          return
        }

        default:
          return
      }
    },// eslint-disable-next-line
    [api.type]
  )

  return (
    <div>
      <Visualization />
      <List />
    </div>
  )
}

const mapStateToProps = ({ api }) => ({ api });
const mapDispatchToProps = (dispatch) => ({
  setCountryCodes: (payload) => dispatch({ type: `SET_COUNTRY_CODES`, payload }),
  setLanguages: (payload) => dispatch({ type: `SET_LANGUAGES`, payload }),
  setStations: (payload) => dispatch({ type: `SET_STATIONS`, payload }),
  setTags: (payload) => dispatch({ type: `SET_TAGS`, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App)
