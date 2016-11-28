var express = require('express');
var config = require('../config');
var handlebars = require('handlebars');
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

router.get('/generate', function(req, res, next) {
    res.render('generate', { title: config.title });
});


module.exports = router;
