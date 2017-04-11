'use strict';

let request = require('request-promise-native');
let PROTO = 'HTTPS://';
let PORT = 9000;

function makeRequest(method, url, data) {
    let req = {
        method: method,
        url: url,
        rejectUnauthorized: false,
        data: data
    }

    return request(req);
}

module.exports = {
    powerMode: function(ip) {
        let url = PROTO + ip + ':' + PORT + '/state/device/power_mode';
        return makeRequest('GET', url);
    }
};