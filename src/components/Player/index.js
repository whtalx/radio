import { connect } from 'react-redux'
import Player from './component'
import { listToggle, updateStation } from '../../actions/list'
import { setPlaying, setState } from '../../actions/player'

const mapState = ({ list, player }) => ({ list, player })
const mapDispatch = (dispatch) => ({
  listToggle: () => dispatch(listToggle()),
  setStation: station => dispatch(updateStation(station)),
  setState: state => dispatch(setState(state)),
  setPlaying: station => dispatch(setPlaying(station)),
})

export default connect(mapState, mapDispatch)(Player)