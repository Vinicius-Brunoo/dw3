const db = require("../../../database/databaseconfig");

async function GetAllPiquetes() {
    const result = await db.query(
        "SELECT piqueteid, descricao, latitude, longitude, pastoidfk, removido FROM piquete WHERE removido = false ORDER BY piqueteid"
    );
    return result.rows;
}

async function GetPiqueteByID(id) {
    const result = await db.query(
        "SELECT piqueteid, descricao, latitude, longitude, pastoidfk, removido FROM piquete WHERE piqueteid = $1 AND removido = false",
        [id]
    );
    return result.rows;
}

async function InsertPiquete(registro) {
    const result = await db.query(
        "INSERT INTO piquete (descricao, latitude, longitude, pastoidfk) VALUES ($1, $2, $3, $4) RETURNING piqueteid",
        [registro.descricao, registro.latitude, registro.longitude, registro.pastoidfk]
    );
    return { linhasAfetadas: result.rowCount, piqueteid: result.rows[0].piqueteid };
}

async function UpdatePiquete(id, registro) {
    const result = await db.query(
        "UPDATE piquete SET descricao = $2, latitude = $3, longitude = $4, pastoidfk = $5 WHERE piqueteid = $1 AND removido = false",
        [id, registro.descricao, registro.latitude, registro.longitude, registro.pastoidfk]
    );
    return { linhasAfetadas: result.rowCount };
}

async function DeletePiquete(id) {
    const result = await db.query(
        "UPDATE piquete SET removido = true WHERE piqueteid = $1 AND removido = false",
        [id]
    );
    return { linhasAfetadas: result.rowCount };
}

module.exports = { GetAllPiquetes, GetPiqueteByID, InsertPiquete, UpdatePiquete, DeletePiquete };
