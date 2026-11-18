var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('piquetes/vwLstPiquetes', {
    title: 'Piquetes',
    showNavbar: true,
    activeMenu: 'piquetes',
    servidorDw3: process.env.SERVIDOR_DW3
  });
});

router.get('/form', function(req, res) {
  res.render('piquetes/vwFormPiquetes', {
    title: 'Formulário de piquetes',
    showNavbar: true,
    activeMenu: 'piquetes',
    servidorDw3: process.env.SERVIDOR_DW3,
    oper: req.query.oper || 'Cr',
    piqueteid: req.query.piqueteid || '0'
  });
});

module.exports = router;
