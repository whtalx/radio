import styled from 'styled-components'

import { Background, Icon, RoundButton } from './styled'

export const Play = styled(RoundButton)`
  left: 34px;
  top: 79px;

  :active {
    ${ Icon } {
      left: 1px;
      top: 1px;
    }

    ${ Background } {
      top: -27px;
    }
  }
`
