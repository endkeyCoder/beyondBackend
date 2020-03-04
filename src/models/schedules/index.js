const Sequelize = require('sequelize')
const { connection } = require('../config');

const Shedule = connection.define('shedule', {
    dateVisit: {
        type: Sequelize.DATE,
        allowNull: false
    },
    hourVisit: {
        type: Sequelize.TIME,
        allowNull: false
    },
    dateHourShedule: {
        type: Sequelize.DATETIME
    },
    addressShedule: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idUser: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Users',
            key: id
        }
    }
})

async function insertShedule(dataShedule) {
    try {
        const tableShedules = await Shedule.sync();
        return Shedule.create(dataShedule);
    } catch (error) {
        return { message: 'problema ao tentar gravar o agendamento, tente novamente mais tarde por favor', error }
    }
}

async function selectShedules(filterShedule) {
    try {
        const tableShedules = await Shedule.sync();
        if (filterShedule) {
            return Shedule.findAll({
                where: filterShedule
            });
        } else {
            Shedule.findAll();
        }
    } catch (error) {
        return { message: 'problema ao tentar selecionar o(s) agendamento(s), tente novamente mais tarde por favor', error }
    }
}

async function updateShedule(dataShedule, filterShedule) {
    try {
        const tableShedules = await Shedule.sync();
        if (filterShedule) {
            return Shedule.update(dataShedule, {
                where: filterShedule
            });
        } else {
            return { message: 'Algum filtro deve ser informado para ATUALIZAR um ou mais clientes' }
        }
    } catch (error) {
        return { message: 'problema ao tentar ATUALIZAR o(s) agendamento(s), tente novamente mais tarde por favor', error }
    }
}

async function deleteShedule(filterShedule) {
    try {
        const tableShedules = await Shedule.sync();
        if (filterShedule) {
            return Shedule.destroy({
                where: filterShedule
            })
        } else {
            return { message: 'Algum filtro deve ser informado para EXCLUIR um ou mais clientes' }
        }
    } catch (error) {
        return { message: 'problema ao tentar EXCLUIR o(s) agendamento(s), tente novamente mais tarde por favor', error }
    }
}

module.exports = {
    insertShedule,
    selectShedules,
    updateShedule,
    deleteShedule
}