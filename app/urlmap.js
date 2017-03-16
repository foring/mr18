/**
 * Created by mr18 on 17.3.10.
 */
var FS = require('fs');
var Crypto = require('crypto');
var md5 = function (text) {
    text = text || "";
    return Crypto.createHash('md5').update(text).digest('hex');
};

var encodeStr = function (str) {
    var str = md5(str);
    var num = 0,
        result = '';
    for (var i = 0, len = str.length; i < len; i++) {
        num += str.charCodeAt(i);
    }
    num = num + '';
    for (var i = 0, len = num.length; i < len; i++) {
        result += String.fromCharCode(parseInt(num[i]) + 97);
    }
    return result
}


var hostMap = {};
var codeMap = {};
var hostMapPath = 'data/hostMap.json';

var initData = function () {
    try {
        var text = FS.readFileSync(hostMapPath, 'utf-8');
        hostMap = JSON.parse(text);
    } catch (e) {
    }
    for (var a in hostMap) {
        codeMap[hostMap[a]] = a;
    }
}
initData();
var getHostMap = function (host) {
    if (/^#/.test(host)) return;
    if (!hostMap[host]) {
        var code = encodeStr(host);
        hostMap[host] = code;
        codeMap[code] = host
        FS.writeFile(hostMapPath, JSON.stringify(hostMap), function () {
        });
    }
    return {
        hostMap: hostMap,
        codeMap: codeMap,
        host: host,
        code: hostMap[host]
    };
}
var getHostByCode = function (code) {
    return codeMap[code]
}
var getCodeByHost = function (host) {
    return (getHostMap(host) || {}).code
}
module.exports = {
    getHostMap: getHostMap,
    getCodeByHost: getCodeByHost,
    getHostByCode: getHostByCode
}

