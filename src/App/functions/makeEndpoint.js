const query = (props) =>
  [
    `search`,
    [...Array(Object.keys(props).length).keys()].reduce(
      (a, i) =>
        typeof props[Object.keys(props)[i]] !== `undefined` && props[Object.keys(props)[i]] !== null
          ? [...a, `${ Object.keys(props)[i] }=${ Object.values(props)[i] }`]
          : a,
      []
    ).join(`&`)
  ].join(`?`)

export default ({
  protocol = `https:/`,
  server = `de1.api.radio-browser.info`,
  data = `json`,
  type,
  search,
}) =>
  [
    protocol,
    server,
    data,
    type,
    search && query(search),
  ].join(`/`).replace(/[/]+$/g, ``)
