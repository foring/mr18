module.exports = {
    //MY_HOST: 'http://www.mr18.me/',
    REQUEST_URL: 'http://www.cnblogs.com',
    SITE_SCRIPT: '<script>var _hmt = _hmt || [];(function() {var hm = document.createElement("script");hm.src = "https://hm.baidu.com/hm.js?3e2feca85a5a456098df289f21a36c09";var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm, s);})();</script>',
    ERROR_PAGE: '<!DOCTYPE html><html><head></head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Mr18 404 Page</title><body><h1>Mr18 404 Page</h1></body>',
    BAIDU_URL_POST: 'http://data.zz.baidu.com/urls?site=www.mr18.me&token=Krz7wbNtcdxf4xNv',
    hostRe: /^(http:|https:)*(\/\/)*([^\/]+)/,
    hrefRe:/(<a[^>]+href=\")([^\"]+)/g,
    linkHrefRe:/(<link[^>]+href=\")([^\"]+)/g,
    srcRe:/(src=\")([^\"]+)/g,
    headRe: /([^<]+)(<\/head>)/,
    dirSourceRe:/^\/{0,1}[^\/]+/,
}