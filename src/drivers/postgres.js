const { Client } = require("pg");
const { parseData } = require("../utils/index");
const Driver = require("./driver");

class PostgressDriver extends Driver {
    
    connect() {
        const {user = "postgres", host = "localhost", database = "dbtest", password = "postgres", port = "5432"} = this.config;
        const client = new Client({
            user,
            host,
            database,
            password,
            port
        });
        return new Promise((resolve, reject) => {
            client.connect();
            resolve(client);
        })
        .then(client => {
            this.db = client;
            return this;
        }).catch(console.log);
    
    }

    insert(resourceName, data) {
        const [dataKeys, dataValues, values] = parseData(data);
        const text = `INSERT INTO ${resourceName}(${dataKeys}) VALUES (${dataValues})`;
        return this.db.query(text, values);
    }
}


module.exports = PostgressDriver;