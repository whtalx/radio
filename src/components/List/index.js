import { connect } from 'react-redux'
import List from './component'
import {
  setList,
  updateStation,
  setTagsList,
  setLanguagesList,
  setCountryCodesList,
  favouritesAdd,
  favouritesRemove
} from '../../actions/list'
import { setType } from '../../actions/api'
import { setPlaying } from '../../actions/player'
import { setApi, setStationsList } from '../../actions/common'

const mapState = ({ api, list, player }) => ({ api, list, player })
const mapDispatch = (dispatch) => ({
  setApi: payload => dispatch(setApi(payload)),
  setType: type => dispatch(setType(type)),
  setList: state => dispatch(setList(state)),
  setStation: station => dispatch(updateStation(station)),
  setTags: tags => dispatch(setTagsList(tags)),
  setStations: stations => dispatch(setStationsList(stations)),
  setLanguages: languages => dispatch(setLanguagesList(languages)),
  setCountryCodes: countryCodes => dispatch(setCountryCodesList(countryCodes)),
  favouritesAdd: station => dispatch(favouritesAdd(station)),
  favouritesRemove: station => dispatch(favouritesRemove(station)),
  setPlaying,
})

export default connect(mapState, mapDispatch)(List)
