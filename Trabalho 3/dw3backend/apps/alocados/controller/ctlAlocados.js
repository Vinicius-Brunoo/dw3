const mdlAlocados = require("../model/mdlAlocados");

async function GetAllAlocados(req, res) {
    const registro = await mdlAlocados.GetAllAlocados();
    res.json({ status: "ok", registro });
}

async function GetAlocadoByID(req, res) {
    const id = Number(req.params.alocadoid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const registro = await mdlAlocados.GetAlocadoByID(id);
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
    const result = await mdlAlocados.InsertAlocado(registro);
    res.json({ status: "ok", ...result });
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
    const result = await mdlAlocados.UpdateAlocado(id, registro);
    if (!result.linhasAfetadas) return res.status(404).json({ status: "Registro não encontrado." });
    res.json({ status: "ok", ...result });
}

async function DeleteAlocado(req, res) {
    const id = Number(req.params.alocadoid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const result = await mdlAlocados.DeleteAlocado(id);
    if (!result.linhasAfetadas) return res.status(404).json({ status: "Registro não encontrado." });
    res.json({ status: "ok", ...result });
}

module.exports = { GetAllAlocados, GetAlocadoByID, InsertAlocado, UpdateAlocado, DeleteAlocado };
