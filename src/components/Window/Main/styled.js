import styled from 'styled-components'

import { Image } from '../../common'

export const Wrapper = styled.div`
width: 100%;
height: 115px;
overflow: hidden;
display: grid;
grid-template: 115px / 240px auto 83px;
`

export const PrimaryImage = Image(`primaryBackground`)
export const SecondaryImage = Image(`secondaryBackground`)
