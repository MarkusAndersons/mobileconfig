var express = require('express');
var config = require('../config');
var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
var uuid = require('uuid');
var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'tmp/' });

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


router.get('/begin', function(req, res, next) {
    res.render('begin', { title: config.title });
});

// display generate page
router.get('/generate', function(req, res, next) {
    res.render('generate', { title: config.title });
});

// display settings options page
router.get('/generate/certificate', function(req, res, next) {
    res.render('generator/certificate', { title: config.title, url: config.url});
});
router.get('/generate/certificate/upload', function(req, res, next) {
    res.render('generator/certificate-upload', { title: config.title, url: config.url});
});
router.get('/generate/email', function(req, res, next) {
    res.render('generator/email', { title: config.title });
});
router.get('/generate/wifi', function(req, res, next) {
    res.render('generator/wifi', { title: config.title });
});

// get current settings for a profile
/*      This is replaced by the api below
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
*/

/////// API //////
// store general settings
router.post('/api/general_settings', function(req, res) {
    if (!req.body.PayloadIdentifier) {
        res.sendStatus(400);
    } else {
        sess.general = req.body;
        sess.general.PayloadVersion = 1;
        sess.general.PayloadUUID = uuid.v4();
        res.sendStatus(200);
    }
});

router.post('/api/certificate_settings', upload.single("fileInput"), function(req, res) {
    if (!req.body.PayloadDisplayName) {
        res.sendStatus(400);
    } else {
        var configuration = req.body;
        if (!configuration.PayloadVersion) {
            configuration.PayloadVersion = 1;
        }
        configuration.PayloadUUID = uuid.v4();
        configuration.PayloadType = "com.apple.security.pem";
        //console.log(configuration);
        sess.tempCertSettings = configuration;
        res.sendStatus(200);
    }
});
router.post('/api/certificate_upload', upload.single("fileInput"), function(req, res) {
    sess.tempCertSettings.PayloadCertificateFileName = req.file.originalname;
    console.log(sess.tempCertSettings);
    //TODO delete the file after complete
    //TODO compile the payload
    res.redirect('/generate');  // TODO need a permanent fix
    //res.sendStatus(200);
});

// payload settings extraction
function individualProfile(template, configuration) {
    var template = handlebars.compile(fs.readFileSync(path.join(__dirname, "../config_templates", template + ".mobileconfig")), "utf-8");
    var locSettings = template(configuration);

    if (sess.configurations)
        sess.configurations = sess.configurations.concat([locSettings]);
    else
        sess.configurations = [locSettings];
}


module.exports = router;
