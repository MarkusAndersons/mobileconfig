var express = require('express');
var config = require('../config');
var cleanup = require('../cleanup');
var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
var uuid = require('uuid');
var tmp = require('tmp');
var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'tmp/' });

// initialise
var templates = {
    general: handlebars.compile(fs.readFileSync(path.join(__dirname, "..", "config_templates","base_template.hbs"), "utf-8")),
    certificate : handlebars.compile(fs.readFileSync(path.join(__dirname, "../config_templates","certificate_template_part1.hbs"), "utf-8")),
    certificateEnd : handlebars.compile(fs.readFileSync(path.join(__dirname, "../config_templates","certificate_template_part2.hbs"), "utf-8")),
    email : handlebars.compile(fs.readFileSync(path.join(__dirname, "../config_templates","email_template.hbs"), "utf-8"))
};

cleanup.deleteFilesAfterHour();


/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.email) {
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

//renderGet('/download', 'download');
router.get('/download', function(req, res, next) {
    if (!req.session.profilePath) req.session.profilePath = null;
    res.render('download', { title: config.title, url: config.url, downloadUrl: '/profiles/' + req.session.profilePath.substr(5, req.session.profilePath.length - 5)});
});

// file download
router.get('/profiles/:id', function(req, res, next) {
    if (req.params.id) {
        res.set('Content-Type', 'application/octet-stream');
        res.sendFile(path.join(__dirname, '..', req.session.profilePath.substr(1, req.session.profilePath.length - 1)));
    } else {
        res.sendStatus(400);
    }
})

/////// API //////
// store general settings
router.post('/api/general_settings', function(req, res) {
    if (!req.body.PayloadIdentifier) {
        res.sendStatus(400);
    } else {
        req.session.general = req.body;
        req.session.general.PayloadVersion = 1;
        req.session.general.PayloadUUID = uuid.v4();
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
        configuration.PayloadIdentifier = req.session.general.PayloadIdentifier + ".certificate";
        //console.log(configuration);
        req.session.tempCertSettings = configuration;
        res.sendStatus(200);
    }
});
router.post('/api/certificate_upload', upload.single("fileInput"), function(req, res) {
    req.session.tempCertSettings.PayloadCertificateFileName = req.file.originalname;
    var tmpCert = fs.readFileSync(req.file.path, 'utf8');
    req.session.tempCertSettings.PayloadContent = String(tmpCert).substr(28, String(tmpCert).length - 55);
    //console.log(req.session.tempCertSettings);

    // delete the cert file
    fs.unlink(req.file.path, (err) => {
        if (err) throw err;
        console.log('successfully deleted ' + req.file.path);
    });

    // compile the payload
    individualProfileCompile(templates.certificate, req.session.tempCertSettings, req);
    // reset to allow more than one certificate
    req.session.tempCertSettings = {};

    res.redirect('/generate');  // need a permanent fix
    //res.sendStatus(200);
});




router.get('/api/create_profile', function(req, res, next) {
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

function renderGet(url, template) {
    router.get(url, function(req, res, next) {
        res.render(template, { title: config.title, url: config.url});
    });
}

module.exports = router;
