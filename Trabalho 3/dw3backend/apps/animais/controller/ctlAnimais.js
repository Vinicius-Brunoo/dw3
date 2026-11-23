const mdlAnimais = require("../model/mdlAnimais");

async function GetAllAnimais(req, res) {
    const registro = await mdlAnimais.GetAllAnimais();
    res.json({ status: "ok", registro });
}

async function GetAnimalByID(req, res) {
    const id = Number(req.params.animalid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const registro = await mdlAnimais.GetAnimalByID(id);
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
    const result = await mdlAnimais.InsertAnimal(registro);
    res.json({ status: "ok", ...result });
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
    const result = await mdlAnimais.UpdateAnimal(id, registro);
    if (!result.linhasAfetadas) return res.status(404).json({ status: "Registro não encontrado." });
    res.json({ status: "ok", ...result });
}

async function DeleteAnimal(req, res) {
    const id = Number(req.params.animalid);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ status: "ID inválido." });
    }
    const result = await mdlAnimais.DeleteAnimal(id);
    if (!result.linhasAfetadas) return res.status(404).json({ status: "Registro não encontrado." });
    res.json({ status: "ok", ...result });
}

module.exports = { GetAllAnimais, GetAnimalByID, InsertAnimal, UpdateAnimal, DeleteAnimal };
