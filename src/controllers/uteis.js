async function notNull(data) {
    let valuesData = Object.values(data);
    let verify = await valuesData.find(info => info == "");

    if(verify == undefined){
        verify = true;
    }else{
        verify = false;
    }

    return verify;
}

module.exports = {
    notNull
}