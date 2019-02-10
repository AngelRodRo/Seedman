SeedBed is a seeder allows you create data for any models or collections in any database engine like MongoDB, MySQL, Postgres, etc. (Current version: Only Supports MongoDB).


## Installation

Using npm:
```
npm install --save seedbed
```

## Features

- Generate seeds from any data model
- Connection for any database engine (SQL or NoSQL): MongoDB, Postgres, Mysql. (Current Version: Only Supports MongoDB)

## Usage 

For usage it's neccesary define a JSON files defining properties such:
    - name: Model name in the DB for populate
    - properties: Model properties or fields.
    - count: Amout data for populate in the model

Example:

user.json
```json
    {
        "name": "User",
        "properties" : {
            "firstName": "string",
            "lastName": "string",
            "phone": "string",
            "address": "string"
        },
        "count": 20
    }
```

post.json
```json
    {
        "name": "Post",
        "properties" : {
            "title": "string",
            "tags": "array",
            "visits": "number"
        },
        "count": 20
    }
```

#Documentation