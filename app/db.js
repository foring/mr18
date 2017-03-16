/**
 * Created by mr18 on 17.3.10.
 */

var UrlList = [];
var FS = require('fs');
var dayTime = 1000 * 60 * 60 * 24;

var md5 = function (text) {
    text = text || "";
    return Crypto.createHash('md5').update(text).digest('hex');
};

var saveUrl = function (url) {
    if (UrlList.indexOf(url) < 0) {
        UrlList.push(url);
    }
    if (UrlList.length >= 100) {
        var path = './static/sitemap/' + parseInt(new Date().getTime() / dayTime) + '.txt';
        FS.writeFile(path, UrlList.join('\n'), {
            flag: FS.existsSync(path) ? 'a' : 'w'
        }, function () {

        });
        UrlList = [];
    }
}

module.exports = {
    saveUrl: saveUrl
}

