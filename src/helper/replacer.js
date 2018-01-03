export default class Replacer {
  static replace(source, parameters) {
    const keys = Object.keys(parameters)
    if (keys.length > 0) {
      keys.forEach(key => source = source.replace('{{' + key + '}}', parameters[key]))
    }

    return source
  }
}
