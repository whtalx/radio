import { connect } from 'react-redux'
import Window from './component'

const mapState = ({ list: { visible }}) => ({ list: visible })

export default connect(mapState)(Window)
