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
        keyCommand: (codeset, code, action) => {
            let data = keyData(codeset, code, action);
            return sendRequest('put', host + '/key_command', _authKey, data);
        },
        volume: {
            down: () => {
                return this.control.keyCommand(5, 0);
            },
            up: () => {
                return this.control.keyCommand(5, 1);
            },
            unmute: () => {
                return this.control.keyCommand(5, 2);
            },
            mute: () => {
                return this.control.keyCommand(5, 3);
            },
            toggleMute: () => {
                return this.control.keyCommand(5, 4);
            },
        },
        input: {
            cycle: () => {
                return this.control.keyCommand(7, 1);
            }
        },
        channel: {
            down: () => {
                return this.control.keyCommand(8, 0);
            },
            up: () => {
                return this.control.keyCommand(8, 1);
            },
            previous: () => {
                return this.control.keyCommand(8, 2);
            }
        },
        power: {
            off: () => {
                return this.control.keyCommand(11, 0);
            },
            on: () => {
                return this.control.keyCommand(11, 1);
            },
            toggle: () => {
                return this.control.keyCommand(11, 2);
            }
        }
    };
};