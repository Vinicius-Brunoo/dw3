const mdlPastos = require("../model/mdlPastos");

async function GetAllPastos(req, res) {
    const registro = await mdlPastos.GetAllPastos();
    res.json({ status: "ok", registro });
}

async function GetPastoByID(req, res) {
    const id = Number(req.params.pastoid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const registro = await mdlPastos.GetPastoByID(id);
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
    const result = await mdlPastos.InsertPasto(registro);
    res.json({ status: "ok", ...result });
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
    const result = await mdlPastos.UpdatePasto(id, registro);
    if (!result.linhasAfetadas) return res.status(404).json({ status: "Registro não encontrado." });
    res.json({ status: "ok", ...result });
}

async function DeletePasto(req, res) {
    const id = Number(req.params.pastoid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const result = await mdlPastos.DeletePasto(id);
    if (!result.linhasAfetadas) return res.status(404).json({ status: "Registro não encontrado." });
    res.json({ status: "ok", ...result });
}

module.exports = { GetAllPastos, GetPastoByID, InsertPasto, UpdatePasto, DeletePasto };
