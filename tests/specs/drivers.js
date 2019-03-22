const {expect} = require("chai");

describe("drivers", () => {
    describe("mongo", () => {
        const MongoDriver = require("../../src/drivers/mongo");
        let mongoDriver;

        beforeEach(() => {
            const dbParams = {
                host: "localhost",
                port: "27017",
                dbname: "baleDB"
            };
            mongoDriver = new MongoDriver(dbParams);
        })

        it("should generate a string connection without credentials", () => {
            const connectionString = mongoDriver.createConnectionString("", "", "localhost", "27017", "baleDB");
            expect(connectionString).to.be.equal("mongodb://localhost:27017/baleDB");
        });

        it("should connect", async () => {
            const result = await mongoDriver.connect();
            expect(result).to.equal("connected!");
        });

        it("should insert", async () => {
            const dataTest = {
                name: "some text"
            };

            await mongoDriver.connect();
            const result = await mongoDriver.insert("modelTest", dataTest);
            
            expect(result.insertedIds[0].toString()).to.be.a("string");

        })
    });
});