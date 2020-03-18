import { countries } from '.'

export function navProps(type, callback, search = {}) {
  const props = {
    key: type,
    onClick: () => callback(type),
  }

  switch (type) {
    case `start`: {
      props.children = `stations`
      return props
    }

    case `countrycodes`: {
      props.children = `from`
      return props
    }

    case `languages`: {
      props.children = `in`
      return props
    }

    case `tags`: {
      props.children = `tagged`
      return props
    }

    case `stations`: {
      const { countrycode, language, tag } = search
      if (countrycode) {
        const { name, orig } = countries(countrycode)
        props.title = orig
        props.children = name
      } else if (tag) {
        props.children = `#${ tag }`
      } else if (language) {
        props.children = language
      }

      return props
    }

    default:
      return props
  }
}