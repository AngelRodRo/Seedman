"use strict";

const {findPropValue, generateFkId, getPropertiesFlattened} = require("./utils");

class Bale {
    constructor() {
        this.seeds = [];
        this.excludes = [];
        this.dbDriver = {};
        this.use = this.use.bind(this);
    }

    connect({driver = "mongo", ...connectionArgs}) {
        const DBDriver = require(`./drivers/${driver.toLowerCase()}`);
        this.dbDriver = new DBDriver({driver, ...connectionArgs});
        return this.dbDriver.connect().catch(this.dbDriver.errorHandler);
    }

    use(seed) {
        this.seeds.push(seed);
    }
    createFakeData(properties) {
        const data = {};
        for (const property in properties) {
            if (properties.hasOwnProperty(property)) {
                const value = properties[property];
                data[property] = findPropValue(property, value);
            }
        }   
        return data;
    }

    createSeed({name, type, count}) {
        const seedFind = this.seeds.find(seed => seed.name === name);
        if (seedFind) {
            const seed = Object.assign({}, seedFind);
            switch(type) {
                case "hasOne":
                    seed.count = 1;
                    break;
                case "hasMany":
                    seed.count = count > 1 ? count : 2;
                    break;
            }
            return seed;
        }
        return;
    }

    async analyzeSeed(seed, relationModel) {
        for (let i = 0; i < (seed.count || 0); i++) {
            const {properties, relations} = getPropertiesFlattened(seed.properties);
            const data = this.createFakeData(properties);

            if (relationModel && relationModel.fkId) {
                data[relationModel.fkId] = relationModel.modelId;
            }
            debugger
            const model = await this.dbDriver.insert(seed.name, data);
            const modelId = model.insertedIds[0];
            for (const relation of relations) {
                const createdSeed = this.createSeed(relation);
                if (createdSeed) {
                    await this.analyzeSeed(createdSeed,  {
                        fkId: relation.fkId || generateFkId(seed.name),
                        modelId
                    });
                }
            }
        }
    }
    
    async run() {
        let completed = 0;

        for (const seed of this.seeds) {
            if (!seed.name || seed.name === "") {
                console.log(`Need to define a name for seed in ${seed.file}`.yellow);
                continue;
            }
    
            if (!seed.properties || seed.properties === "") {
                console.log(`Need to define properties for seed in ${seed.file}`.yellow);
                continue;
            }
            await this.analyzeSeed(seed);
            completed++;
        }
        return completed !== 0;
    }
}

module.exports = Bale;