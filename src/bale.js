"use strict";

const {findPropValue} = require("./utils");

class Bale {
    constructor() {
        this.seeders = [];
        this.dbDriver = {};

        this.use = this.use.bind(this);
    }

    connect({driver = "postgres", ...connectionArgs}) {
        const DBDriver = require(`./drivers/${driver.toLowerCase()}`);
        this.dbDriver = new DBDriver({driver, ...connectionArgs});
        return this.dbDriver.connect().catch(this.dbDriver.errorHandler);
    }

    use(seeder) {
        this.seeders.push(seeder);
    }
    
    async run() {
        let completed = 0;
        for (const seeder of this.seeders) {
            if (!seeder.name || seeder.name === "") {
                console.log(`Need to define a name for seed in ${seeder.file}`.yellow);
                continue;
            }

            if (!seeder.properties || seeder.properties === "") {
                console.log(`Need to define properties for seed in ${seeder.file}`.yellow);
                continue;
            }

            for (let i = 0; i < seeder.count; i++) {
                const data = {};
                
                for (const property in seeder.properties) {
                    if (property !== "") {
                        if (seeder.properties.hasOwnProperty(property)) {
                            data[property] = findPropValue(property, seeder.properties[property]);
                        }
                    }
                }   
                debugger
                try {
                    await this.dbDriver.insert(seeder.name, data);
                } catch (e) {
                    debugger
                }
            }
            completed++;
        }
        return completed !== 0;
    }

}

module.exports = Bale;