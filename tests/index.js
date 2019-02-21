const {expect} = require("chai");
const Bale = require("../src/bale");

describe("bale", () => {
    let bale;

    beforeEach(() => {
        bale = new Bale();
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
            expect(bale.seeders.length).to.be.equal(1);
        });

        it("should have a correct seed fiels (name, properties, count)", () => {
            const seed = {
                name: "",
                properties: {},
                count: 0
            };

            bale.use(seed);
            expect(bale.seeders[0]).to.have.property("name");
            expect(bale.seeders[0]).to.have.property("properties");
            expect(bale.seeders[0]).to.have.property("count");
        });

        it("should show a message for avoid insert fake data", async () => {
            const seed = {
                name: "",
                properties: {
                    name: ""
                },
                count: 1
            };


            bale.use(seed);
            await bale.connect({});
            console.log(bale)
            const success = await bale.run()
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
    });

    describe("seed's properties", () => {
        it("should properties a object", () => {
            const seed = {
                name: "",
                properties: {},
                count: 0
            };

            bale.use(seed);
            expect(bale.seeders[0]).to.have.property("properties").to.be.a("object");
        });

        it("should name a string", () => {
            const seed = {
                name: "",
                properties: {},
                count: 0
            };

            bale.use(seed);
            expect(bale.seeders[0]).to.have.property("name").to.be.a("string");
        });

        it("should count a number", () => {
            const seed = {
                name: "",
                properties: {},
                count: 0
            };

            bale.use(seed);
            expect(bale.seeders[0]).to.have.property("count").to.be.a("number");
        });
    });
});