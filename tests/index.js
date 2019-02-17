const {expect} = require("chai");
const Bale = require("../src/bale");

describe("bale", () => {
    let bale;

    beforeEach(() => {
        bale = new Bale();
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
                const result = await mongoDriver.insert("modelTest", dataTest);
                expect(result).to.have

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