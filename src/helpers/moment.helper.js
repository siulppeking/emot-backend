const moment = require('moment');
require('moment/locale/es');
moment.locale('es');

const momentFormat = (dateIn, formatIn) => {
    return moment(dateIn).format(formatIn);
}

const momentFromNow = (dateIn) => {
    return moment(dateIn).fromNow();
}

module.exports = {
    momentFormat,
    momentFromNow
}