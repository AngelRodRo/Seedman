"use strict";

const {findPropValue} = require("./utils");

class Bale {
    constructor() {
        this.seeders = [];
        this.dbDriver = {};

        this.use = this.use.bind(this);
    }

    connect({driver = "mongo", ...connectionArgs}) {
        const DBDriver = require(`./drivers/${driver.toLowerCase()}`);
        this.dbDriver = new DBDriver({driver, ...connectionArgs});
        return this.dbDriver.connect().catch(this.dbDriver.errorHandler);
    }

    use(seeder) {
        this.seeders.push(seeder);
    }
    
    async run() {
        for (const seeder of this.seeders) {
            for (let i = 0; i < seeder.count; i++) {
                const data = {};
                for (const property in seeder.properties) {
                    if (seeder.properties.hasOwnProperty(property)) {
                        data[property] = findPropValue(property, seeder.properties[property]);
                    }
                }   

                await this.dbDriver.insert(seeder.name, data);
            }
        }
    }

}

module.exports = Bale;