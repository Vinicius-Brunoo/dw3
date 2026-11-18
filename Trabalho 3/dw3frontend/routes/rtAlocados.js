var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('alocados/vwLstAlocados', {
    title: 'Alocações',
    showNavbar: true,
    activeMenu: 'alocados',
    servidorDw3: process.env.SERVIDOR_DW3
  });
});

router.get('/form', function(req, res) {
  res.render('alocados/vwFormAlocados', {
    title: 'Formulário de alocações',
    showNavbar: true,
    activeMenu: 'alocados',
    servidorDw3: process.env.SERVIDOR_DW3,
    oper: req.query.oper || 'Cr',
    alocadoid: req.query.alocadoid || '0'
  });
});

module.exports = router;
