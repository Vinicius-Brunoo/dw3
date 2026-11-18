var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('animais/vwLstAnimais', {
    title: 'Animais',
    showNavbar: true,
    activeMenu: 'animais',
    servidorDw3: process.env.SERVIDOR_DW3
  });
});

router.get('/form', function(req, res) {
  res.render('animais/vwFormAnimais', {
    title: 'Formulário de animais',
    showNavbar: true,
    activeMenu: 'animais',
    servidorDw3: process.env.SERVIDOR_DW3,
    oper: req.query.oper || 'Cr',
    animalid: req.query.animalid || '0'
  });
});

module.exports = router;
