var express = require('express');
var config = require('../config');
//var cleanup = require('../cleanup');
var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
var uuid = require('uuid');
var tmp = require('tmp');
var router = express.Router();

var helpers = {
    getProfilePath: function(req) {
        return path.join(__dirname, '..', req.session.profilePath.substr(1, req.session.profilePath.length - 1))
    }
};

module.exports = helpers;
