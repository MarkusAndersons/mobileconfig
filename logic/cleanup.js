var cron = require('node-cron');
var fs = require('fs');
var path = require('path');
var util = require('util');

var cleanup = {
    deleteFiles: function() {
        var currentTime = new Date();
        var files = fs.readdirSync(path.join(__dirname, "../tmp"));
        for (var i = 0; i < files.length; i++) {
            var stats = fs.statSync(path.join(__dirname, "../tmp", files[i]));
            var mtime = new Date(util.inspect(stats.mtime));
            if (Math.abs(currentTime - mtime) > (1000 * 60 * 60)) {
                fs.unlinkSync(path.join(__dirname, "../tmp", files[i]));
            }
        }
    },
    deleteFilesAfterHour: function() {
        cron.schedule('0 * * * *', function(){
            cleanup.deleteFiles();
        });
    }
};

module.exports = cleanup;
