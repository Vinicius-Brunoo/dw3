const db = require("../database/databaseconfig");

async function GetAllAnimais(req, res) {
    const result = await db.query(
        "SELECT animalid, nome, TO_CHAR(datanasc, 'YYYY-MM-DD') AS datanasc, removido FROM animal WHERE removido = false ORDER BY animalid"
    );
    const registro = result.rows;
    res.json({ status: "ok", registro });
}

async function GetAnimalByID(req, res) {
    const id = Number(req.params.animalid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const result = await db.query(
        "SELECT animalid, nome, TO_CHAR(datanasc, 'YYYY-MM-DD') AS datanasc, removido FROM animal WHERE animalid = $1 AND removido = false",
        [id]
    );
    const registro = result.rows;
    res.json({ status: "ok", registro });
}

async function InsertAnimal(req, res) {
    const registro = req.body;
    if (
        !registro ||
        registro.nome === undefined ||
        registro.nome === "" ||
        registro.datanasc === undefined ||
        registro.datanasc === ""
    ) {
        return res.status(400).json({ status: "Preencha os campos obrigatórios." });
    }
    const result = await db.query(
        "INSERT INTO animal (nome, datanasc) VALUES ($1, $2) RETURNING animalid",
        [registro.nome, registro.datanasc]
    );
    res.json({ status: "ok", linhasAfetadas: result.rowCount, animalid: result.rows[0].animalid });
}

async function UpdateAnimal(req, res) {
    const id = Number(req.params.animalid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const registro = req.body;
    if (
        !registro ||
        registro.nome === undefined ||
        registro.nome === "" ||
        registro.datanasc === undefined ||
        registro.datanasc === ""
    ) {
        return res.status(400).json({ status: "Preencha os campos obrigatórios." });
    }
    const result = await db.query(
        "UPDATE animal SET nome = $2, datanasc = $3 WHERE animalid = $1 AND removido = false",
        [id, registro.nome, registro.datanasc]
    );
    if (!result.rowCount) return res.status(404).json({ status: "Registro não encontrado." });
    res.json({ status: "ok", linhasAfetadas: result.rowCount });
}

async function DeleteAnimal(req, res) {
    const id = Number(req.params.animalid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const result = await db.query(
        "UPDATE animal SET removido = true WHERE animalid = $1 AND removido = false",
        [id]
    );
    if (!result.rowCount) return res.status(404).json({ status: "Registro não encontrado." });
    res.json({ status: "ok", linhasAfetadas: result.rowCount });
}

module.exports = { GetAllAnimais, GetAnimalByID, InsertAnimal, UpdateAnimal, DeleteAnimal };
