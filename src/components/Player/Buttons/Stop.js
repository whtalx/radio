import styled from 'styled-components'

import { Background, Icon, RoundButton } from './styled'

export const Stop = styled(RoundButton)`
  left: 65px;
  top: 79px;

  ${ Icon },
  ${ Background } {
    left: -27px;
  }

  :active {
    ${ Icon } {
      left: -26px;
      top: 1px;
    }

    ${ Background } {
      top: -27px;
    }
  }
`
