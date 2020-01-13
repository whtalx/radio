import Header from './component'
import { connect } from 'react-redux'

import { show, historyBack, historyForward, favouritesToggle, } from '../../actions/list'

const mapState = ({ list }) => ({ list })
const mapDispatch = (dispatch) => ({
  show: (list) => dispatch(show(list)),
  back: () => dispatch(historyBack()),
  forward: () => dispatch(historyForward()),
  favouritesToggle: () => dispatch(favouritesToggle()),
})

export default connect(mapState, mapDispatch)(Header)
