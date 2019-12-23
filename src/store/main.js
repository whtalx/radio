import storage from 'electron-json-storage'
import { createStore } from 'redux'
import { electronEnhancer } from 'redux-electron-store'
import reducers from './reducers'

const initialList = {
  show: `start`,
  history: [`start`],
  lastSearch: {},
  countrycodes: [],
  languages: [],
  tags: [],
  stations: [],
  start: [
    {
      name: `by countries`,
      action: {
        type: `SET_TYPE`,
        payload: `countrycodes`,
      },
    },
    {
      name: `by languages`,
      action: {
        type: `SET_TYPE`,
        payload: `languages`,
      },
    },
    {
      name: `by tags`,
      action: {
        type: `SET_TYPE`,
        payload: `tags`,
      },
    },
  ],
}

const defaultStore = () => {
  const api = {
    protocol: `https:/`,
    server: `de1.api.radio-browser.info`,
    data: `json`,
    type: null,
    search: null,
  }

  const player = {
    station: {},
  }

  let list = {}
  storage.get(`list`, (error, data) => {
    list = !data.show ? initialList : data
  })

  return {
    api,
    list,
    player
  }
}

export default createStore(reducers, defaultStore(), electronEnhancer())
