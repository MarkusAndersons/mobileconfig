var express = require('express');
var config = require('../config');
var helpers = require('../logic/helpers');
var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
var uuid = require('uuid');
var tmp = require('tmp');
var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'tmp/' });

var mailgun = require('mailgun-js')({apiKey: config.mail.apiKey,
                                     domain: config.mail.domain});

// initialise
var templates = {
    general: handlebars.compile(fs.readFileSync(path.join(__dirname, "..", "config_templates","base_template.hbs"), "utf-8")),
    certificate : handlebars.compile(fs.readFileSync(path.join(__dirname, "../config_templates","certificate_template_part1.hbs"), "utf-8")),
    certificateEnd : handlebars.compile(fs.readFileSync(path.join(__dirname, "../config_templates","certificate_template_part2.hbs"), "utf-8")),
    email : handlebars.compile(fs.readFileSync(path.join(__dirname, "../config_templates","email_template.hbs"), "utf-8"))
};

/////// API //////
// store general settings
router.post('/general_settings', function(req, res) {
    if (!req.body.PayloadIdentifier) {
        res.sendStatus(400);
    } else {
        req.session.general = req.body;
        req.session.general.PayloadVersion = 1;
        req.session.general.PayloadUUID = uuid.v4();
        res.sendStatus(200);
    }
});

router.post('/certificate_settings', function(req, res) {
    if (!req.body.PayloadDisplayName) {
        res.sendStatus(400);
    } else {
        var configuration = req.body;
        if (!configuration.PayloadVersion) {
            configuration.PayloadVersion = 1;
        }
        configuration.PayloadUUID = uuid.v4();
        configuration.PayloadType = "com.apple.security.pem";
        configuration.PayloadIdentifier = req.session.general.PayloadIdentifier + ".certificate";
        req.session.tempCertSettings = configuration;
        res.sendStatus(200);
    }
});

router.post('/certificate_upload', upload.single("fileInput"), function(req, res) {
    req.session.tempCertSettings.PayloadCertificateFileName = req.file.originalname;
    var tmpCert = fs.readFileSync(req.file.path, 'utf8');
    req.session.tempCertSettings.PayloadContent = String(tmpCert).substr(28, String(tmpCert).length - 55);

    // delete the cert file
    fs.unlink(req.file.path, (err) => {
        if (err) throw err;
        console.log('successfully deleted ' + req.file.path);
    });

    // compile the payload
    individualProfileCompile(templates.certificate, req.session.tempCertSettings, req);
    // reset to allow more than one certificate
    req.session.tempCertSettings = {};
    res.redirect('/generate');
});

router.get('/create_profile', function(req, res, next) {
    var PayloadContent = "";
    for (var i = 0; i < req.session.configurations.length; i++) {
        PayloadContent += req.session.configurations[i];
    }
    var profile = templates.general(req.session.general);
    profile += PayloadContent;
    profile += "</array></dict></plist>";

    var temporaryProfile = tmp.fileSync();
    fs.writeFileSync(temporaryProfile.fd, profile);
    var newPath = "./tmp/" + uuid.v4() + ".mobileconfig";
    fs.renameSync(temporaryProfile.name, newPath);
    req.session.profilePath = newPath.substr(1, newPath.length - 1);
    res.sendStatus(200);
});

router.get('/send_email', function(req, res) {
    var data = config.mail.data;
    data.to = req.session.email;
    data.attachment = helpers.getProfilePath(req);
    mailgun.messages().send(data, function (error, body) {
        console.log(body);
    });
    res.sendStatus(200);
});

// payload settings extraction
function individualProfileCompile(template, configuration, req) {
    var locSettings = template(configuration);

    if (template === templates.certificate) {
        locSettings += configuration.PayloadContent;
        locSettings += templates.certificateEnd(configuration);
    }

    if (req.session.configurations)
        req.session.configurations = req.session.configurations.concat([locSettings]);
    else
        req.session.configurations = [locSettings];
}

module.exports = router;
