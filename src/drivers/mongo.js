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
            return "connected!";
        });
    }

    createConnectionString(user, password, host, port, dbname) {
        const credentials = user && password? `${user}:${password}@` : "";
        return `mongodb://${credentials}${host}:${port}/${dbname}`;
    }

    insert(resourceName, data) {
        return this.db.collection(resourceName).insert(data);
    }

    errorHandler(error) {
        if (error.name && error.name === "MongoError") {
            if (error.message === "Authentication failed.") {
                return Promise.reject("Database Authentication failed.");
            } 
            if (error.message.includes("slash in host identifier")) {
                return Promise.reject("Error in host identifier");
            }
    
            if (error.message.includes("failed to connect to server ")) {
                return Promise.reject("Error trying to connect to the host server");
            }
        }
        
        console.log("Unknow error");
        console.log(error);
        return Promise.reject();
        
    }
}


module.exports = MongoDriver;