var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('home', {
    title: 'Visão geral',
    activeMenu: 'home',
    servidorDw3: process.env.SERVIDOR_DW3,
    showNavbar: true
  });
});

module.exports = router;
