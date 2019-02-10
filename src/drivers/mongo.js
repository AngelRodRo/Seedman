const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const Driver = require("./driver");

class MongoDriver extends Driver {
    connect() {
        const {user = "", password = "", host = "localhost", port = "27017", dbname = "baleDB"} = this.config;
        const url = this.createConnectionString(user, password, host, port, dbname);
        const connectPromise = new Promise((resolve, reject) => {
            MongoClient.connect(url, function(err, db) {
                if (err) {
                    reject(err);
                    return;
                };
                return resolve(db);
            });
        });
        return connectPromise         
        .then(db => {
            this.db = db;
            db.dropDatabase();
        })
    }

    createConnectionString(user, password, host, port, dbname) {
        const credentials = user && password? `${user}:${password}@` : "";
        return `mongodb://${credentials}${host}:${port}/${dbname}`;
    }

    insert(resourceName, data) {
        return this.db.collection(resourceName).insert(data);
    }

    errorHandler(error) {
        if (error.name === "MongoError" && error.message === "Authentication failed.") {
            return Promise.reject("Database Authentication failed.");
        }
    }
}


module.exports = MongoDriver;