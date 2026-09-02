const mdlCursos = require("../model/mdlCursos");

const GetAllCursos = (req, res) =>
    (async () => {
        const registro = await mdlCursos.GetAllCursos();
        res.json({ status: "ok", registro: registro });
    })();

const GetCursoByID = (req, res) =>
    (async () => {
        const cursoID = parseInt(req.params.cursoid);
        const registro = await mdlCursos.GetCursoByID(cursoID);
        res.json({ status: "ok", registro: registro });
    })();

const InsertCurso = (request, res) =>
    (async () => {
        const registro = request.body;
        const { msg, linhasAfetadas, cursoid } = await mdlCursos.InsertCurso(registro);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas, cursoid: cursoid });
    })();

const UpdateCurso = (request, res) =>
    (async () => {
        const cursoID = parseInt(request.params.cursoid);
        const registro = request.body;
        const { msg, linhasAfetadas } = await mdlCursos.UpdateCurso(cursoID, registro);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const DeleteCurso = (request, res) =>
    (async () => {
        const cursoID = parseInt(request.params.cursoid);
        const { msg, linhasAfetadas } = await mdlCursos.DeleteCurso(cursoID);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

module.exports = {
    GetAllCursos,
    GetCursoByID,
    InsertCurso,
    UpdateCurso,
    DeleteCurso,
};
