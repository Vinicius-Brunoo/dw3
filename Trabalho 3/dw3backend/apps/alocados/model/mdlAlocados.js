const db = require("../../../database/databaseconfig");

async function GetAllAlocados() {
    const result = await db.query(
        "SELECT alocadoid, animalidifk, piqueteidfk, TO_CHAR(datainicio, 'YYYY-MM-DD') AS datainicio, TO_CHAR(datafinal, 'YYYY-MM-DD') AS datafinal, removido FROM alocado WHERE removido = false ORDER BY alocadoid"
    );
    return result.rows;
}

async function GetAlocadoByID(id) {
    const result = await db.query(
        "SELECT alocadoid, animalidifk, piqueteidfk, TO_CHAR(datainicio, 'YYYY-MM-DD') AS datainicio, TO_CHAR(datafinal, 'YYYY-MM-DD') AS datafinal, removido FROM alocado WHERE alocadoid = $1 AND removido = false",
        [id]
    );
    return result.rows;
}

async function InsertAlocado(registro) {
    const result = await db.query(
        "INSERT INTO alocado (animalidifk, piqueteidfk, datainicio, datafinal) VALUES ($1, $2, $3, $4) RETURNING alocadoid",
        [registro.animalidifk, registro.piqueteidfk, registro.datainicio, registro.datafinal]
    );
    return { linhasAfetadas: result.rowCount, alocadoid: result.rows[0].alocadoid };
}

async function UpdateAlocado(id, registro) {
    const result = await db.query(
        "UPDATE alocado SET animalidifk = $2, piqueteidfk = $3, datainicio = $4, datafinal = $5 WHERE alocadoid = $1 AND removido = false",
        [id, registro.animalidifk, registro.piqueteidfk, registro.datainicio, registro.datafinal]
    );
    return { linhasAfetadas: result.rowCount };
}

async function DeleteAlocado(id) {
    const result = await db.query(
        "UPDATE alocado SET removido = true WHERE alocadoid = $1 AND removido = false",
        [id]
    );
    return { linhasAfetadas: result.rowCount };
}

module.exports = { GetAllAlocados, GetAlocadoByID, InsertAlocado, UpdateAlocado, DeleteAlocado };
