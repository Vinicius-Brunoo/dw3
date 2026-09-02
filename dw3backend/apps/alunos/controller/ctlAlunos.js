const mdlAlunos = require("../model/mdlAlunos");

const formataDataNascimento = (registro) => {
    for (let i = 0; i < registro.length; i++) {
        const row = registro[i];

        if (row.datanascimento instanceof Date) {
            row.datanascimento = row.datanascimento.toISOString().split("T")[0];
        }
    }
};

const GetAllAlunos = (req, res) =>
    (async () => {
        const registro = await mdlAlunos.GetAllAlunos();
        formataDataNascimento(registro);
        res.json({ status: "ok", registro: registro });
    })();

const GetAlunoByID = (req, res) =>
    (async () => {
        const alunoID = parseInt(req.params.alunoid);
        const registro = await mdlAlunos.GetAlunoByID(alunoID);
        formataDataNascimento(registro);
        res.json({ status: "ok", registro: registro });
    })();

const GetCursosToAlunos = (req, res) =>
    (async () => {
        const registro = await mdlAlunos.GetCursosToAlunos();
        res.json({ status: "ok", registro: registro });
    })();

const InsertAluno = (request, res) =>
    (async () => {
        const alunoREG = request.body;
        const { msg, linhasAfetadas, alunoid } = await mdlAlunos.InsertAluno(alunoREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas, alunoid: alunoid });
    })();

const UpdateAluno = (request, res) =>
    (async () => {
        const alunoID = parseInt(request.params.alunoid);
        const alunoREG = request.body;
        const { msg, linhasAfetadas } = await mdlAlunos.UpdateAluno(alunoID, alunoREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const DeleteAluno = (request, res) =>
    (async () => {
        const alunoID = parseInt(request.params.alunoid);
        const { msg, linhasAfetadas } = await mdlAlunos.DeleteAluno(alunoID);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

module.exports = {
    GetAllAlunos,
    GetAlunoByID,
    GetCursosToAlunos,
    InsertAluno,
    UpdateAluno,
    DeleteAluno,
};
