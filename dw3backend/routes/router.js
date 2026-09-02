const express = require("express");
const routerApp = express.Router();

const appAlunos = require("../apps/alunos/controller/ctlAlunos");
const appCursos = require("../apps/cursos/controller/ctlCursos");
const appLogin = require("../apps/login/controller/ctlLogin");

routerApp.use((req, res, next) => {
    next();
});

routerApp.get("/", (req, res) => {
    res.send("Olá mundo!");
});

//@ Rotas de Alunos
routerApp.get("/getAllAlunos", appAlunos.GetAllAlunos);
routerApp.get("/getAlunoByID/:alunoid", appLogin.AutenticaJWT, appAlunos.GetAlunoByID);
routerApp.get("/getCursosToAlunos", appLogin.AutenticaJWT, appAlunos.GetCursosToAlunos);
routerApp.post("/insertAluno", appLogin.AutenticaJWT, appAlunos.InsertAluno);
routerApp.put("/updateAluno/:alunoid", appLogin.AutenticaJWT, appAlunos.UpdateAluno);
routerApp.delete("/deleteAluno/:alunoid", appLogin.AutenticaJWT, appAlunos.DeleteAluno);

//@ Rotas de Cursos
routerApp.get("/getAllCursos", appCursos.GetAllCursos);
routerApp.get("/getCursoByID/:cursoid", appLogin.AutenticaJWT, appCursos.GetCursoByID);
routerApp.post("/insertCurso", appLogin.AutenticaJWT, appCursos.InsertCurso);
routerApp.put("/updateCurso/:cursoid", appLogin.AutenticaJWT, appCursos.UpdateCurso);
routerApp.delete("/deleteCurso/:cursoid", appLogin.AutenticaJWT, appCursos.DeleteCurso);

// Rota Login
routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

module.exports = routerApp;
