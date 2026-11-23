const db = require("../../../database/databaseconfig");

async function GetAllPastos() {
    const result = await db.query(
        "SELECT pastoid, descricao, areatotal, removido FROM pasto WHERE removido = false ORDER BY pastoid"
    );
    return result.rows;
}

async function GetPastoByID(id) {
    const result = await db.query(
        "SELECT pastoid, descricao, areatotal, removido FROM pasto WHERE pastoid = $1 AND removido = false",
        [id]
    );
    return result.rows;
}

async function InsertPasto(registro) {
    const result = await db.query(
        "INSERT INTO pasto (descricao, areatotal) VALUES ($1, $2) RETURNING pastoid",
        [registro.descricao, registro.areatotal]
    );
    return { linhasAfetadas: result.rowCount, pastoid: result.rows[0].pastoid };
}

async function UpdatePasto(id, registro) {
    const result = await db.query(
        "UPDATE pasto SET descricao = $2, areatotal = $3 WHERE pastoid = $1 AND removido = false",
        [id, registro.descricao, registro.areatotal]
    );
    return { linhasAfetadas: result.rowCount };
}

async function DeletePasto(id) {
    const result = await db.query(
        "UPDATE pasto SET removido = true WHERE pastoid = $1 AND removido = false",
        [id]
    );
    return { linhasAfetadas: result.rowCount };
}

module.exports = { GetAllPastos, GetPastoByID, InsertPasto, UpdatePasto, DeletePasto };
