import styled from 'styled-components'

const source = (code) =>
  `/images/flags/${ code.toLowerCase() }.svg`

export default styled.img.attrs((props) => ({
  src: source(props.code),
  alt: props.code,
}))`
  height: 1em;
  transition: transform .3s;

  :hover {
    transform: scale(2.5);
    transition: transform .3s 1s;
  }
`
