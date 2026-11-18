var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('pastos/vwLstPastos', {
    title: 'Pastos',
    showNavbar: true,
    activeMenu: 'pastos',
    servidorDw3: process.env.SERVIDOR_DW3
  });
});

router.get('/form', function(req, res) {
  res.render('pastos/vwFormPastos', {
    title: 'Formulário de pastos',
    showNavbar: true,
    activeMenu: 'pastos',
    servidorDw3: process.env.SERVIDOR_DW3,
    oper: req.query.oper || 'Cr',
    pastoid: req.query.pastoid || '0'
  });
});

module.exports = router;
