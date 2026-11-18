const db = require("../database/databaseconfig");

async function GetAllPastos(req, res) {
    const result = await db.query(
        "SELECT pastoid, descricao, areatotal, removido FROM pasto WHERE removido = false ORDER BY pastoid"
    );
    const registro = result.rows;
    res.json({ status: "ok", registro });
}

async function GetPastoByID(req, res) {
    const id = Number(req.params.pastoid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const result = await db.query(
        "SELECT pastoid, descricao, areatotal, removido FROM pasto WHERE pastoid = $1 AND removido = false",
        [id]
    );
    const registro = result.rows;
    res.json({ status: "ok", registro });
}

async function InsertPasto(req, res) {
    const registro = req.body;
    if (
        !registro ||
        registro.descricao === undefined ||
        registro.descricao === "" ||
        registro.areatotal === undefined ||
        registro.areatotal === ""
    ) {
        return res.status(400).json({ status: "Preencha os campos obrigatórios." });
    }
    const result = await db.query(
        "INSERT INTO pasto (descricao, areatotal) VALUES ($1, $2) RETURNING pastoid",
        [registro.descricao, registro.areatotal]
    );
    res.json({ status: "ok", linhasAfetadas: result.rowCount, pastoid: result.rows[0].pastoid });
}

async function UpdatePasto(req, res) {
    const id = Number(req.params.pastoid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const registro = req.body;
    if (
        !registro ||
        registro.descricao === undefined ||
        registro.descricao === "" ||
        registro.areatotal === undefined ||
        registro.areatotal === ""
    ) {
        return res.status(400).json({ status: "Preencha os campos obrigatórios." });
    }
    const result = await db.query(
        "UPDATE pasto SET descricao = $2, areatotal = $3 WHERE pastoid = $1 AND removido = false",
        [id, registro.descricao, registro.areatotal]
    );
    if (!result.rowCount) return res.status(404).json({ status: "Registro não encontrado." });
    res.json({ status: "ok", linhasAfetadas: result.rowCount });
}

async function DeletePasto(req, res) {
    const id = Number(req.params.pastoid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const result = await db.query(
        "UPDATE pasto SET removido = true WHERE pastoid = $1 AND removido = false",
        [id]
    );
    if (!result.rowCount) return res.status(404).json({ status: "Registro não encontrado." });
    res.json({ status: "ok", linhasAfetadas: result.rowCount });
}

module.exports = { GetAllPastos, GetPastoByID, InsertPasto, UpdatePasto, DeletePasto };
