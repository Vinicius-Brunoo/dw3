const mdlPiquetes = require("../model/mdlPiquetes");

async function GetAllPiquetes(req, res) {
    const registro = await mdlPiquetes.GetAllPiquetes();
    res.json({ status: "ok", registro });
}

async function GetPiqueteByID(req, res) {
    const id = Number(req.params.piqueteid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const registro = await mdlPiquetes.GetPiqueteByID(id);
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
    const result = await mdlPiquetes.InsertPiquete(registro);
    res.json({ status: "ok", ...result });
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
    const result = await mdlPiquetes.UpdatePiquete(id, registro);
    if (!result.linhasAfetadas) return res.status(404).json({ status: "Registro não encontrado." });
    res.json({ status: "ok", ...result });
}

async function DeletePiquete(req, res) {
    const id = Number(req.params.piqueteid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const result = await mdlPiquetes.DeletePiquete(id);
    if (!result.linhasAfetadas) return res.status(404).json({ status: "Registro não encontrado." });
    res.json({ status: "ok", ...result });
}

module.exports = { GetAllPiquetes, GetPiqueteByID, InsertPiquete, UpdatePiquete, DeletePiquete };
