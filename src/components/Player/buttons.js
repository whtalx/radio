import React from 'react'
import styled from 'styled-components'

import { ReactComponent as PreviousIcon } from '../../icons/previous.svg'
import { ReactComponent as ExportIcon } from '../../icons/export.svg'
import { ReactComponent as EjectIcon } from '../../icons/eject.svg'
import { ReactComponent as NextIcon } from '../../icons/next.svg'
import { ReactComponent as PlayIcon } from '../../icons/play.svg'
import { ReactComponent as StopIcon } from '../../icons/stop.svg'
import { Button } from './styled'

const Big = styled(Button)`
  width: 22px;
  height: 18px;

  :not(:first-child) {
    border-left: 1px solid hsl(210, 50%, 6%);
  }

  svg {
    left: 6px;
    top: 4px;
  }

  :active svg {
    left: 7px;
    top: 5px;
  }
`

export const Previous = ({ onClick }) =>
  <Big onClick={ onClick }>
    <PreviousIcon />
  </Big>

export const Next = ({ onClick }) =>
  <Big onClick={ onClick }>
    <NextIcon />
  </Big>

export const Play = ({ onClick }) =>
  <Big onClick={ onClick }>
    <PlayIcon />
  </Big>

export const Stop = ({ onClick }) =>
  <Big onClick={ onClick }>
    <StopIcon />
  </Big>

const Standalone = styled(Button)`
  margin-top: 1px;
  width: 22px;
  height: 16px;

  svg {
    left: 5px;
    top: 3px;
  }

  :active svg {
    left: 6px;
    top: 4px;
  }
`

const EjectButton = styled(Standalone)`
  margin-left: 6px;
`

export const Eject = ({ onClick }) =>
  <EjectButton onClick={ onClick } title="Open playlist">
    <EjectIcon />
  </EjectButton>

const ExportButton = styled(Standalone)`
  margin-right: 6px;
`

export const Export = ({ onClick }) =>
  <ExportButton onClick={ onClick } title="Export current station as playlist">
    <ExportIcon />
  </ExportButton>
