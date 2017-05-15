/**
 * Created by mr18 on 17.3.10.
 */

var Download = require('../module/download.js');
var CONST = require('./constant.js');

var Core = require('./core.js');
var DB = require('./db.js');

var errorPage = function (req, res) {
    var html = CONST.ERROR_PAGE.replace(Core.headRe, function ($0, $1, $2) {
        return $1 + CONST.SITE_SCRIPT + $2;
    })
    res.status(404);
    res.send(html);
}
var renderPage = function (req, res, html) {
    html = html.replace(CONST.headRe, function ($0, $1, $2) {
        return $1 + CONST.SITE_SCRIPT + $2;
    })
    res.status(200);
    res.send(html);
}
var render = function (req, res) {
    CONST.MY_HOST = CONST.MY_HOST || ('//' + req.headers.host + '/');
    var url = Core.getRequestUrl(req);
    //console.log(url)
    var hostArr = url.match(CONST.hostRe) || [];
    var mainHost = hostArr[3];
    //console.log(req.url, mainHost)
    //url中不包含host
    if (!mainHost) {
        return errorPage(req, res);
    }
    //有host

    Download(url, function (html) {
        html = html || '';
        var path = url.replace(/(#.*)|(\?.*)/, '').replace(/\/+$/, '');
        html = Core.replaceHref(html, mainHost, path);
        html = Core.replaceResources(html, mainHost, path);
        html = Core.replaceSrc(html, mainHost, path);
        html ? renderPage(req, res, html) : errorPage(req, res);

        //将url保存值本地
        var saveUrl = 'http:' + CONST.MY_HOST + (req.url || '').replace(/^\/+/, '');
        DB.saveUrl(saveUrl);
    });


}


module.exports = render

