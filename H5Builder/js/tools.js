﻿var tools = (function () {
    function getObj(k) {
        return document.getElementById(k);
    }

    function getName(k) {
        return document.getElementsByName(k);
    }

    //获取坐标位置
    var getpos = function (e) {
        var t = e.offsetTop;
        var l = e.offsetLeft;
        var height = e.offsetHeight;
        while (e = e.offsetParent) {
            t += e.offsetTop;
            l += e.offsetLeft;
        }
        return { "t": t, "l": l };
    }
    var uuid = function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }
    return {
        getObj: getObj,
        getName:getName,
        getpos: getpos,
        uuid: uuid
    };
})();