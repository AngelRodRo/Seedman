"use strict";

const {findPropValue} = require("./utils");

class Bale {
    constructor({seedsPath}) {
        this.seeders = [];
        this.excludes = [];
        this.dbDriver = {};
        this.seedsPath = seedsPath;
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

    //393788542 movistar code
    createFakeData(properties) {
        const data = {};
        const relations = [];
        for (const property in properties) {
            if (properties.hasOwnProperty(property)) {
                const value = properties[property];
                if (typeof value === "object") {
                    if (value.type === "model") {
                        if (["hasOne", "hasMany"].includes(value.relation)) {
                            relations.push({
                                name: property,
                                type: value.relation,
                                count: value.count
                            });
                        }
                    }
                } else {
                    data[property] = findPropValue(property, value);
                }
            }
        }   
        return {
            data,
            relations
        };
    }

    createSeed({name, type, count}) {
        const seed = require(`${this.seedsPath}/${name}`);
        if (type === "hasOne") {
            seed.count = 1;
        }

        if (type === "hasMany") {
            seed.count = 5;
        }
        return seed;
    }

    async analyzeSeed(seed, relationModel) {
        for (let i = 0; i < (seed.count || 0); i++) {
            const {data, relations} = this.createFakeData(seed.properties);
            if (relationModel && relationModel.fkId) {
                data[relationModel.fkId] = relationModel.modelId;
            }
            if (seed.name === "Post") {
                console.log(data)
            }
            const model = await this.dbDriver.insert(seed.name, data);
            const modelId = model.insertedIds[0];
            for (const relation of relations) {
                await this.analyzeSeed(this.createSeed(relation),  {
                    fkId: relation.fkId || `${seed.name.toLowerCase()}Id`,
                    modelId
                });
            }
        }
    }
    
    async run() {
        for (const seed of this.seeders) {
            await this.analyzeSeed(seed);
        }
    }

}

module.exports = Bale;