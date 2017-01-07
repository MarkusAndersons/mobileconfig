
var config = {};

config.title = "Configuration Profile Generator";
config.url = "http://localhost:3000";

// session data
config.session = {};
config.session.secret = "D0D0EE5B-254E-4E3C-8104-9F9CC209FE1F";
config.session.useRedis = false;    // change this to true to use redis as the session cache
config.redis = { host: "127.0.0.1",
                 port: "6379"
};

// email settings
// curently only supports mailgun
config.mail = {
    api_key: '',
    domain: '',
    data: {
        from: 'Markus Andersons <no-reply@markusandersons.com>',
        to: '',
        subject: '',
        text: '',
        attachment: ''
    }
};



module.exports = config;
