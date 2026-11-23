const db = require("../../../database/databaseconfig");

async function GetAllAnimais() {
    const result = await db.query(
        "SELECT animalid, nome, TO_CHAR(datanasc, 'YYYY-MM-DD') AS datanasc, removido FROM animal WHERE removido = false ORDER BY animalid"
    );
    return result.rows;
}

async function GetAnimalByID(id) {
    const result = await db.query(
        "SELECT animalid, nome, TO_CHAR(datanasc, 'YYYY-MM-DD') AS datanasc, removido FROM animal WHERE animalid = $1 AND removido = false",
        [id]
    );
    return result.rows;
}

async function InsertAnimal(registro) {
    const result = await db.query(
        "INSERT INTO animal (nome, datanasc) VALUES ($1, $2) RETURNING animalid",
        [registro.nome, registro.datanasc]
    );
    return { linhasAfetadas: result.rowCount, animalid: result.rows[0].animalid };
}

async function UpdateAnimal(id, registro) {
    const result = await db.query(
        "UPDATE animal SET nome = $2, datanasc = $3 WHERE animalid = $1 AND removido = false",
        [id, registro.nome, registro.datanasc]
    );
    return { linhasAfetadas: result.rowCount };
}

async function DeleteAnimal(id) {
    const result = await db.query(
        "UPDATE animal SET removido = true WHERE animalid = $1 AND removido = false",
        [id]
    );
    return { linhasAfetadas: result.rowCount };
}

module.exports = { GetAllAnimais, GetAnimalByID, InsertAnimal, UpdateAnimal, DeleteAnimal };
