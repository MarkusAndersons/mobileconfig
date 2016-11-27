var express = require('express');
var config = require('../config');
var handlebars = require('handlebars');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: config.title });
});

module.exports = router;
