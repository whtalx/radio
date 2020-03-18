function query(props) {
  return encodeURI([
    `search`,
    [...Array(Object.keys(props).length).keys()].reduce(
      (a, i) =>
        props[Object.keys(props)[i]]
          ? [...a, `${Object.keys(props)[i]}=${Object.values(props)[i]}`]
          : a,
      []
    ).join(`&`)
  ].join(`?`)).replace(/#/g, `%23`)
}

export function makeEndpoint({
  protocol = `https:/`,
  server = `de1.api.radio-browser.info`,
  data = `json`,
  type,
  search,
}) {
  return [
    protocol,
    server,
    data,
    type,
    search && query(search),
  ].join(`/`).replace(/[/]+$/g, ``)
}
