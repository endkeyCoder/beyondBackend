const { insertShedule, selectShedules, updateShedule, deleteShedule } = require('../../models/schedules');
const { notNull } = require('../uteis');

async function setShedule(dataShedule) {
    const verify = notNull(dataShedule);

    if (verify) {
        const resInsertShedule = await insertShedule(dataShedule);
        return resInsertShedule;
    } else {
        return { message: 'Todos os campos devem ser informados para realizar o cadastro' }
    }
}

async function getShedules(filterShedule) {

    if (filterShedule) {
        const resSelectShedules = await selectShedules(filterShedule)
        return resSelectShedules;
    } else {
        const resSelectShedules = await selectShedules();
        return resSelectShedules;
    }

}

async function putShedules(dataShedule, filterShedule) {
    dataVerify = notNull(dataShedule);
    filterVerify = notNull(filterShedule);

    if ((dataVerify) && (filterVerify)) {
        const resUpdateShedule = await updateShedule(dataShedule, filterShedule);
        return resUpdateShedule;
    } else {
        return { message: 'Para ATUALIZAR uma informação, tanto um filtro como os novos dados devem ser informados' }
    }
}

async function delShedules(filterShedule) {
    if (filterShedule) {
        const resDeleteShedule = await deleteShedule(filterShedule);
        return resDeleteShedule;
    } else {
        return { message: 'Para EXCLUIR uma informação, um filtro deve ser informado' }
    }
}

module.exports = {
    setShedule,
    getShedules,
    putShedules,
    delShedules
}