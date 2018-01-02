import Describer from './describer'

export default class Client {
    constructor(describer = {}) {
        if (describer instanceof Describer) {
            this.describer = describer
        } else {
            this.describer = new Describer(describer)
        }
    }

    get() {
        
    }
}