const db = require("../database/databaseconfig");

async function GetAllPiquetes(req, res) {
    const result = await db.query(
        "SELECT piqueteid, descricao, latitude, longitude, pastoidfk, removido FROM piquete WHERE removido = false ORDER BY piqueteid"
    );
    const registro = result.rows;
    res.json({ status: "ok", registro });
}

async function GetPiqueteByID(req, res) {
    const id = Number(req.params.piqueteid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const result = await db.query(
        "SELECT piqueteid, descricao, latitude, longitude, pastoidfk, removido FROM piquete WHERE piqueteid = $1 AND removido = false",
        [id]
    );
    const registro = result.rows;
    res.json({ status: "ok", registro });
}

async function InsertPiquete(req, res) {
    const registro = req.body;
    if (
        !registro ||
        registro.descricao === undefined ||
        registro.descricao === "" ||
        registro.latitude === undefined ||
        registro.latitude === "" ||
        registro.longitude === undefined ||
        registro.longitude === "" ||
        registro.pastoidfk === undefined ||
        registro.pastoidfk === ""
    ) {
        return res.status(400).json({ status: "Preencha os campos obrigatórios." });
    }
    const result = await db.query(
        "INSERT INTO piquete (descricao, latitude, longitude, pastoidfk) VALUES ($1, $2, $3, $4) RETURNING piqueteid",
        [registro.descricao, registro.latitude, registro.longitude, registro.pastoidfk]
    );
    res.json({ status: "ok", linhasAfetadas: result.rowCount, piqueteid: result.rows[0].piqueteid });
}

async function UpdatePiquete(req, res) {
    const id = Number(req.params.piqueteid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const registro = req.body;
    if (
        !registro ||
        registro.descricao === undefined ||
        registro.descricao === "" ||
        registro.latitude === undefined ||
        registro.latitude === "" ||
        registro.longitude === undefined ||
        registro.longitude === "" ||
        registro.pastoidfk === undefined ||
        registro.pastoidfk === ""
    ) {
        return res.status(400).json({ status: "Preencha os campos obrigatórios." });
    }
    const result = await db.query(
        "UPDATE piquete SET descricao = $2, latitude = $3, longitude = $4, pastoidfk = $5 WHERE piqueteid = $1 AND removido = false",
        [id, registro.descricao, registro.latitude, registro.longitude, registro.pastoidfk]
    );
    if (!result.rowCount) return res.status(404).json({ status: "Registro não encontrado." });
    res.json({ status: "ok", linhasAfetadas: result.rowCount });
}

async function DeletePiquete(req, res) {
    const id = Number(req.params.piqueteid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const result = await db.query(
        "UPDATE piquete SET removido = true WHERE piqueteid = $1 AND removido = false",
        [id]
    );
    if (!result.rowCount) return res.status(404).json({ status: "Registro não encontrado." });
    res.json({ status: "ok", linhasAfetadas: result.rowCount });
}

module.exports = { GetAllPiquetes, GetPiqueteByID, InsertPiquete, UpdatePiquete, DeletePiquete };
