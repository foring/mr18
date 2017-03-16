/**
 * Created by mr18 on 17.3.10.
 */
var CONST = require('./constant.js');
var UrlMap = require('./urlmap.js');

var replaceHref = function (html, host, path) {
    var Map = UrlMap.getHostMap(host);
    return html.replace(/[\n\t\f\r]*/g, '').replace(CONST.hrefRe, function ($0, $1, $2) {
        var urlHost = ( $2.match(CONST.hostRe) || [])[3];
        var Map2 = UrlMap.getHostMap(host);

        var newHref = $2.replace(CONST.hostRe, '').replace(/^\/+/, '');
        //相对路径
        if (!urlHost && CONST.dirSourceRe.test($2)) {
            if ($2.charAt(0) == '/') {
                newHref = Map.code + '/' + newHref;
            } else {
                newHref = Map.code + '/' + newHref;
            }
            newHref = CONST.MY_HOST + newHref;
        } else if (!/^(#|javascript:)[^/]*/.test(newHref)) {
            newHref = CONST.MY_HOST + (urlHost ? urlHost : '') + '/' + newHref
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
    if (url) {
        //url中包含域名
        if (urlHost) {
            url = 'http://' + url;
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

