Seedman is a seeder allows you create data for any models or collections in any database engine like MongoDB, MySQL, Postgres, etc. (Current version: Only Supports MongoDB).


## Install

Using npm:
```
npm install --save seedman
```

**Note:** You can install it globally

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

For default, theses files must be inside a folder named `seeders`

Also it's important to define a configuration file in otherwise will be use a default config for the driver choosen

seeder.config.json
```json
{
    "user": "",
    "password": "",
    "host": "localhost",
    "port": "27017",
    "dbname": "dbname"
}
```

#CLI

```
$ seedman -h
 
  Usage: seedman 
 
  A CLI interface for Seedman
 
  Options:
 
    -h, --help                    output usage information
```

#Seeds props

| Props       | Description                                  | 
| ----------- | -------------------------------------------- | 
| name        | Model name what is definied in the database  | 
| properties  | Model properties                             | 
| count       | Amout data for populate in the model         |

## Properties

It is possible define some type for each property. 

- string
- array
- number

Seedman use **faker.js** for generate fake data and identify the values according to the name of the property. 

For the **User** example:

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

**firstName, lastName, phone, address**, theses properties will use values according to their context:

```json
{
    "_id" : 0,
    "firstName" : "Shawna",
    "lastName" : "Lind",
    "phone" : "861.700.7122",
    "address" : "46153 Earline Meadow"
}
```

But there are some properties name, it won't identify according to the name and generate a random string or it depending of the type defined in the seeder can be a number or array (length = 5).




