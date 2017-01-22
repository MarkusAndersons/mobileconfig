var express = require('express');
var config = require('../config');
var cleanup = require('../logic/cleanup');
var helpers = require('../logic/helpers');
var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
var uuid = require('uuid');
var tmp = require('tmp');
var router = express.Router();

cleanup.deleteFilesAfterHour(); // should this be moved to a logic file?

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.email) {
        console.log("Already defined");
        res.render('index-with-confirm', { title: config.title, currentEmail: req.session.email });
    } else {
        res.render('index', { title: config.title });
    }
});

router.get('/restart', function(req, res, next) {
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

// store email
router.post('/valid_email', function(req, res) {
    req.session.email = req.body.address;
    res.sendStatus(200);
});

renderGet('/begin', 'begin');

// display generate page
renderGet('/generate', 'generate');

// display settings options page
renderGet('/generate/certificate', 'generator/certificate');
renderGet('/generate/certificate/upload', 'generator/certificate-upload');
renderGet('/generate/email', 'generator/email');
renderGet('/generate/wifi', 'generator/wifi');

router.get('/download', function(req, res, next) {
    if (!req.session.profilePath) req.session.profilePath = null;
    res.render('download', { title: config.title, url: config.url, downloadUrl: '/profiles/' + req.session.profilePath.substr(5, req.session.profilePath.length - 5)});
});

// file download
router.get('/profiles/:id', function(req, res, next) {
    if (req.params.id) {
        res.set('Content-Type', 'application/octet-stream');
        res.sendFile(helpers.getProfilePath(req));
    } else {
        res.sendStatus(400);
    }
})

// helpers
function renderGet(url, template) {
    router.get(url, function(req, res, next) {
        res.render(template, { title: config.title, url: config.url});
    });
}

module.exports = router;
