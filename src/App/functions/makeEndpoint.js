const protocol = `https:/`

const servers = [
  `nl1.api.radio-browser.info`,
  `de2.api.radio-browser.info`,
  `fr1.api.radio-browser.info`,
  `de1.api.radio-browser.info`,
  `nl1.api.radio-browser.info`,
  `fr1.api.radio-browser.info`,
  `de1.api.radio-browser.info`,
  `de2.api.radio-browser.info`,
]

const data = `json`

const type = `stations`

const query = `search`

export default (props) =>
  [
    [
      protocol,
      servers[2],
      data,
      type,
      query,
    ].join(`/`),
    [...Array(Object.keys(props).length).keys()].map((i) =>
    `${ Object.keys(props)[i] }=${ Object.values(props)[i] }`
    ).join(`&`),
  ].join(`?`)
