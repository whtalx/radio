const query = (props) =>
  [
    `search`,
    [...Array(Object.keys(props).length).keys()].map((i) =>
      `${ Object.keys(props)[i] }=${ Object.values(props)[i] }`
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
