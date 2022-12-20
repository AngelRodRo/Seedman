const { Client } = require("pg");
const parseData = require("../parse");
const Driver = require("./driver");

class MySQLDriver extends Driver {
    constructor() {
        super();
        this.connect = this.connect.bind(this);
    }

    connect() {
        const {user, host, database, password, port} = this.config;
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
        return db.query(text, values);
    }
}


module.exports = MySQLDriver;