const faker = require("faker");

function searchPropertyAndFn(modelProperty) {
    const faker = {
        property: "",
        fn: ""
    }

    const fakerProperties = Object.keys(faker);
    faker.property = fakerProperties.find((property) => modelProperty.toLowerCase().includes(property.toLowerCase()));

    if (faker.property) {
	    const fakerPropertyFns = Object.keys(faker[faker.property]);
	    faker.fn = fakerPropertyFns.find((fnName) => fnName.toLowerCase().includes(modelProperty.toLowerCase()))
    }

    return faker;
}

const generateValueTable = function () {
    return {
        string: faker.lorem.sentence(),
        number: faker.random.number(),
        array: (function() {
            const arr = [];
            for (let i = 0; i < 5; i++) {
                arr.push(faker.lorem.word());                
            }
            return arr; 
        })(),
    }
}

function selectValueAccordingToType ({property, fn}, type) {
    const valueTable = generateValueTable();
    return !property && !fn? (valueTable[type] || faker.lorem.word()) : faker[property][fn]();
}

module.exports.findPropValue = function (modelProperty, type) {
    const faker = searchPropertyAndFn(modelProperty);
    return selectValueAccordingToType(faker, type);
}


module.exports.generateFkId = function (modelName) {
    return `${modelName.toLowerCase()}Id`;
}

function forEachObjectProperties(object, callback) {
    
}

module.exports.getPropertiesFlattened = function (properties) {
    const relations = [];
    const props = {};
    for (const property in properties) {
        if (properties.hasOwnProperty(property)) {
            const value = properties[property];
            if (value.type === "model" && ["hasOne", "hasMany"].includes(value.relation)) {
                relations.push({
                    name: property,
                    type: value.relation,
                    count: value.count,
                    fkId: value.fkId
                });
            } else {
                props[property] = value;
            }
        }
    }


    return {
        properties: props,
        relations
    }
}