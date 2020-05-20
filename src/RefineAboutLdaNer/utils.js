"use strict";
exports.__esModule = true;
/**
 * make time unit by each month
 * @param innerHuffPostData
 */
function makeMonthUnitsFromHuffPostData(innerHuffPostData) {
    var times = [];
    var initialDate = new Date(innerHuffPostData[0].date);
    var lastDate = new Date(innerHuffPostData[innerHuffPostData.length - 1].date);
    while (initialDate.getFullYear() + '-' + initialDate.getMonth() <=
        lastDate.getFullYear() + '-' + lastDate.getMonth()) {
        times.push(initialDate.getFullYear() + '-' +
            getStringMonthFromNumberMonth(initialDate.getMonth() + 1));
        initialDate.setMonth(initialDate.getMonth() + 1);
    }
    return times;
}
exports.makeMonthUnitsFromHuffPostData = makeMonthUnitsFromHuffPostData;
/**
 * Make "OOOO-OO-OO" to "OOOO-OO"
 * @param stringDate
 */
function getYearMonthFromStringDate(stringDate) {
    var stringDateSplited = stringDate.split('-');
    return stringDateSplited[0] + '-' + stringDateSplited[1];
}
exports.getYearMonthFromStringDate = getYearMonthFromStringDate;
/**
 * number of month to string month that is 2 length
 * @param month
 */
function getStringMonthFromNumberMonth(month) {
    if (month < 10) {
        return '0' + month;
    }
    else {
        return String(month);
    }
}
exports.getStringMonthFromNumberMonth = getStringMonthFromNumberMonth;
