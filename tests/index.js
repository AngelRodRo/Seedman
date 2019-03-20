const {expect} = require("chai");
const Bale = require("../src/bale");

const {generateFkId, getPropertiesFlattened} = require("../src/utils");


describe("bale", () => {
    let bale;

    beforeEach(() => {
        bale = new Bale({});
    });

    afterEach(() => {
        bale.seeders = [];
    });

    describe("drivers", () => {
        describe("mongo", () => {
            const MongoDriver = require("../src/drivers/mongo");

            it("should generate a string connection without credentials", () => {
                const MongoDriver = require("../src/drivers/mongo");
                const mongoDriver = new MongoDriver();
                const connectionString = mongoDriver.createConnectionString("", "", "localhost", "27017", "baleDB");
                expect(connectionString).to.be.equal("mongodb://localhost:27017/baleDB");
            });

            it("should connect", async () => {
                const dbParams = {
                    host: "localhost",
                    port: "27017",
                    dbname: "baleDB"
                };

                const mongoDriver = new MongoDriver(dbParams);

                const result = await mongoDriver.connect();
                expect(result).to.equal("connected!");
            });

            it("should insert", async () => {
                const dbParams = {
                    host: "localhost",
                    port: "27017",
                    dbname: "baleDB"
                };

                const dataTest = {
                    name: "some text"
                };

                const mongoDriver = new MongoDriver(dbParams);
                await mongoDriver.connect();
                const result = await mongoDriver.insert("modelTest", dataTest);
                
                expect(result.insertedIds[0].toString()).to.be.a("string");

            })
        });
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


            // TODO: Counter records from models in .json
            // TODO: Add property in json file for avoid use it like a seed and only use like a schema  

            const checkOtherModel = (model) => {
                const seed = bale.seeds.find(seed => seed.name === model);

            }

            bale.seeds = seeds;
            
            await bale.connect({});
            const success = await bale.run();
            
            const expected = {
                Post: 0,
                User: 0,
                Tag: 0,
                Preference: 0
            };

            for (const seed of bale.seeds) {
                const {relations} = getPropertiesFlattened(seed.properties);
                console.log(seed.name)
                expected[seed.name] += seed.count;

                for (const relation of relations) {
                    const docs = await bale.dbDriver.db.collection(relation.name).find({[generateFkId(seed.name)]: { $exists: true }}).toArray();
                    if (docs && docs.length) {
                        
                        const multiplier = (seed.properties[relation.name].count || (seed.properties[relation.name].relation === "hasMany"? 2 : 1));
                        const expectDocsNumber = seed.count * multiplier;
                        expected[relation.name] += expectDocsNumber;
                        for (const doc of docs) {
                            await expect(doc[generateFkId(seed.name)].toString()).to.be.a("string");
                        }
                    }
                }
            }

            console.log(expected)
            //TODO: Check total of documents per model
            for (const key in expected) {
                if (expected.hasOwnProperty(key)) {
                    const quantityExpected = expected[key];
                    const collection = bale.db.collection(key);
                    const count = await collection.count();
                    await expect(quantityExpected).to.equal(count);
                }
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