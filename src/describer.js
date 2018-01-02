export default class Describer {
    constructor(describer = {}) {
        this._spec = {}
        this._auth = {}
        this._env = {}

        if (typeof describer['spec'] !== 'undefined') {
            this.register('spec', describer['spec'])
        }
        if (typeof describer['auth'] !== 'undefined') {
            this.register('auth', describer['auth'])
        }
        if (typeof describer['env'] !== 'undefined') {
            this.register('env', describer['env'])
        }
    }

    register(type, ...args) {
        switch (type) {
            case 'spec':
                if (args.length === 1 && Array.isArray(args[0])) {
                    Object.keys(args[0]).forEach(key => this.register('spec', key, args[0][key]))
                } else if (args.length === 2) {
                    this._spec[args[0]] = args[1]
                }
                break
            case 'auth':
                if (args.length === 1 && Array.isArray(args[0])) {
                    Object.keys(args[0]).forEach(key => this.register('auth', key, args[0][key]))
                } else if (args.length === 2) {
                    this._auth[args[0]] = args[1]
                }
                break
            case 'env':
                if (args.length === 1 && Array.isArray(args[0])) {
                    Object.keys(args[0]).forEach(key => this.register('env', key, args[0][key]))
                } else if (args.length === 2) {
                    this._env[args[0]] = args[1]
                }
                break
            default:
                break
        }

        return this
    }

    remove(type, ...args) {
        switch (type) {
            case 'spec':
                if (!args.length) {
                    this._spec = {}
                } else {
                    args.forEach(key => delete this._spec[key])
                }
                break
            case 'auth':
                if (!args.length) {
                    this._auth = {}
                } else {
                    args.forEach(key => delete this._auth[key])
                }
                break
            case 'env':
                if (!args.length) {
                    this._env = {}
                } else {
                    args.forEach(key => delete this._env[key])
                }
                break
            default:
                break
        }
    }
}