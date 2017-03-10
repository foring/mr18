/**
 * Created by mr18 on 17.3.10.
 */

var Download = require('../module/download.js');
//var Crypto = require('crypto');
//var Md5 = Crypto.createHash('md5',32);
var myHost = 'http://www.mr18.me/';
var requestUrl = 'http://www.jianshu.com';
var getRequestUrl = function (url) {
    url = (url || '').replace(/^\/*/, '');
    return url ? 'http://' + url : requestUrl;
}
var HostRe = /^(http:|https:)*(\/\/)*([^\/]+)/;
var aRe = /<a[^>]*>.+<\/a>/ig;
var hrefRe = /(<a[^>]+href=\")([^\"]+)([^>]*)/ig;

var render = function (req, res) {
    var url = getRequestUrl(req.url);
    var hostArr = url.match(HostRe) || [];
    var mainHost = hostArr[3];

    //有host
    if (mainHost) {
        Download(url, function (html) {
            html = html || '';
            html = html.replace(/[\n\t\f\r]*/g, '')
            html = html.replace(hrefRe, function ($0, $1, $2, $3) {
                var urlHost = ( $2.match(HostRe) || [])[3];
                var newHref = $2.replace(HostRe, '').replace(/^\/+/, '');
                if (urlHost) {
                    newHref = myHost + urlHost + '/' + newHref
                } else {
                    newHref = myHost + mainHost + '/' + newHref
                }
                return $1 + newHref + $3
            });
            res.status(200);
            res.send(html);
        })
    } else {
        res.status(404);
        res.send('<!DOCTYPE html><html><head></head><body><h1>404 Page</h1></body>');
    }

}


module.exports = render

