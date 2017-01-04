var express = require('express');
var config = require('../config');
var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
var router = express.Router();

router.post('/certificate_generation', function(req, res) {
    

    res.sendStatus(200);
    window.location = config.url + "/download_profile"; ///?????????
});)

module.exports = router;
