function notFound(observation = undefined) {
    return {
        statusMessage: 'Informação não encontrada',
        statusCode: 404,
        observation
    }
}

function allOk(observation = undefined) {
    return {
        statusMessage: 'Operação concluida com sucesso',
        statusCode: 200,
        observation
    }
}

function serviceError(observation = undefined) {
    return {
        statusMessage: 'Ocorreu um problema no servidor, tente novamente e/ou contate o adminstrador do sistema',
        statusCode: 500,
        observation
    }
}

function allBad(observation = undefined) {
    return {
        statusMessage: 'Requisição inválida',
        statusCode: 400,
        observation
    }
}

module.exports = {
    notFound,
    allOk,
    serviceError,
    allBad
}