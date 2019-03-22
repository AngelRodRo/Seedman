"use strict";

const {findPropValue, generateFkId, getPropertiesFlattened} = require("./utils");

class Bale {
    constructor() {
        this.seeds = [];
        this.excludes = [];
        this.dbDriver = {};
        this.use = this.use.bind(this);
    }

    /**
     * Create a new connection with db driver
     * @param {Object} config - Driver configuration
     * @param {string} config.driver - Driver name (Mongo, Postgress, SQL)
     * @param {string} config.user - DB user
     * @param {string} config.password - DB password
     * @param {string} config.host - DB host
     * @param {string} config.port - DB port
     * @param {string} config.dbname - DB name
    */

    connect({driver = "mongo", ...connectionArgs}) {
        const DBDriver = require(`./drivers/${driver.toLowerCase()}`);
        this.dbDriver = new DBDriver({driver, ...connectionArgs});
        return this.dbDriver.connect().catch(this.dbDriver.errorHandler);
    }

    /**
     * Add seed to bale seeder
     * @param {Object} seed - Seed configuration
    */
    use(seed) {
        this.seeds.push(seed);
    }

    /**
     * Create contextual fake data from model properties
     * @param {Object} properties - Model's properties
    */
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

    /**
     * Create a new seed config using a existing seed.
     * @param {Object} seed - Seed model.
     * @param {string} seed.name - The name of the model.
     * @param {string} seed.type - Model relation's type.
     * @param {string} seed.count - Record's amount to generate.
     */
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

    /**
     * Create a new seed config using a existed seed.
     * @param {Object} seed - Seed model.
     * @param {Object} relationModel - Model relation.
     * @param {Object} relationModel.fkId - Model foreign key id.
     * @param {Object} relationModel.modelId - Model relation id.
     */

    async analyzeSeed(seed, relationModel) {
        for (let i = 0; i < (seed.count || 0); i++) {
            const {properties, relations} = getPropertiesFlattened(seed.properties);
            const data = this.createFakeData(properties);

            if (relationModel && relationModel.fkId) {
                data[relationModel.fkId] = relationModel.modelId;
            }
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