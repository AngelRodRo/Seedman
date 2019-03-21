const {expect} = require("chai");
const Bale = require("../../src/bale");

const {generateFkId, getPropertiesFlattened} = require("../../src/utils");


//TODO: Close db connection after all operations

describe("bale", () => {
    let bale;

    beforeEach(() => {
        bale = new Bale({});
    });

    afterEach(() => {
        bale.seeders = [];
    });

    
    describe("seeder fn", () => {        
        it("should add a seeder", () => {
            const seed = {
                name: "",
                properties: {},
                count: 0
            };
            bale.use(seed);
            expect(bale.seeds.length).to.be.equal(1);
        });

        it("should have a correct seed fiels (name, properties, count)", () => {
            const seed = {
                name: "",
                properties: {},
                count: 0
            };

            bale.use(seed);
            expect(bale.seeds[0]).to.have.property("name");
            expect(bale.seeds[0]).to.have.property("properties");
            expect(bale.seeds[0]).to.have.property("count");
        });

        it("should avoid insert fake data when seed name is not defined", async () => {
            const seed = {
                name: "",
                properties: {
                    name: ""
                },
                count: 1,
                file: "somefile.json"
            };
            bale.use(seed);
            await bale.connect({});
            const success = await bale.run();

            expect(success).to.equal(false);
        })

        it("should add fake data", async () => {
            const seed = {
                name: "modelTest",
                properties: {
                    name: "string"
                },
                count: 5
            }

            await bale.connect({});
            bale.use(seed);
            await bale.run();

            const db = bale.dbDriver.db;

            const collinfo = await new Promise((resolve, reject) => {
                db.listCollections({name: seed.name})
                .next(function(err, collinfo) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(collinfo);
                });
            });

            const collection = db.collection(seed.name);
            const count = await collection.count();

            expect(collinfo).to.be.a("object");
            expect(count).to.be.equal(seed.count);
        });

        it("should add fake data with relation", async () => {
            const seeds = [
                {
                    name: "User",
                    properties : {
                        firstName: "string",
                        lastName: "string",
                        phone: "string",
                        address: "string",
                        Post: {
                            type: "model",
                            relation: "hasMany",
                            count: 10
                        },
                        Preference: {
                            type: "model",
                            relation: "hasOne"
                        }
                    },
                    count: 1
                },
                {
                    name: "Preference",
                    properties: {
                        settings: "string"
                    },
                    count: 1
                },
                {
                    name: "Post",
                    properties: {
                        description: "string",
                        Tag: {
                            type: "model",
                            relation: "hasMany"
                        }
                    },
                    count: 1
                },
                {
                    name: "Tag",
                    properties: {
                        description: "string"
                    },
                    count: 1
                }
            ];

            bale.seeds = seeds;
            
            await bale.connect({});
            const success = await bale.run();

            const expected = {
                Post: 0,
                User: 0,
                Tag: 0,
                Preference: 0
            };

            function createSeed({name, type, count}) {
                const seedFind = bale.seeds.find(seed => seed.name === name);
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


            function checkData(seed, count = 1) {
                let total = count * seed.count;
                expected[seed.name] += total;
                
                const {relations} = getPropertiesFlattened(seed.properties);

                for (const relation of relations) {
                    checkData(createdSeed(relation), total);
                }

            }

            async function checkData(seed, count = 1) {
                let total = count * seed.count;
                expected[seed.name] += total;
                
                const {relations} = getPropertiesFlattened(seed.properties);

                for (const relation of relations) {
                    const docs = await bale.dbDriver.db.collection(relation.name).find({[generateFkId(seed.name)]: { $exists: true }}).toArray();
                    if (docs && docs.length) {
                        const createdSeed = createSeed(relation);
                        checkData(createdSeed, total);
                    }
                }

            }
            const db = bale.dbDriver.db;

            for (const seed of bale.seeds) {
                await checkData(seed);
                const collection = db.collection(seed.name);
                const count = await collection.count();

                await expect(count).to.be.equal(expected[seed.name]);
            }
           
            expect(success).to.equal(true);

        });
    });

    describe("seed's properties", () => {
        it("should properties a object", () => {
            const seed = {
                name: "",
                properties: {},
                count: 0
            };

            bale.use(seed);
            expect(bale.seeds[0]).to.have.property("properties").to.be.a("object");
        });

        it("should name a string", () => {
            const seed = {
                name: "",
                properties: {},
                count: 0
            };

            bale.use(seed);
            expect(bale.seeds[0]).to.have.property("name").to.be.a("string");
        });

        it("should count a number", () => {
            const seed = {
                name: "",
                properties: {},
                count: 0
            };

            bale.use(seed);
            expect(bale.seeds[0]).to.have.property("count").to.be.a("number");
        });
    });
});