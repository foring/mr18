/**
 * Created by mr18 on 15-12-9.
 */

var fs = require('fs');
var Buffer = require('buffer').Buffer;
var Chreerio = require('cheerio');
var Download = require('./Download.js');
var Async = require('async');
var $ = Chreerio.load('', {decodeEntities: false, ignoreWhitespace: true});

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var getArrVarPos = function (count) {
    var temp = {};
    while (count-- > 0) {
        temp[count] = count;
    }
    return temp;
}
var movePosNum = function (len, pos, config) {
    var max = config.count - 1;
    if (pos[config.at] >= len - ( config.count - config.at)) {

        //找出递增的at值
        var at = max;
        while (at >= 0) {
            if (pos[at] < len - ( config.count - at)) {
                config.at = at;
                break;
            }
            at--;
        }

        //重置at之后数据
        pos[config.at]++;
        var i = config.at;
        while (i++ < max) {
            pos[i] = pos[i - 1] + 1;
        }
        config.at = max;

    } else {

        pos[config.at]++;

    }
}

var Utils = function (length, count) {
    this.Length = length || 33;
    this.Count = count || 6;
    this.AllNum = this.getAllNum();
    this.loadData();
    this.getNumIndex();

};
//2016001.06131618202213  2016-01-03 21:15:00
//2016020.01021012222410  2016-02-23 21:15:00
Utils.prototype = {
    //概率函数随机取值0-1
    myRandom: function () {
        var temp1 = '2016001.06131618202213/2016-01-03 21:15:00';
        var temp2 = '2016020.01021012222410/2016-02-23 21:15:00';

        var getNum = function (str) {
            var arr1 = str.split('/');
            var arr2 = arr1[0].split('.');
            return {
                step: parseInt(arr2[0]),
                num: parseInt(arr2[1]),
                time: arr1[1]
            }
        }
        var result1 = getNum(temp1), result2 = getNum(temp2);
        var getCommon = function (res) {
            var num1 = new Date(res.num).getTime() - new Date(res.time).getTime();
            var num2 = res.num % num1;
            console.log(num1)
            console.log(num2)
        }
        getCommon(result1);
        getCommon(result2);
    },
    fillNum: function (num) {
        return num < 10 ? ('0' + num) : ( num + '')
    },
    //初始值
    getAllNum: function (length) {
        length = length || this.Length;
        var rt = [];
        for (var i = 1; i <= length; i++) {
            rt.push(i < 10 ? ('0' + i) : ( i + ''));
        }
        return rt;
    },
    //所有组合长度
    getArrLen: function (len, count, rs) {

        rs = rs || 1;
        len = len || this.Length;
        count = count || this.Count;
        if (count > 1) {
            rs *= len / count;
            return this.getArrLen(len - 1, count - 1, rs);
        } else {
            return rs * len;
        }

    },
    //数组取和
    arrSum: function (arr, parse) {

        var res = 0;

        for (var i = 0, len = arr.length; i < len; i++) {

            if (parse == false) {
                res += arr[i];
            } else {
                res += parseInt(arr[i]);
            }
        }
        return res;

    },
    //所有组合
    getAllArr: function (arr, count) {
        arr = arr || this.AllNum;
        count = count || this.Count;

        var rs = [], me = this;
        var allLen = this.getArrLen(arr.length, count),
            arrLen = arr.length,
            varPos = getArrVarPos(count);

        var config = {
            count: count,
            at: count - 1
        };

        while (allLen > 0) {
            var temp = [];
            for (var a in  varPos) {
                temp.push(arr[varPos[a]]);
            }
            rs.push(temp.sort());
            allLen--;


            movePosNum(arrLen, varPos, config, count);

        }
        console.log('exec getAllArr end; \t length = ' + rs.length);
        return rs;
    },
    //取得某一数字（顺序）的组合长度
    getNumIndex: function () {
        // 数字的index索引值
        this.numIndex = {};
        for (var a = 0, len = this.AllArr.length; a < len; a++) {
            this.numIndex[this.AllArr[a].join('')] = a;
        }
    },
    //从arr中抽取某一数字的所有集合
    getOneNumOfAll: function (num, arr) {
        var rs = [];
        var all = arr || this.AllArr || this.loadData();
        num = parseInt(num);
        num = num < 10 ? ('0' + num) : ( num + '');

        all.forEach(function (data) {
            if (data.indexOf(num) >= 0) {
                rs.push(data);
            }
        });
        console.log('exec getOneNumOfAll end; \t length =   ' + rs.length);
        return rs;
    },
    //从arr中抽取多个数字所有集合
    getNumsOfAll: function (num, arr) {
        var rs = [];
        var all = arr || this.AllArr || this.loadData();
        if (typeof num !== "object") {

            return this.getOneNumOfAll(num, arr);

        } else {
            all.forEach(function (data) {
                var hasIn = false;
                for (var i = 0; i < num.length; i++) {
                    if (data.indexOf(num[i] + '') >= 0) {
                        hasIn = true;
                        break;
                    }
                }
                if (hasIn) {
                    rs.push(data);
                }
            });
        }

        console.log('exec getNumsOfAll end; \t length =   ' + rs.length);
        return rs;
    },
    //去掉一个数
    removeOneNum: function (num, arr) {
        var rs = [];
        var all = arr || this.AllArr || this.loadData();
        num = num < 10 ? ('0' + num) : ( num + '');
        all.forEach(function (data) {
            if (data.indexOf(num) < 0) {
                rs.push(data);
            }
        });
        console.log('exec removeOneNum end; \t length =   ' + rs.length);
        return rs;
    },
    //去掉多个数
    removeNumsOfArr: function (num, arr) {
        var rs = [];
        var all = arr || this.AllArr || this.loadData();
        if (typeof num !== 'object') {

            return this.removeOneNum(num, arr);

        } else {

            var numRe = new RegExp(num.join('|'));

            all.forEach(function (data) {

                if (!numRe.test(data.join(','))) {

                    rs.push(data);
                }
            });

        }


        console.log('exec removeNumsOfArr end; \t length =   ' + rs.length);
        return rs;
    },
    //取得剩下的num
    getRestNum: function (arr, length) {
        var rs = [];
        var all = this.getAllNum(length);
        all.forEach(function (data) {
            if (arr.indexOf(data) < 0) {
                rs.push(data);
            }
        });
        console.log('exec getRestNum end; \t length =  ' + rs.length);
        return rs;
    },
    //取得相连的num
    getContinuityNum: function (arr) {
        var rs = [];
        for (var i = 0, length = arr.length; i < length; i++) {
            var temp = arr[i];
            for (var a = 1; a < temp.length; a++)
                if (temp[a] - temp[a - 1] == 1) {
                    rs.push(temp);
                    break;
                }
        }
        console.log('exec getContinuityNum end; \t length =  ' + rs.length);
        return rs;
    },
    //取得剩下的Arr
    getRestArr: function (arr) {
        var rs = [], has = {};
        arr.forEach(function (data) {
            has[data.join(',')] = 1;
        });
        this.AllArr = this.AllArr || this.getAllArr();

        this.AllArr.forEach(function (item) {

            if (has[item.join(',')] !== 1) {

                rs.push(item);
            }
        });

        this.saveData('rest_arr', rs);

        console.log('exec getRestArr end; \t length = ' + rs.length);

        return rs;
    },
    //从两组数据中取得集合
    getArrFrom2Arr: function (arr1, num1, arr2, num2) {

        var rs = [];

        var allArr1 = this.getAllArr(arr1, num1);
        var allArr2 = this.getAllArr(arr2, num2);

        allArr1.forEach(function (data1) {

            allArr2.forEach(function (data2) {

                rs.push(data1.concat(data2).sort());
            })
        })

        console.log('exec getArrFrom2Arr end; \t length = ' + rs.length);
        return rs;
    },
    //两个arr中完全相同的数
    sameOfArr: function (arr1, arr2) {
        var rs = [], flag = {}
        arr1.forEach(function (item) {
            flag[item.sort().join(',')] = true;
        });

        arr2.forEach(function (item) {
            if (flag[item.sort().join(',')]) {
                rs.push(item)
            }
        })
        console.log('exec sameOfArr end; \t length = ' + rs.length);
        return rs;
    },
    //arr中相同的num
    sameNumOfArr: function (arr, num) {
        var rs = [];
        if (typeof num == 'string') {
            num = [num];
        }
        num.forEach(function (item) {

            arr.forEach(function (data) {

                data.indexOf(item) >= 0 && rs.push(data);
            })
        })
        console.log('exec sameNumOfArr end; \t length = ' + rs.length);
        return rs;
    },
    //是否在arr中
    hasInArr: function (arr, num) {

        var flag = false;
        num = num.join(',');
        arr.forEach(function (item, index) {
            if (item.join(',') == num) {
                flag = index;
            }
        });
        //console.log('exec hasInArr end; ' + num + ' \t hasInArr = ' + flag);
        return flag;
    },
    //取得某一数字的组合
    getNumArr: function (arr, num) {

        var rt = [];
        if (typeof num === 'string') {
            num = [num];
        }
        var numRe = new RegExp(num.join('|'), 'g');
        arr.forEach(function (item) {
            if (numRe.test(item.join(','))) {
                rt.push(item);
            }
        });
        console.log('exec getNumArr end; \t length = ' + rt.length);
        return rt;
    },
    //数字组合去重
    uniqueArr: function (arr) {
        var rt = [], flag = {};

        arr.forEach(function (data) {
            if (!flag[data.join(',')]) {
                flag[data.join(',')] = true;
                rt.push(data);
            }
        });
        console.log('exec uniqueArr end; form  \t length  = ' + arr.length + '\t to  \t length = ' + rt.length);
        return rt;
    },
    //数字去重
    uniqueNum: function (arr) {
        var rt = [];

        arr.forEach(function (data) {

            if (typeof data === 'object') {

                data.forEach(function (item) {
                    rt.indexOf(item) < 0 && rt.push(item);
                });
            } else {
                rt.indexOf(data) < 0 && rt.push(data);
            }
        })
        rt = rt.sort();
        console.log('exec uniqueNum end; \t unique = ' + rt + ' : ' + rt.length);
        return rt;
    },
    //取随机数
    randomValue: function (count) {
        var rt = [];
        this.AllArr = this.AllArr || this.getAllArr();

        while (count-- > 0) {
            rt.push(this.AllArr[parseInt(Math.random() * this.AllArr.length)]);
        }
        console.log('exec randomValue end;  rt=' + rt.length);
        return rt;
    },
//取得相连的数字组合
    getConnectedArr: function (arr, connect) {
        var rs = [];
        arr = arr || this.getAllArr();
        for (var i = 0; i < arr.length; i++) {

            var isConnect = false;

            for (var a = 1; a < arr[i].length; a++) {

                if (arr[i][a] - arr[i][a - 1] == 1) {
                    isConnect = true;
                    break;
                }
            }

            if (connect !== false && isConnect) {
                rs.push(arr[i]);
            } else if (connect === false && !isConnect) {
                rs.push(arr[i]);
            }
        }
        return rs;
    },
    //对半分割数组
    halfArr: function (arr, trendPath, minLen) {
        var halfCount = 0,
            trend = [];
        arr = arr || this.AllArr || this.loadData();

        minLen = minLen || 1;

        var half = function (arr) {

            if (arr.length > minLen) {

                //flag值为1,0，1取后半部分，0取前半部分
                var flag;

                //随机变换
                if (trendPath === true) {

                    flag = Math.round(Math.random());

                } else {
                    if (typeof trendPath == 'function') {

                        flag = trendPath(arr);

                    } else {
                        flag = trendPath[halfCount];
                    }
                }
                trend.push(flag);

                var start = 0, end = arr.length;

                if (flag > 0) {
                    start = Math.floor(end / 2);
                } else {
                    end = Math.ceil(end / 2);
                }
                var temp = [];
                for (var i = start; i < end; i++) {
                    temp.push(arr[i]);
                }
                halfCount++;
                return half(temp);

            } else {
                return {
                    data: arr,
                    trend: trend,
                    length: trend.length
                };
            }
        };
        return half(arr);
    },
    //取得数字对半分割的路径
    getHalfPath: function (num, length) {
        length = length || this.getArrLen();
        var pos = num;
        //取得数字所在的位置
        if (typeof num == 'object') {
            pos = this.numIndex[num.join('')];
        }
        var pathArr = [],
            start = 0,
            end = length,
            len = end - start;
        while (len > 1) {
            //在数组的后半部分
            if (pos >= start + len / 2) {
                start = Math.floor(start + len / 2);
                pathArr.push(1);
            } else {
                end = Math.ceil(start + len / 2);
                pathArr.push(0);
            }
            len = end - start;
        }
        var numTemp = '', compress = [];
        for (var a = 0; a < pathArr.length; a++) {
            numTemp += pathArr[a];
            if (numTemp.length == 5) {
                compress.push(this.fillNum(parseInt(numTemp, 2)));
                numTemp = '';
            }
        }
        return {
            path: pathArr,
            index: pos,
            num: num,
            compress: compress
        };
    },

    //取得最优路径
    getOptimumPath: function () {

    },
    //字符编码0-9a-zA-Z
    getAssicNum: function () {
        var assicNum = {};
        var getNum = function (from, to) {
            for (var i = from; i <= to; i++) {
                assicNum[i] = String.fromCharCode(i);
            }
        };
        getNum(48, 57);
        getNum(65, 90);
        getNum(97, 122);

        return assicNum;

    },
    getData: function (name) {
        var data;
        try {
            var text = fs.readFileSync('data/' + name + '.json', 'utf-8');

            data = JSON.parse(text);

        } catch (e) {
        }
        return data;
    },
    loadData: function (name, customData) {
        name = name || 'all_arr';


        var me = this, data;

        if (!customData && me.AllArr) {

            data = me.AllArr;
        } else {
            try {
                var text = fs.readFileSync('data/' + name + '.json', 'utf-8');

                data = JSON.parse(text) || [];

                if (!customData) {

                    me.AllArr = data;
                }
            } catch (e) {
            }

            if (!data) {
                if (customData) {
                    try {
                        data = customData();
                    } catch (e) {
                        data = [];
                    }
                } else {
                    data = me.getAllArr();
                    me.AllArr = data;

                }
                me.saveData(name, data)
            }
        }
        if (!customData) {
            me.AllStringNum = [];
            for (var i = 0, len = data.length; i < len; i++) {
                me.AllStringNum.push(data[i].join(''));
            }
        }

        console.log('exec loadData data/' + name + '.json  end; \t length = ' + data.length);
        return data
    },
    saveData: function (name, data) {

        name = 'data/' + name + '.json';

        fs.writeFileSync(name, JSON.stringify(data));

        console.log('save data ' + name + ' end; \t length = ' + data.length);

    },
    history: function (callback, random) {

        var me = this;
        var name = 'history';
        //随机取值
        var _callback = function (data) {
            var newData = {red: [], blue: []};
            for (var i = 0; i < data.length; i++) {
                newData.red.push(data[i].red);
                newData.blue.push(data[i].blue);
            }
            newData.data = data;
            callback && callback(newData);
        }

        if (random) {

            var data = me.randomValue(random), result = [];
            for (var i = 0, len = data.length; i < len; i++) {
                result.push({
                    red: data[i],
                    blue: parseInt(Math.random() * 16) + 1,
                    date: 'xxxx',
                    period: i,
                    num: i
                })
            }
            me.saveData(name, result);
            _callback(result);
        } else {
            var historyData = this.getData(name);
            if (historyData) {
                _callback(historyData);
            } else {
                me.loadHistoryData(function (history) {

                    history = history || [];

                    // var url = 'http://www.lecai.com/lottery/draw/list/50?type=range_date&start=2016-01-01&end=' + new Date().Format('yyyy-MM-dd');

                    var url = 'http://chart.cp.360.cn/kaijiang/ssq?lotId=220051&spanType=2&span=2016-01-01_' + new Date().Format('yyyy-MM-dd')
                    Download(url, function (html) {
                        var oHtml = $(html);
                        var oTable = oHtml.find('table.his-table');
                        var oTr = oTable.find('tbody > tr');
                        var temp = [];

                        for (var i = oTr.length - 1; i >= 0; i--) {
                            var aTd = oTr.eq(i).find('td');
                            var red = [];
                            aTd.eq(2).find('span').each(function (index, item) {
                                red.push($(item).text())
                            });
                            temp.push({
                                red: red,
                                blue: aTd.eq(3).text().trim(),
                                date: ( aTd.eq(1).text().match(/[\d\-]+/) || [])[0],
                                period: aTd.eq(0).text(),
                                num: history.length + temp.length
                            });
                        }

                        history = history.concat(temp);

                        me.saveData(name, history);

                        _callback(history);
                    })
                })
            }
        }

    },

    getAllFils: function (dir) {
        dir = dir.replace(/\/$/, '');
        var list = [];
        var me = this;
        var filesList = fs.readdirSync(dir) || [];
        for (var i = 0; i < filesList.length; i++) {
            var path = dir + '/' + filesList[i];
            var stat;
            try {
                //查看文件属性
                stat = fs.lstatSync(path);
            } catch (e) {
                continue;
            }
            if (!stat.isDirectory()) {
                list.push(path);
            } else {
                list = list.concat(me.getAllFils(path));
            }
        }
        return list.sort();
    },
    analysisFile: function (text, length) {
        var result = [];
        var temp = text.split('\n').sort();

        length = length || 0;

        var count = 0;

        for (var i = 0; i < temp.length; i++) {
            var line = temp[i].replace(/\r/, '');
            if (line) {
                var arr1 = line.split('    ');
                var arr2 = arr1[1].split('|');
                result.push({
                    red: arr2[0].split(',').sort(),
                    blue: arr2[1],
                    date: arr1[2],
                    period: arr1[0],
                    num: length + result.length
                });
            }
        }
        return result;
    },
    loadHistoryData: function (callback) {
        var me = this;
        var dir = 'data/original/3316/';
        var fileList = this.getAllFils(dir);
        fileList = fileList.sort();
        var history = [];
        for (var i = 0; i < fileList.length; i++) {
            var text = fs.readFileSync(fileList[i], 'utf-8');
            var temp = me.analysisFile(text, history.length);
            history = history.concat(temp);
        }
        callback && callback(history);
    },
    killData: function (callback) {

        Async.auto({
            red163: function (cb) {
                Download('http://cai.163.com/shahao/ssq/red_100.html', function (html) {

                    var oDom = $(html),
                        oTr = oDom.find('.killNumList').find('tbody').eq(0).find('tr'),
                        rs = [];
                    for (var i = 0; i < oTr.length; i++) {
                        var oTd = oTr.eq(i).find('td'), temp = [];

                        for (var a = 2; a < oTd.length; a++) {

                            var num = (oTd.eq(a).text().match(/^\d+|全对/) || [])[0];
                            if (num) {
                                temp.push(num);
                            }
                        }
                        if (temp.length) {
                            rs.push(temp);
                        }

                    }
                    cb(null, rs)
                })
            },
            blue163: function (cb) {
                Download('http://zx.caipiao.163.com/shahao/ssq/blue_100.html', function (html) {
                    var oDom = $(html),
                        oTr = oDom.find('.killNumList').find('tbody').eq(0).find('tr'),
                        rs = [];
                    for (var i = 0; i < oTr.length; i++) {
                        var oTd = oTr.eq(i).find('td'), temp = [];

                        for (var a = 2; a < oTd.length; a++) {

                            var num = (oTd.eq(a).text().match(/^\d+|全对/) || [])[0];
                            if (num) {
                                temp.push(num);
                            }
                        }
                        if (temp.length) {
                            rs.push(temp);
                        }

                    }
                    cb(null, rs);
                })
            },
            red360: function (cb) {
                Download('http://cp.360.cn/shdd/shax?LotID=220051&ItemID=20343&TopCount=100&r=0.19593333174241967', function (html) {
                    var oDom = $(html),
                        oTr = oDom.find('.shdd-table-cont').find('tbody').eq(0).find('tr'),
                        rs = [];
                    for (var i = 0; i < oTr.length - 6; i++) {
                        var oTd = oTr.eq(i).find('td'), temp = [];

                        for (var a = 2; a < oTd.length; a++) {

                            var num = (oTd.eq(a).text().match(/^\d+|全对/) || [])[0];
                            if (num) {
                                temp.push(num);
                            }
                        }
                        if (temp.length) {
                            rs.push(temp);
                        }

                    }
                    cb(null, rs)
                })
            },
            blue360: function (cb) {
                Download('http://cp.360.cn/shdd/shax?LotID=220051&ItemID=20344&TopCount=100&r=0.49647424060753176', function (html) {
                    var oDom = $(html),
                        oTr = oDom.find('.shdd-table-cont').find('tbody').eq(0).find('tr'),
                        rs = [];
                    for (var i = 0; i < oTr.length - 6; i++) {
                        var oTd = oTr.eq(i).find('td'), temp = [];

                        for (var a = 2; a < oTd.length; a++) {

                            var num = (oTd.eq(a).text().match(/^\d+|全对/) || [])[0];
                            if (num) {
                                temp.push(num);
                            }
                        }
                        if (temp.length) {
                            rs.push(temp);
                        }

                    }
                    cb(null, rs)
                })

            },
            redBaidu: function (cb) {
                Download('http://trend.baidu.lecai.com/ssq/redKillTrend.action?recentPhase=100&onlyBody=false&phaseOrder=up&coldHotOrder=number', function (html) {
                    var oDom = $(html),
                        oTr = oDom.find('#chartTable').find('tbody').eq(0).find('tr'),
                        rs = [];
                    var length = oTr.length;
                    for (var i = 0; i < length - 3; i++) {
                        var oTd = oTr.eq(i).find('td'), temp = [];

                        for (var a = (i == length - 4 ? 1 : 2); a < oTd.length; a++) {

                            var num = (oTd.eq(a).text().match(/^\d+|全对/) || [])[0];
                            if (num) {
                                temp.push(num);
                            }
                        }
                        if (temp.length) {
                            rs.push(temp);
                        }

                    }
                    cb(null, rs)
                })

            },
            blueBaidu: function (cbFb) {
                Download('http://trend.baidu.lecai.com/ssq/blueKillTrend.action?recentPhase=100&onlyBody=false&phaseOrder=up&coldHotOrder=number', function (html) {
                    var oDom = $(html),
                        oTr = oDom.find('#chartTable').find('tbody').eq(0).find('tr'),
                        rs = [];
                    var length = oTr.length;
                    for (var i = 0; i < length - 3; i++) {
                        var oTd = oTr.eq(i).find('td'), temp = [];

                        for (var a = (i == length - 4 ? 1 : 2); a < oTd.length; a++) {

                            var num = (oTd.eq(a).text().match(/^\d+|全对/) || [])[0];
                            if (num) {
                                temp.push(num);
                            }
                        }
                        if (temp.length) {
                            rs.push(temp);
                        }

                    }

                    cbFb(null, rs)
                })

            },
            redOkooo: function (cb) {
                Download('http://www.okooo.com/ajax/shahao/SSQ/20/FN/', function (data) {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                    }
                    var rs = [];
                    for (var a in data) {
                        var killNum = data[a].KillNum;
                        var temp = [], count = 0;
                        for (var b in killNum) {
                            temp.push(killNum[b].Num + '');
                            if (killNum[b].Check == 1) count++;
                        }
                        if (count == 10) {
                            temp.push('全对');
                        } else if (count) {
                            temp.push(count);
                        }
                        rs.push(temp);
                    }

                    cb(null, rs)
                })

            },
            blueOkooo: function (cb) {
                Download('http://www.okooo.com/ajax/shahao/SSQ/100/EN/', function (data) {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                    }
                    var rs = [];
                    for (var a in data) {
                        var killNum = data[a].KillNum;
                        var temp = [], count = 0;
                        for (var b in killNum) {
                            temp.push(killNum[b].Num + '');
                            if (killNum[b].Check == 1) count++;
                        }

                        if (count == 10) {
                            temp.push('全对');
                        } else if (count) {
                            temp.push(count);
                        }
                        rs.push(temp);
                    }
                    cb(null, rs)
                })

            }

        }, function (error, result) {
            var current = {};
            for (var a  in result) {
                current[a] = result[a][result[a].length - 1];
            }
            console.log('killData load end ~~~');
            callback && callback(current, result)
        });
    }
};

module.exports = function (length, count) {
    return new Utils(length, count);
};