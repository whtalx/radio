import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import List from './components/List'
import Header from './components/Header'
import Visualization from './components/Visualization'
import getCountryCodes from './functions/getCountryCodes'
import getLanguages from './functions/getLanguages'
import getStations from './functions/getStations'
import getTags from './functions/getTags'
import request from './functions/request'

const App = ({
  api,
  setCountryCodes,
  setLanguages,
  setStations,
  setTags,
}) => {
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

  return (
    <div>
      <Header />
      <Visualization />
      <List />
    </div>
  )
}

const mapStateToProps = ({ api }) => ({ api })
const mapDispatchToProps = (dispatch) => ({
  setCountryCodes: payload => dispatch({ type: `SET_COUNTRY_CODES`, payload }),
  setLanguages: payload => dispatch({ type: `SET_LANGUAGES`, payload }),
  setStations: payload => dispatch({ type: `SET_STATIONS`, payload }),
  setTags: payload => dispatch({ type: `SET_TAGS`, payload }),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
