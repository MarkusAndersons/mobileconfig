var express = require('express');
var config = require('../config');
var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
var router = express.Router();

/* GET home page. */
var sess;
router.get('/', function(req, res, next) {
    sess = req.session;
    if (sess.email) {
        console.log("Already defined");
        res.render('index-with-confirm', { title: config.title, currentEmail: sess.email });
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
    console.log('recieved email');
    sess.email = req.body.address;
    console.log(sess.email);
    res.sendStatus(200);
});

// display generate page
router.get('/generate', function(req, res, next) {
    res.render('generate', { title: config.title });
});

// display settings options page
router.get('/generate/certificate', function(req, res, next) {
    res.render('generator/certificate', { title: config.title, url: config.url});
});
router.get('/generate/email', function(req, res, next) {
    res.render('generator/email', { title: config.title });
});
router.get('/generate/wifi', function(req, res, next) {
    res.render('generator/wifi', { title: config.title });
});

// get current settings for a profile
router.post('/add_payload', function(req, res) {
    console.log('recieved payload');
    // determine type of payload
    if (req.body.configType == "certificate") {
        individualProfile("certificate_template", req);
    } else if (req.body.configType == "email") {
        individualProfile("email_template", req);
    } else if (req.body.configType == "wifi") {
        individualProfile("wifi_template", req);
    } else if (req.body.configType == "restrictions") {
        individualProfile("restrictions_template", req);
    }

    res.sendStatus(200);
});

// payload settings extraction
function individualProfile(template, req) {
    var inputSettings = req.body.configuration;
    var template = handlebars.compile(fs.readFileSync(path.join(__dirname, "../config_templates", template + ".mobileconfig")), "utf-8");
    var locSettings = template(inputSettings);

    if (sess.configurations)
        sess.configurations = sess.configurations.concat([locSettings]);
    else
        sess.configurations = [locSettings];
}


/////// API //////

router.post('/api/certificate_generation', function(req, res) {


    res.sendStatus(200);
    window.location = config.url + "/download_profile"; ///?????????
});)


module.exports = router;
