const parseData = (data) => {
    const lengthKeys = Object.keys(data).length;
    const dataKeys = Object.keys(data).join(",");
    const values = Object.values(data);

    let dataValues = "";

    for (let i = 1; i <= lengthKeys-1; i++) {
        dataValues += `${i},`
    }
    dataValues += `${i+1}`;

    return [dataKeys, dataValues, values];
}

module.exports = {
    parseData
}