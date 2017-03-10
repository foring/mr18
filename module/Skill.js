/**
 * Created by mr18 on 15-12-9.
 */

var fs = require('fs');
var Buffer = require('buffer').Buffer;


var fillNum = function (num) {
    num = parseInt(num);
    return num < 10 ? '0' + num : (num + '');
};

var Skill = {
    //"!10": function (arr) {
    //    return fillNum(10);
    //},
    "A+B": function (arr) {
        return fillNum(parseInt(arr[0]) + parseInt(arr[1]));
    },
    "B-A": function (arr) {
        return fillNum(parseInt(arr[1]) - parseInt(arr[0]));
    },
    "A+D": function (arr) {
        var a = parseInt(arr[0]) + parseInt(arr[3]);
        if (a > 33) {
            a = a - 33;
        }
        return fillNum(a);
    },
    "E-C": function (arr) {
        return fillNum(parseInt(arr[4]) - parseInt(arr[2]));
    },
    "F-B+1": function (arr) {
        return fillNum(parseInt(arr[5]) - parseInt(arr[1]) + 1);
    },
    "B+F+1": function (arr) {
        return fillNum(parseInt(arr[5]) + parseInt(arr[1]) + 1);
    },

    "F-B+10": function (arr) {
        return fillNum(parseInt(arr[5]) + parseInt(arr[1]) + 10);
    },
    "D-A+7": function (arr) {
        return fillNum(parseInt(arr[3]) - parseInt(arr[0]) + 7);
    },
    "F-A": function (arr) {
        return fillNum(parseInt(arr[5]) - parseInt(arr[0]));
    },
    "(A+B+C)/3": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + parseInt(arr[1]) + parseInt(arr[2])) / 3));
    },
    "(C+D+E+F)/4": function (arr) {
        return fillNum(parseInt((parseInt(arr[2]) + parseInt(arr[3]) + parseInt(arr[4]) + parseInt(arr[5])) / 4));
    },
    "B+C": function (arr) {
        return fillNum(parseInt((parseInt(arr[1]) + parseInt(arr[2]))));
    },
    "E-D+10": function (arr) {
        return fillNum(parseInt((parseInt(arr[4]) - parseInt(arr[3])) + 10));
    },
    "A+12": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 12)));
    },
    "B+1": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 1)));
    },
    "B+2": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 2)));
    },
    "B+3": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 3)));
    },
    "B+4": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 4)));
    },
    "B+5": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 5)));
    },
    "B+6": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 6)));
    },
    "B+7": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 7)));
    },
    "B+8": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 8)));
    },
    "B+9": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 9)));
    },
    "B+10": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 10)));
    },
    "B+11": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 11)));
    },
    "B+12": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 12)));
    },
    "B+14": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 14)));
    },
    "B+15": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 15)));
    },
    "B+16": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 16)));
    },
    "B+17": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 17)));
    },
    "B+18": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 18)));
    },
    "B+19": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 19)));
    }, "B+20": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 20)));
    }, "B+21": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 21)));
    },
    "B+22": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 22)));
    },

    "B+13": function (arr) {
        return fillNum(parseInt((parseInt(arr[1]) + 13)));
    },
    "C+13": function (arr) {
        return fillNum(parseInt((parseInt(arr[2]) + 13)));
    },
    "A+13": function (arr) {
        return fillNum(parseInt((parseInt(arr[0]) + 13)));
    }
    ,
    "D+13": function (arr) {
        return fillNum(parseInt((parseInt(arr[3]) + 13)));
    }
    ,
    "E+13": function (arr) {
        return fillNum(parseInt((parseInt(arr[4]) + 13)));
    },
    "F+13": function (arr) {
        return fillNum(parseInt((parseInt(arr[5]) + 13)));
    }

    //"customer": function (arr, i) {
    //    if (i == 10) {
    //        return Skill["A+B"](arr);
    //    }
    //    if (i % 5 == 3) {
    //        return Skill["F+13"](arr);
    //    }
    //    if (i % 3 == 2) {
    //        return Skill["B-A"](arr);
    //    }
    //    if (i % 7 == 5) {
    //        return Skill["F-A"](arr);
    //    }
    //    return parseInt(Math.random() * 33) + 1
    //},
    //"random": function (arr, i) {
    //
    //    return parseInt(Math.random() * 33) + 1
    //}

    //[A,B,C,D,E,F]
    //[0,1,2,3,4,5]
}
module.exports = Skill