const faker = require("faker");

module.exports.findPropValue = function (modelProperty, type) {
    let fakerProperty = "";
    let fakerFn = "";
    Object.keys(faker).some(function (property) {
        if (modelProperty.toLowerCase().includes(property.toLowerCase())) {
            fakerProperty = property;
            Object.keys(faker[property]).some(function(fnName) {
                if (fnName.toLowerCase().includes(modelProperty.toLowerCase())) {
                    fakerFn = fnName;
                    return true;
                }
            })
            return true;
        }
    });

    if (!fakerProperty && !fakerFn) {
        if (type === "string") {
            return faker.lorem.sentence();
        } else if (type === "number") {
            return faker.random.number();
        } else if (type === "array") {
            const arr = [];
            for (let i = 0; i < 5; i++) {
                arr.push(faker.lorem.word());                
            }
            return arr;
        } else {
            return faker.lorem.word();
        }
    } else {
        return faker[fakerProperty][fakerFn]();
    }
}
