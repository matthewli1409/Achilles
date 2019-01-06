const moment = require('moment');

/**
 * Used to find dtd benchmark date. 
 * For example. Current date: 14/09/2018, dtd benchmark date will be 13/09/2018 
 * 
 * @param {Date} currentDate Current Date object to. Used to find the DTD benchmark date
 * @public
 */
exports.dtdBenchmarkDate = (currentDate) => {
    currentDate = moment(new Date(currentDate.getYear() + 1900, currentDate.getMonth(), currentDate.getDate())).subtract(1, 'days');
    return currentDate;
}

/**
 * Used to find mtd benchmark date. 
 * For example. Current date: 14/09/2018, mtd benchmark date will be 30/08/2018 
 * 
 * @param {Date} currentDate Current Date object to. Used to find the DTD benchmark date
 * @public
 */
exports.mtdBenchmarkDate = (currentDate) => {
    currentDate = moment(new Date(currentDate.getYear() + 1900, currentDate.getMonth(), 1)).subtract(1, 'days');
    return currentDate;
}

/**
 * Used to find ytd benchmark date. 
 * For example. Current date: 14/09/2018, ytd benchmark date will be 31/12/2017 
 * 
 * @param {Date} currentDate Current Date object to. Used to find the DTD benchmark date
 * @public
 */
exports.ytdBenchmarkDate = (currentDate) => {
    currentDate = moment(new Date(currentDate.getYear() + 1900, 0, 1)).subtract(1, 'days');
    return currentDate;
}
