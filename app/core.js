/**
 * Created by mr18 on 17.3.10.
 */
var CONST = require('./constant.js');
var UrlMap = require('./urlmap.js');

var replaceHref = function (html, host, path) {
    var hostCode = UrlMap.getCodeByHost(host);
    return html.replace(/[\n\t\f\r]*/g, '').replace(CONST.hrefRe, function ($0, $1, $2) {
        var urlHost = ( $2.match(CONST.hostRe) || [])[3];
        var hostCode2 = UrlMap.getCodeByHost(urlHost);
        var newHref = $2.replace(CONST.hostRe, '').replace(/^\/+/, '');
        //相对路径
        if (!urlHost && CONST.dirSourceRe.test($2)) {
            if ($2.charAt(0) == '/') {
                newHref = hostCode + '/' + newHref;
            } else {
                newHref = hostCode + '/' + newHref;
            }
            newHref = CONST.MY_HOST + newHref;
        } else if (!/^(#|javascript:)[^/]*/.test(newHref)) {
            newHref = CONST.MY_HOST + (urlHost ? hostCode2 : '') + '/' + newHref
        } else {
            newHref = $2;
        }
        return $1 + newHref
    });
}
var replaceResources = function (html, host, path) {
    return html.replace(CONST.linkHrefRe, function ($0, $1, $2) {
        var newHref = $2;
        var urlHost = ( $2.match(CONST.hostRe) || [])[3];
        if (!urlHost && CONST.dirSourceRe.test($2)) {
            newHref = newHref.replace(/^\/+/, '')
            if ($2.charAt(0) == '/') {
                newHref = '//' + host + '/' + newHref
            } else {
                newHref = path + '/' + newHref
            }
        }
        return $1 + newHref
    });
}

var replaceSrc = function (html, host, path) {
    return html.replace(CONST.srcRe, function ($0, $1, $2) {
        var newHref = $2;
        var urlHost = ( $2.match(CONST.hostRe) || [])[3];
        if (!urlHost && CONST.dirSourceRe.test($2)) {
            newHref = newHref.replace(/^\/+/, '');
            if ($2.charAt(0) == '/') {
                newHref = '//' + host + '/' + newHref
            } else {
                newHref = path + '/' + newHref
            }
        }
        return $1 + newHref
    });
}

var getRequestUrl = function (req) {
    var url = (req.url || '').replace(/^\/+/, '');
    var urlHost = ( url.match(CONST.hostRe) || [])[3];
    var host = UrlMap.getHostByCode((url.match(/\w+/) || [])[0]);
    if (!host) {
        host = urlHost;
        UrlMap.getHostMap(urlHost);
    }
    if (url) {
        //url中包含域名
        if (host) {
            url = 'http://' + host + '/' + url.replace(CONST.hostRe, '');
        } else {
            url = 'http://' + CONST.MY_HOST + url;
        }
    } else {
        url = CONST.REQUEST_URL;
    }
    return url
}
module.exports = {
    replaceHref: replaceHref,
    replaceResources: replaceResources,
    replaceSrc: replaceSrc,
    getRequestUrl: getRequestUrl
}

