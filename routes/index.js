var express = require('express');
var config = require('../config');
var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
var uuid = require('uuid');
var tmp = require('tmp');
var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'tmp/' });


var templates = {
    general: handlebars.compile(fs.readFileSync(path.join(__dirname, "..", "config_templates","base_template.hbs"), "utf-8")),
    certificate : handlebars.compile(fs.readFileSync(path.join(__dirname, "../config_templates","certificate_template_part1.hbs"), "utf-8")),
    certificateEnd : handlebars.compile(fs.readFileSync(path.join(__dirname, "../config_templates","certificate_template_part2.hbs"), "utf-8")),
    email : handlebars.compile(fs.readFileSync(path.join(__dirname, "../config_templates","email_template.hbs"), "utf-8"))
};

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
    sess.email = req.body.address;
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

renderGet('/download', 'download');


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
        configuration.PayloadIdentifier = sess.general.PayloadIdentifier + ".certificate";
        //console.log(configuration);
        sess.tempCertSettings = configuration;
        res.sendStatus(200);
    }
});
router.post('/api/certificate_upload', upload.single("fileInput"), function(req, res) {
    sess.tempCertSettings.PayloadCertificateFileName = req.file.originalname;
    var tmpCert = fs.readFileSync(req.file.path, 'utf8');
    sess.tempCertSettings.PayloadContent = String(tmpCert).substr(28, String(tmpCert).length - 55);
    console.log(sess.tempCertSettings);

    // delete the cert file
    fs.unlink(req.file.path, (err) => {
        if (err) throw err;
        console.log('successfully deleted ' + req.file.path);
    });

    // compile the payload
    individualProfileCompile(templates.certificate, sess.tempCertSettings);
    // reset to allow more than one certificate
    sess.tempCertSettings = {};

    res.redirect('/generate');  // need a permanent fix
    //res.sendStatus(200);
});




router.get('/api/create_profile', function(req, res, next) {
    var PayloadContent = "";
    for (var i = 0; i < sess.configurations.length; i++) {
        PayloadContent += sess.configurations[i];
    }
    var profile = templates.general(sess.general);
    profile += PayloadContent;
    profile += "</array></dict></plist>";

    // THIS NEEDS TO BE DONE
    /*var path = '../tmp/' + sess.email + '.mobileconfig';
    console.log(path);
    fs.closeSync(fs.openSync(filepath, 'w'));
    fs.writeFile(path, profile, (err) => {
        console.log("saved to " + path);
    });
    sess.profilePath = path;*/
    res.sendStatus(200);
});

// payload settings extraction
function individualProfileCompile(template, configuration) {
    var locSettings = template(configuration);

    if (template === templates.certificate) {
        locSettings += configuration.PayloadContent;
        locSettings += templates.certificateEnd(configuration);
    }

    if (sess.configurations)
        sess.configurations = sess.configurations.concat([locSettings]);
    else
        sess.configurations = [locSettings];
}

function renderGet(url, template) {
    router.get(url, function(req, res, next) {
        res.render(template, { title: config.title, url: config.url});
    });
}

module.exports = router;
