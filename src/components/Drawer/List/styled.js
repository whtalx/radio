import styled from 'styled-components'

import { filter } from '../../../functions'

import dot from '../../common/images/dot.png'

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 12px;
  z-index: 1;
  border-color: black;
  border-style: solid;
  border-width: 1px 0 0 1px;
  display: flex;
  isolation: isolate!important;

  :before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
    background: url(${ dot }) 2px 2px;
    ${ filter(`displayBackground`) };
  }
`

export const Container = styled.div`
  margin-right: -50px;
  padding-right: 50px;
  height: 100%;
  flex-grow: 1;
  display: flex;
  overflow: hidden scroll;
`

export const UL = styled.ul`
  padding: .2em;
  width: 100%;
  height: fit-content;
  list-style: none;

  li {
    width: 100%;
    height: 1.6em;
    line-height: 1.6em;
    text-indent: .2em;
    color: ${ ({ theme: { list } }) => list?.text || `#FFF` };
  }

  label {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  input:checked + label {
    background-color: ${ ({ theme: { list } }) => list?.selected || `#6687C8` };
  }
`
