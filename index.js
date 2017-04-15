'use strict';

let request = require('request-promise-native'),
    PROTO = 'https://',
    PORT = 9000;

let sendRequest = (method, url, authKey, data) => {
    let req = {
        url: url,
        json: true,
        rejectUnauthorized: false,
        body: data
    };

    if (authKey) {
        req.headers = {
            'AUTH': authKey
        };
    }

    return request[method](req);
}

let keyData = (codeset, code, action) => {
    if (!action) {
        action = 'KEYPRESS';
    }
    return {
        "KEYLIST": [{
            "CODESET": codeset,
            "CODE": code,
            "ACTION": action
        }]
    };
}

/**
 * @param {string} ip IP address of the smartcast device
 * @param {string=} authKey auth key to authorize yourself with the smart cast device
 */
module.exports = function smartcast(ip, authKey) {
    let _pairingRequestToken = '',
        _authKey = authKey || '',
        _deviceId = '',
        _deviceName = '';

    let host = PROTO + ip + ':' + PORT;

    this.power = {
        /**
         * Get the current power mode from the smartcast device
         * @return {promise}
         */
        currentMode: () => {
            let url = host + '/state/device/power_mode';
            return sendRequest('get', url);
        }
    };

    this.pairing = {
        /**
         * Initiate the pairing process with the smartcast device
         * @param {string=} deviceName name of the calling device
         * @param {string=} deviceId unique identifier of the calling device
         * @return {Observable}
         */
        initiate: (deviceName, deviceId) => {
            _deviceName = deviceName || 'vizio-smart-cast-node-app';
            _deviceId = deviceId || 'vizio-smart-cast-node-app';

            let data = {
                "DEVICE_NAME": _deviceName,
                "DEVICE_ID": _deviceId
            };
            return sendRequest('put', host + '/pairing/start', null, data).then((data) => {
                if (data && data.STATUS.RESULT === 'SUCCESS') {
                    _pairingRequestToken = data.ITEM.PAIRING_REQ_TOKEN;
                }
                return data;
            });
        },

        /**
         * Pair with the smartcast device using the specified PIN
         * @param {string} pin The PIN displayed on the smartcast device
         * @return {Observable}
         */
        pair: (pin) => {
            let data = {
                "DEVICE_ID": _deviceId,
                "CHALLENGE_TYPE": 1,
                "RESPONSE_VALUE": pin,
                "PAIRING_REQ_TOKEN": _pairingRequestToken
            };
            return sendRequest('put', host + '/pairing/pair', null, data).then((data) => {
                if (data && data.STATUS.RESULT === 'SUCCESS') {
                    _authKey = data.ITEM.AUTH_TOKEN;
                }
                return data;
            });
        },

        useAuthToken: (key) => {
            _authKey = key;
        },

        /**
         * Cancel a pairing request with a given smartcast device
         * @param {string} ip IP address of the smartcast device
         * @return {promise}
         */
        cancel: (ip) => {
            throw new Error('not implemented');
        }
    };

    this.input = {
        list: () => {
            return sendRequest('get', host + '/menu_native/dynamic/tv_settings/devices/name_input', _authKey);
        },
        current: () => {
            return sendRequest('get', host + '/menu_native/dynamic/tv_settings/devices/current_input', _authKey);
        }
    };
    
    this.control = {
        volume: {
            down: () => {
                let data = keyData(5, 0);
                return sendRequest('put', host + '/key_command', _authKey, data);
            },
            up: () => {
                let data = keyData(5, 1);
                return sendRequest('put', host + '/key_command', _authKey, data);
            },
            unmute: () => {
                let data = keyData(5, 2);
                return sendRequest('put', host + '/key_command', _authKey, data);
            },
            mute: () => {
                let data = keyData(5, 3);
                return sendRequest('put', host + '/key_command', _authKey, data);
            },
            toggleMute: () => {
                let data = keyData(5, 4);
                return sendRequest('put', host + '/key_command', _authKey, data);
            },
        },
        input: {
            cycle: () => {
                let data = keyData(7, 1);
                return sendRequest('put', host + '/key_command', _authKey, data);
            }
        },
        channel: {
            down: () => {
                let data = keyData(8, 0);
                return sendRequest('put', host + '/key_command', _authKey, data);
            },
            up: () => {
                let data = keyData(8, 1);
                return sendRequest('put', host + '/key_command', _authKey, data);
            },
            previous: () => {
                let data = keyData(8, 2);
                return sendRequest('put', host + '/key_command', _authKey, data);
            }
        },
        power: {
            off: () => {
                let data = keyData(11, 0);
                return sendRequest('put', host + '/key_command', _authKey, data);
            },
            on: () => {
                let data = keyData(11, 1);
                return sendRequest('put', host + '/key_command', _authKey, data);
            },
            toggle: () => {
                let data = keyData(11, 2);
                return sendRequest('put', host + '/key_command', _authKey, data);
            }
        }
    };
};