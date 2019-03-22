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

**Note**: This seeder will erase all database data before start. For avoid this, set **reset** field in the configuration file to **false**.

For usage it's neccesary define a JSON files defining properties such:
   
- **name:** Model name in the DB for populate
- **properties:** Model properties or fields.
- **count:** Amout data for populate in the model

Example:

**user.json**
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

**post.json**
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

Also it's important to define a configuration file in otherwise will be use a default config for the driver choosen (mongodb). It should be in the same path that the command is execute (It shouldn't be inside a folder).

**seeder.config.json**
```json
{
    "user": "",
    "password": "",
    "host": "localhost",
    "port": "27017",
    "dbname": "dbname"
}
```


## CLI

```
$ seedman -h
 
  Usage: seedman 
 
  A CLI interface for Seedman
 
  Options:
 
    -h, --help                    output usage information
```

## Seeds props

| Props       | Description                                  | 
| ----------- | -------------------------------------------- | 
| name        | Model name what is definied in the database  | 
| properties  | Model properties                             | 
| count       | Amount data for populate in the model         |

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

**firstName, lastName, phone and address**. Theses properties will use values according to their context:

```json
{
    "_id" : 0,
    "firstName" : "Shawna",
    "lastName" : "Lind",
    "phone" : "861.700.7122",
    "address" : "46153 Earline Meadow"
}
```

But, there are some properties name, it won't identify according to the name and generate a random string or it depending of the type defined in the seeder can be a number or string array (length = 5).

## Relations

It's possible define a relation between models:

- One-to-One
- One-to-Many

For define a new relation it's important define a new field referencing a seed, this field must be the seed name with some properties:

- **type**: model
- **relation**: hasOne or hasMany.
- **count**: Records amount to create
- **fkId (Optional)**: Custom foreign key, for default it's **modelId**

Example:

user.json

```json
    {
    "name": "User",
    "properties" : {
        "lastName": "string",
        "phone": "string",
        "address": "string",
        "Post": {
            "type": "model",
            "relation": "hasMany"
        }
    },
    "count": 1
}
```

post.json

```json
{
    "name": "Post",
    "properties" : {
        "description": "string"
    },
    "count": 1
}
```

**Note:** If the seed to reference (Post) has **count** field will generate independent records, in order to avoid this is important remove that field.

## Tests

```
npm run test
```



