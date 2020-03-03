async function notNull(data) {
    let valuesData = Object.values(data);
    let verify = await valuesData.find(info => info == "");

    return verify;
}

module.exports = {
    notNull
}