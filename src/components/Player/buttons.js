import React from 'react'
import styled from 'styled-components'
import { Button } from './styled'

const Big = styled(Button)`
  width: 22px;
  height: 18px;

  &:not(:first-child) {
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

const Standalone = styled(Button)`
  margin: 1px 6px;
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


export const Previous = ({ onClick }) =>
  <Big onClick={ onClick }>
    <svg width="10px" height="10px" viewBox="0 0 10 10">
      <path className="light" d="M2 9V1H3V10H0V9H2ZM9 1H10V10H8V9H7V8H6V7H5V6H4V5H5V6H6V7H7V8H8V9H9V1Z" />
      <path className="shadow" d="M7 2H8V3H7V4H6V5H5V4H6V3H7V2Z" />
      <path className="dark" d="M1 9H0V0H3V1H1V9ZM5 5H4V4H5V3H6V2H7V1H8V0H10V1H8V2H7V3H6V4H5V5Z" />
      <path className="fill" d="M2 1H1V9H2V1ZM6 5H5V6H6V7H7V8H8V9H9V1H8V3H7V4H6V5Z" />
    </svg>
  </Big>

export const Next = ({ onClick }) =>
  <Big onClick={ onClick }>
    <svg width="10" height="10" viewBox="0 0 10 10">
      <path className="light" d="M9 9V1H10V10H7V9H9ZM2 10H0V9H2V8H3V7H4V6H5V5H6V6H5V7H4V8H3V9H2V10Z" />
      <path className="shadow" d="M3 3H2V2H1V1H2V2H3V3H4V4H5V5H4V4H3V3Z" />
      <path className="dark" d="M8 9H7V0H10V1H8V9ZM6 5H5V4H4V3H3V2H2V1H1V9H0V0H2V1H3V2H4V3H5V4H6V5Z" />
      <path className="fill" d="M9 1H8V9H9V1ZM4 5H5V6H4V7H3V8H2V9H1V2H2V3H3V4H4V5Z" />
    </svg>
  </Big>

export const Play = ({ onClick }) =>
  <Big onClick={ onClick }>
    <svg width="10" height="10" viewBox="0 0 10 10">
      <path className="fill" d="M4 8H2V9H1V8H2V7L4 7V6H6V5H8V6H6V7L4 7V8Z" />
      <path className="fill-dark" d="M2 1H1V2H2V1ZM4 2H3V3H4V2ZM6 3H5V4H6V3ZM8 4H7V5H8V4Z" />
      <path className="shadow" d="M6 6V5L7 4.99997V4H5V3H3V2H1V8H2V7H4V6H6Z" />
      <path className="light" d="M2 10H0V9H2V8H4V7H6V6H8V5H10V6H8V7H6V8H4V9H2V10Z" />
      <path className="dark" d="M10 5H8V4H6V3H4V2H2V1H1V9H0V0H2V1H4V2H6V3H8V4H10V5Z" />
    </svg>
  </Big>

export const Stop = ({ onClick }) =>
  <Big onClick={ onClick }>
    <svg width="10" height="10" viewBox="0 0 10 10">
      <path className="fill" d="M1 9V1H9V9H1Z" />
      <path className="light" d="M0 10H10V1H9V9H0V10Z" />
      <path className="dark" d="M2 0H10V1H1V9H0V0H2Z" />
    </svg>
  </Big>

export const Eject = ({ onClick }) =>
  <Standalone onClick={ onClick }>
    <svg width="11" height="10" viewBox="0 0 11 10">
      <path className="fill" d="M1 9V8H2V9H1ZM10 8V9H9V8H10ZM9 4V5H8V4H7V3H6V2H7V3H8V4H9Z" />
      <path className="fill-dark" d="M11 7H0V9H1V8H11V7Z" />
      <path className="shadow" d="M2 4V5H8V4H7V3L6 3V1H5V2H4V3H3V4H2ZM9 8H2V9H9V8Z" />
      <path className="light" d="M0 10H11V8H10V9H0V10ZM11 5H0V6H11V5Z" />
      <path className="dark" d="M9 3V4H10V5H9V4H8V3H7V2H6V1H5V2H4V3H3V4H2V5H1V4H2V3H3V2H4V1H5V0H6V1H7V2H8V3H9Z" />
    </svg>
  </Standalone>
