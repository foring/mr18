/**
 * Created by mr18 on 15-12-9.
 */



var fs = require('fs');
var Buffer = require('buffer').Buffer;


//数字的特征
var Num = function (config) {
    config = config || {};
    this.value = config.value;
    this.randomVal = this.random();
}


Num.prototype = {
    //随机生成器
    random: function () {
        return Math.random() * 20;
    }
}

module.exports = function (config) {
    return new Num(config);
};