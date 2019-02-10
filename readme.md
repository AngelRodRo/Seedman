Bale.js is a seeder allows you create data for any models or collections in any database engine like MongoDB, MySQL, Postgres, etc. (Current version: Only Supports MongoDB).


## Installation

Using npm:
```
npm install --save bale.js
```

## Features

- Generate seeds from any data model
- Connection for any database engine (SQL or NoSQL): MongoDB, Postgres, Mysql. (Current Version: Only Supports MongoDB)

## Usage 


Example:

UserSeeder.js
```js
    'use strict';
    let faker = require('faker'),
        Bale = require('bale.js'),
        bale = new Bale();


    let seed = bale.genSeed('users',5,(user)=>{
        user.name = faker.name.firstName();
        user.lastname = faker.name.lastName();
        user.description = faker.lorem.paragraph();
        user.email = faker.internet.email();
        user.password = '1234567'; 
        user.latitude = faker.address.latitude();
        user.longitude = faker.address.longitude();
        return user;
    })

    module.exports = seed;
```

IndexSeeder.js
```js
    let userSeeder = require('./UserSeeder');
    let Bale = require('bale.js');

    let opts = {
        host:'localhost',
        port:27017,
        dbname:'dbname',
        driver:'mongodb'
    }

    let bale = new Bale();

    bale.connect(opts).then((seeder)=>{
        
        seeder.use(userSeeder);

        seeder.seed().then((msg)=>{
            process.exit();
        });
    })

```

Using CLI:
```
node IndexSeeder.js
```

#Documentation