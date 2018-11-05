import path from 'path'
import fs from 'fs'

export default class Mock {
  constructor(options = {}) {
    this.options = Object.assign({
      dir: null
    }, options)
  }

  /**
   * Execute Mock's request
   * @param {string} name
   * @param {?Object} parameters
   * @returns {Promise<any>}
   */
  execute(name, parameters = {}) {
    const self = this;
    return new Promise(function(resolve, reject) {
      if (!self.validate()) {
        reject(new Error("Mock's configuration is incorrect."))
      }

      const file = self.locate(name, parameters)
      fs.readFile(file, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve({
            status: 200,
            data: JSON.parse(data)
          })
        }
      })
    })
  }

  /**
   * Get options's value
   * @param {string} key
   * @param {?*} def
   * @returns {*}
   */
  get(key, def = null) {
    return typeof this.options[key] !== 'undefined' ? this.options[key] : def
  }

  /**
   * Validate options
   * @returns {boolean}
   */
  validate() {
    if (this.get('dir') === null) {
      return false;
    }

    return true;
  }

  /**
   * Locate mock's json file
   * @param {string} name
   * @param {?Object} parameters
   * @returns {string}
   */
  locate(name, parameters = {}) {
    const dir = this.get('dir');
    return path.resolve(dir, `${name}.json`);
  }
}
