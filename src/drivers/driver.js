class Driver {

    constructor(config) {
        this.db = {};
        this.config = config;
        if (!this.config.driver) {
            throw "Need declare the db driver, before continue";
        }
    
    }

    connect() {

    }

    insert() {

    }

    errorHandler() {
        
    }


}

module.exports = Driver;