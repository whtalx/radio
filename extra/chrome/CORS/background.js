/*const prefs = {
  enabled: false,
}

const cors = {}

cors.onHeadersReceived = ({ responseHeaders }) => ({
  responseHeaders: responseHeaders.reduce(
    (headers, item) => /acces/i.test(item.name)
      ? headers
      : [...headers, item],
    [
      { name: `Access-Control-Allow-Headers`, value: `Origin, Accept, X-Requested-With, Content-Type` },
      { name: `Access-Control-Allow-Methods`, value: `GET` },
      { name: `Access-Control-Allow-Origin`, value: `*` },
    ]
  )
})

cors.install = () => {
  cors.remove()

  chrome.webRequest.onHeadersReceived.addListener(
    cors.onHeadersReceived,
    {
      urls: ['<all_urls>'],
    },
    ['blocking', 'responseHeaders']
  )
}

cors.remove = () => {
  chrome.webRequest.onHeadersReceived.removeListener(cors.onHeadersReceived)
}

cors.onCommand = () => {
  prefs.enabled
    ? cors.install()
    : cors.remove()

  chrome.browserAction.setIcon({
    path: {
      '16': `icons/${ prefs.enabled ? `` : `disabled/` }16.png`,
      '19': `icons/${ prefs.enabled ? `` : `disabled/` }19.png`,
      '32': `icons/${ prefs.enabled ? `` : `disabled/` }32.png`,
      '38': `icons/${ prefs.enabled ? `` : `disabled/` }38.png`,
      '48': `icons/${ prefs.enabled ? `` : `disabled/` }48.png`,
      '64': `icons/${ prefs.enabled ? `` : `disabled/` }64.png`,
      '128': `icons/${ prefs.enabled ? `` : `disabled/` }128.png`,
    }
  })

  chrome.browserAction.setTitle({
    title: prefs.enabled ? 'enabled' : 'disabled',
  })
}

chrome.storage.onChanged.addListener((ps) => {
  Object.keys(ps).forEach(name => prefs[name] = ps[name].newValue);
  cors.onCommand()
})

chrome.browserAction.onClicked.addListener(() =>
  chrome.storage.local.set({
    enabled: !prefs.enabled,
  })
)

chrome.storage.local.get(
  prefs,
  (ps) => {
    Object.assign(prefs, ps);
    cors.onCommand()
  }
)*/

chrome.webRequest.onHeadersReceived.addListener(
  ({ responseHeaders }) => {
    responseHeaders = responseHeaders.filter((header) => {
      header.name.toLowerCase() !== `access-control-allow-origin`
    })
    responseHeaders.push({
      name: `Access-Control-Allow-Origin`, value: `*`
    })
    return { responseHeaders }
  },
  {
    urls: [`<all_urls>`],
    types: [`xmlhttprequest`,`media`],
  },
  [`blocking`, `responseHeaders`]
)
