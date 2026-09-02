//@ Importa as bibliotecas e arquivos
const express = require("express");
const routerApp = express.Router();
const appHello = require("../controller/ctlHello");
const appCalculadora = require("../controller/calculadora");
//@ Configura as rotas
routerApp.get("/", appHello.hello);
routerApp.get("/helloUserGet/:nome", appHello.helloUserGet);
routerApp.post("/helloUserPost", appHello.helloUserPost);
routerApp.post("/somar", appCalculadora.somar);
routerApp.post("/subtrair", appCalculadora.subtrair);
routerApp.post("/multiplicar", appCalculadora.multiplicar);
routerApp.post("/dividir", appCalculadora.dividir);
//@ Exporta a variável com as rotas
module.exports = routerApp;
