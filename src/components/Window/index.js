import { connect } from 'react-redux'
import Window from './component'
import { listToggle } from '../../actions/list'

const mapState = ({ list: { visible }}) => ({ list: visible })
const mapDispatch = (dispatch) => ({
  listToggle: () => dispatch(listToggle()),
})

export default connect(mapState, mapDispatch)(Window)
