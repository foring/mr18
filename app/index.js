/**
 * Created by mr18 on 17.3.10.
 */

var Download = require('../module/download.js');
var CONSTANT = render('./constant.js');

var getRequestUrl = function (url) {
    url = (url || '').replace(/^\/*/, '');
    return url ? 'http://' + url : CONSTANT.REQUEST_URL;
}
var HostRe = /^(http:|https:)*(\/\/)*([^\/]+)/;
var hrefRe = /(<a[^>]+href=\")([^\"]+)([^>]*)/ig;
var headRe = /(<head.*)(<\/head>)/;

var errorPage = function (req, res) {
    var html = CONSTANT.ERROR_PAGE.replace(headRe, function ($0, $1, $2) {
        return $1 + CONSTANT.SITE_SCRIPT + $2;
    })
    res.status(404);
    res.send(html);
}
var renderPage = function (req, res, html) {
    html = CONSTANT.ERROR_PAGE.replace(headRe, function ($0, $1, $2) {
        return $1 + CONSTANT.SITE_SCRIPT + $2;
    })
    res.status(200);
    res.send(html);
}

var replaceHref = function (html) {
    html = html || '';
    html = html.replace(/[\n\t\f\r]*/g, '').replace(hrefRe, function ($0, $1, $2, $3) {
        var urlHost = ( $2.match(HostRe) || [])[3];
        var newHref = $2.replace(HostRe, '').replace(/^\/+/, '');
        if (!/^(#|javascript:)[^/]*/.test(newHref)) {
            newHref = CONSTANT.MY_HOST + (urlHost ? urlHost : mainHost) + '/' + newHref
        } else {
            newHref = $2;
        }
        return $1 + newHref + $3
    });
    return html;
}
var render = function (req, res) {
    var url = getRequestUrl(req.url);
    var hostArr = url.match(HostRe) || [];
    var mainHost = hostArr[3];
    //有host
    if (mainHost) {
        Download(url, function (html) {
            html = replaceHref(html);
            if (!html) {
                errorPage(req, res);
            } else {
                renderPage(req, res, html);
            }

        })
    } else {
        errorPage(req, res);
    }

}


module.exports = render

