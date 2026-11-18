const db = require("../database/databaseconfig");

async function GetAllAlocados(req, res) {
    const result = await db.query(
        "SELECT alocadoid, animalidifk, piqueteidfk, TO_CHAR(datainicio, 'YYYY-MM-DD') AS datainicio, TO_CHAR(datafinal, 'YYYY-MM-DD') AS datafinal, removido FROM alocado WHERE removido = false ORDER BY alocadoid"
    );
    const registro = result.rows;
    res.json({ status: "ok", registro });
}

async function GetAlocadoByID(req, res) {
    const id = Number(req.params.alocadoid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const result = await db.query(
        "SELECT alocadoid, animalidifk, piqueteidfk, TO_CHAR(datainicio, 'YYYY-MM-DD') AS datainicio, TO_CHAR(datafinal, 'YYYY-MM-DD') AS datafinal, removido FROM alocado WHERE alocadoid = $1 AND removido = false",
        [id]
    );
    const registro = result.rows;
    res.json({ status: "ok", registro });
}

async function InsertAlocado(req, res) {
    const registro = req.body;
    if (
        !registro ||
        registro.animalidifk === undefined ||
        registro.animalidifk === "" ||
        registro.piqueteidfk === undefined ||
        registro.piqueteidfk === "" ||
        registro.datainicio === undefined ||
        registro.datainicio === ""
    ) {
        return res.status(400).json({ status: "Preencha os campos obrigatórios." });
    }
    registro.datafinal = registro.datafinal || null;
    const result = await db.query(
        "INSERT INTO alocado (animalidifk, piqueteidfk, datainicio, datafinal) VALUES ($1, $2, $3, $4) RETURNING alocadoid",
        [registro.animalidifk, registro.piqueteidfk, registro.datainicio, registro.datafinal]
    );
    res.json({ status: "ok", linhasAfetadas: result.rowCount, alocadoid: result.rows[0].alocadoid });
}

async function UpdateAlocado(req, res) {
    const id = Number(req.params.alocadoid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const registro = req.body;
    if (
        !registro ||
        registro.animalidifk === undefined ||
        registro.animalidifk === "" ||
        registro.piqueteidfk === undefined ||
        registro.piqueteidfk === "" ||
        registro.datainicio === undefined ||
        registro.datainicio === ""
    ) {
        return res.status(400).json({ status: "Preencha os campos obrigatórios." });
    }
    registro.datafinal = registro.datafinal || null;
    const result = await db.query(
        "UPDATE alocado SET animalidifk = $2, piqueteidfk = $3, datainicio = $4, datafinal = $5 WHERE alocadoid = $1 AND removido = false",
        [id, registro.animalidifk, registro.piqueteidfk, registro.datainicio, registro.datafinal]
    );
    if (!result.rowCount) return res.status(404).json({ status: "Registro não encontrado." });
    res.json({ status: "ok", linhasAfetadas: result.rowCount });
}

async function DeleteAlocado(req, res) {
    const id = Number(req.params.alocadoid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const result = await db.query(
        "UPDATE alocado SET removido = true WHERE alocadoid = $1 AND removido = false",
        [id]
    );
    if (!result.rowCount) return res.status(404).json({ status: "Registro não encontrado." });
    res.json({ status: "ok", linhasAfetadas: result.rowCount });
}

module.exports = { GetAllAlocados, GetAlocadoByID, InsertAlocado, UpdateAlocado, DeleteAlocado };
