export function saveSettings(settings) {
  function callback(_, data) {

    for (const key in settings) {
      data[key] = settings[key]
    }

    global.storage.set(`settings`, data)
  }

  global.storage.get(`settings`, callback)
}
