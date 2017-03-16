/**
 * Created by mr18 on 15-12-9.
 */
var Express = require('express');
var App = Express();
var BodyParser = require('body-parser');
var Index = require('./app/index.js');
var staticDir = __dirname + '/static';
App.use(Express.static(staticDir, {
    setHeaders: function (res, path, stat) {
        res.header("Transfer-Encoding", "chunked");
    }
}));

App.use("/favicon.ico", Express.static(staticDir));
App.use("/static", Express.static(staticDir));
//App.use("*/*.js.map", Express.static(staticDir));
App.use(BodyParser.urlencoded({extended: false, limit: '100mb'}));

App.get('*', function (req, res, next) {
    next();
})
App.use(Index);
App.listen(8888);
console.log('running........... \t port : 8888');