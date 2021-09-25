'use strict';

let request = require('request-promise-native'),
    PROTO = 'https://',
    PORT = 7345;

let sendRequest = (method, url, authKey, data) => {
    let req = {
        url: url,
        json: true,
        rejectUnauthorized: false,
        body: data
    };

    if (authKey) {
        req.headers = {
            AUTH: authKey
        };
    }

    return request[method](req);
}

let keyData = (codeset, code, action) => {
    if (!action) {
        action = 'KEYPRESS';
    }
    return {
        KEYLIST: [{
            CODESET: codeset,
            CODE: code,
            ACTION: action
        }]
    };
}

let findInputByName = (name, list) => {

    // first search by internal name
    for (let i = 0; i < list.ITEMS.length; i++) {
        if (list.ITEMS[i].NAME.toLowerCase() === name.toLowerCase()) {
            return list.ITEMS[i].NAME;
        }
    };

    // second search by user name
    for (let i = 0; i < list.ITEMS.length; i++) {
        if (list.ITEMS[i].VALUE.NAME.toLowerCase() === name.toLowerCase()) {
            return list.ITEMS[i].NAME;
        }
    };

    return null;
};

/**
 * @param {string} host Host IP address (and optionally PORT) of the smartcast device
 * @param {string=} authKey auth key to authorize yourself with the smart cast device
 */
let SMARTCAST = function smartcast(host, authKey) {
    let _pairingRequestToken = '',
        _authKey = authKey || '',
        _deviceId = '',
        _deviceName = '';

    // if user didn't provide a port, use the default port
    if (host.indexOf(':') == -1) {
        host += ':' + PORT;
    }
    host = PROTO + host;

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
            _deviceName = deviceName || 'node-app-' + new Date().getTime();
            _deviceId = deviceId || 'node-app-' + new Date().getTime();

            let data = {
                DEVICE_NAME: _deviceName,
                DEVICE_ID: _deviceId
            };
            return sendRequest('put', host + '/pairing/start', null, data).then((data) => {
                if (data && data.STATUS && data.STATUS.RESULT === 'SUCCESS') {
                    _pairingRequestToken = data.ITEM.PAIRING_REQ_TOKEN;
                    return data;
                } else {
                    if (data.STATUS.RESULT === 'BLOCKED') {
                        return Promise.reject('Failed to initiate the pairing process because a pairing request has already been initiated. Please wait for the pin to clear from the screen before initiating the pairing process again.', data);
                    } else {
                        return Promise.reject(data);
                    }
                }
            });
        },

        /**
         * Pair with the smartcast device using the specified PIN
         * @param {string} pin The PIN displayed on the smartcast device
         * @return {Observable}
         */
        pair: (pin, deviceId, pairingRequestToken) => {
            let data = {
                DEVICE_ID: deviceId || _deviceId,
                CHALLENGE_TYPE: 1,
                RESPONSE_VALUE: pin,
                PAIRING_REQ_TOKEN: pairingRequestToken || _pairingRequestToken
            };
            return sendRequest('put', host + '/pairing/pair', null, data).then((data) => {
                if (data && data.STATUS.RESULT === 'SUCCESS') {
                    _authKey = data.ITEM.AUTH_TOKEN;
                    return data;
                } else {
                    return Promise.reject(data);
                }
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
        },
        set: (name) => {
            return new Promise((resolve, reject) => {
                Promise.all([this.input.list(), this.input.current()]).then(values => {
                    let inputList = values[0],
                        currentInput = values[1],
                        inputName = findInputByName(name, inputList);

                        if (inputList.STATUS.RESULT !== 'SUCCESS' || currentInput.STATUS.RESULT !== 'SUCCESS') {
                            reject({ list: inputList, current: currentInput });
                            return;
                        }

                        if (!inputName) {
                            reject('Input: ' + name + ' not found', inputList);
                            return;
                        }

                        let data = {
                            REQUEST: "MODIFY",
                            VALUE: inputName,
                            HASHVAL: currentInput.ITEMS[0].HASHVAL
                        };

                        sendRequest('put', host + '/menu_native/dynamic/tv_settings/devices/current_input', _authKey, data).then(resolve).catch(reject)
                }).catch(reject);
            });
        }
    };

    this.control = {
        keyCommand: (codeset, code, action) => {
            let data = keyData(codeset, code, action);
            return sendRequest('put', host + '/key_command/', _authKey, data);
        },
        volume: {
            down: () => {
                return this.control.keyCommand(5, 0);
            },
            up: () => {
                return this.control.keyCommand(5, 1);
            },
            get: () => {
                return new Promise((resolve) => {
                    sendRequest('get', host + '/menu_native/dynamic/tv_settings/audio/volume', _authKey).then(resolve)
                });
            },
            set: (value) => {
                return new Promise((resolve, reject) => {
                    if (typeof value !== 'number') {
                        reject('value must be a number');
                    }
                    if (value < 0 || value > 100) {
                        reject('value is out of range, please enter a number between 0 to 100 inclusive');
                    }
                    this.settings.audio.get().then((settings) => {
                        let volume = settings.ITEMS.find(i => i.CNAME === 'volume')
                        if (!volume) {
                            reject('no volume setting found');
                            return;
                        }

                        let data = {
                            REQUEST: 'MODIFY',
                            HASHVAL: volume.HASHVAL,
                            VALUE: Math.round(value)
                        };
                        sendRequest('put', host + '/menu_native/dynamic/tv_settings/audio/volume', _authKey, data).then(resolve).catch(reject)
                    }).catch(reject);
                });
            },
            getMuteState: () => {
                return new Promise((resolve) => {
                    sendRequest('get', host + '/menu_native/dynamic/tv_settings/audio/mute', _authKey).then(resolve)
                });
            },
            unmute: () => {
                return this.control.keyCommand(5, 2);
            },
            mute: () => {
                return this.control.keyCommand(5, 3);
            },
            toggleMute: () => {
                return this.control.keyCommand(5, 4);
            }
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
        },
        media: {
            seek: {
                forward: () => {
                    return this.control.keyCommand(2, 0);
                },
                back: () => {
                    return this.control.keyCommand(2, 1);
                }
            },
            play: () => {
                return this.control.keyCommand(2, 3);
            },
            pause: () => {
                return this.control.keyCommand(2, 2);
            },
            cc: () => {
                return this.control.keyCommand(4, 4);
            }
        },
        navigate: {
            up: () => {
                return this.control.keyCommand(3, 8);
            },
            down: () => {
                return this.control.keyCommand(3, 0);
            },
            left: () => {
                return this.control.keyCommand(3, 1);
            },
            right: () => {
                return this.control.keyCommand(3, 7);
            },
            ok: () => {
                return this.control.keyCommand(3, 2);
            },
            back: () => {
                return this.control.keyCommand(4, 0);
            },
            exit: () => {
                return this.control.keyCommand(9, 0);
            }
        },
        menu: () => {
            return this.control.keyCommand(4, 8);
        },
        info: () => {
            return this.control.keyCommand(4, 6);
        },
        smartcast: () => {
            return this.control.keyCommand(4, 3);
        }
    };

    this.settings = {
        picture: {
            get: () => {
                return sendRequest('get', host + '/menu_native/dynamic/tv_settings/picture', _authKey);
            },
            size: {
                get: () => {
                    return sendRequest('get', host + '/menu_native/dynamic/tv_settings/picture/picture_size', _authKey);
                }
            },
            position: {
                get: () => {
                    return sendRequest('get', host + '/menu_native/dynamic/tv_settings/picture/picture_position', _authKey);
                }
            },
            mode: {
                get: () => {
                    return sendRequest('get', host + '/menu_native/dynamic/tv_settings/picture/picture_mode', _authKey);
                },
                set: (value) => {
                    return new Promise((resolve, reject) => {
                        if (typeof value !== 'string') {
                            reject('value must be a string');
                            return;
                        }

                        this.settings.picture.mode.get().then((settings) => {
                            let pictureMode = settings.ITEMS.find(i => i.CNAME === 'picture_mode');
                            if (!pictureMode) {
                                reject('could not get picture mode settings');
                                return;
                            }

                            let pictureModeValue = pictureMode.ELEMENTS.find(i => i === value);
                            if (!pictureModeValue) {
                                reject('value out of range');
                                return;
                            }
                            
                            let data = {
                                REQUEST: 'MODIFY',
                                HASHVAL: pictureMode.HASHVAL,
                                VALUE: pictureModeValue
                            };
                            sendRequest('put', host + '/menu_native/dynamic/tv_settings/picture/picture_mode', _authKey, data).then(resolve).catch(reject);
                        }).catch(reject);
                    });
                }
            },
            modeEdit: {
                get: () => {
                    return sendRequest('get', host + '/menu_native/dynamic/tv_settings/picture/picture_mode_edit', _authKey);
                }
            },
            color: {
                calibration: {
                    get: () => {
                        return sendRequest('get', host + '/menu_native/dynamic/tv_settings/picture/color_calibration', _authKey);
                    }
                },
                tuner: {
                    get: () => {
                        return sendRequest('get', host + '/menu_native/dynamic/tv_settings/picture/color_calibration/color_tuner', _authKey);
                    }
                },
            },
            calibrationTests: {
                get: () => {
                    return sendRequest('get', host + '/menu_native/dynamic/tv_settings/picture/color_calibration/calibration_tests', _authKey);
                }
            }
        },
        audio: {
            get: () => {
                return sendRequest('get', host + '/menu_native/dynamic/tv_settings/audio', _authKey);
            }
        },
        timers: {
            get: () => {
                return sendRequest('get', host + '/menu_native/dynamic/tv_settings/timers', _authKey);
            },
            autoPowerOffTimer: {
                get: () => {
                    return sendRequest('get', host + '/menu_native/dynamic/tv_settings/timers/auto_power_off_timer', _authKey);
                },
                set: (value) => {
                    return new Promise((resolve, reject) => {
                        let powerOffValues = [
                            { index: 0, value: '10 minutes'}, 
                            { index: 1, value: 'Off'}
                        ];
                        
                        // Accept any value that matches the integer index or string value
                        if (powerOffValues.find(t => t.value === value || t.index === value) === undefined) {
                            reject('value out of range');
                            return;
                        }
                        
                        // Transform an integer index to its string value
                        if (typeof value === 'number') {
                            value = powerOffValues.find(t => t.index === value).value;
                        }

                        this.settings.timers.autoPowerOffTimer.get().then((response) => {
                            let autoPowerOffTimer = response.ITEMS.find(i => i.CNAME === 'auto_power_off_timer');
                            
                            if (!autoPowerOffTimer) {
                                reject('could not get auto power off timer settings');
                                return;
                            }
                            
                            let data = {
                                REQUEST: 'MODIFY',
                                HASHVAL: autoPowerOffTimer.HASHVAL,
                                VALUE: value
                            };
                            sendRequest('put', host + '/menu_native/dynamic/tv_settings/timers/auto_power_off_timer', _authKey, data).then(resolve).catch(reject);
                        }).catch(reject);
                    });
                }
            },
            sleepTimer: {
                get: () => {
                    return sendRequest('get', host + '/menu_native/dynamic/tv_settings/timers/sleep_timer', _authKey);
                },
                set: (value) => {
                    return new Promise((resolve, reject) => {
                        let timerValues = [
                            { index: 0, value: 'Off'}, 
                            { index: 1, value: '30 minutes'}, 
                            { index: 2, value: '60 minutes'}, 
                            { index: 3, value: '90 minutes'}, 
                            { index: 4, value: '120 minutes'}, 
                            { index: 5, value: '180 minutes'}
                        ];
                        
                        // Accept any value that matches the integer index or string value
                        if (timerValues.find(t => t.value === value || t.index === value) === undefined) {
                            reject('value out of range');
                            return;
                        }
                        
                        // Transform an integer index to its string value
                        if (typeof value === 'number') {
                            value = timerValues.find(t => t.index === value).value;
                        }

                        this.settings.timers.sleepTimer.get().then((response) => {
                            let sleepTimer = response.ITEMS.find(i => i.CNAME === 'sleep_timer');
                            
                            if (!sleepTimer) {
                                reject('could not get picture mode settings');
                                return;
                            }
                            
                            let data = {
                                REQUEST: 'MODIFY',
                                HASHVAL: sleepTimer.HASHVAL,
                                VALUE: value
                            };
                            sendRequest('put', host + '/menu_native/dynamic/tv_settings/timers/sleep_timer', _authKey, data).then(resolve).catch(reject);
                        }).catch(reject);
                    });
                }
            },
            blankScreen: {
                get: () => {
                    return sendRequest('get', host + '/menu_native/dynamic/tv_settings/timers/blank_screen', _authKey);
                },
                execute: () => {
                    return new Promise((resolve, reject) => {
                        this.settings.timers.blankScreen.get().then((response) => {
                            let blankScreen = response.ITEMS.find(x => x.CNAME === "blank_screen");
                            if (!blankScreen) {
                                reject('Unable to get blank_screen');
                                return;
                            }

                            let data = {
                                REQUEST: 'MODIFY',
                                HASHVAL: blankScreen.HASHVAL,
                                VALUE: 'T_ACTION_V1' // Any string value would suffice
                            };
                            sendRequest('put', host + '/menu_native/dynamic/tv_settings/timers/blank_screen', _authKey, data).then(resolve).catch(reject)
                        }).catch(reject);
                    });
                }
            }
        },
        network: {
            get: () => {
                return sendRequest('get', host + '/menu_native/dynamic/tv_settings/network', _authKey);
            }
        },
        channels: {
            get: () => {
                return sendRequest('get', host + '/menu_native/dynamic/tv_settings/channels', _authKey);
            }
        },
        closedCaptions: {
            get: () => {
                return sendRequest('get', host + '/menu_native/dynamic/tv_settings/closed_captions', _authKey);
            }
        },
        devices: {
            get: () => {
                return sendRequest('get', host + '/menu_native/dynamic/tv_settings/devices', _authKey);
            }
        },
        system: {
            get: () => {
                return sendRequest('get', host + '/menu_native/dynamic/tv_settings/system', _authKey);
            },
            information: {
                get: () => {
                    return sendRequest('get', host + '/menu_native/dynamic/tv_settings/system/system_information', _authKey);
                },
                tv: {
                    get: () => {
                        return sendRequest('get', host + '/menu_native/dynamic/tv_settings/system/system_information/tv_information', _authKey);
                    }
                },
                tuner: {
                    get: () => {
                        return sendRequest('get', host + '/menu_native/dynamic/tv_settings/system/system_information/tuner_information', _authKey);
                    }
                },
                network: {
                    get: () => {
                        return sendRequest('get', host + '/menu_native/dynamic/tv_settings/system/system_information/network_information', _authKey);
                    }
                },
                uli: {
                    get: () => {
                        return sendRequest('get', host + '/menu_native/dynamic/tv_settings/system/system_information/uli_information', _authKey);
                    }
                }
            }
        },
        mobileDevices: {
            get: () => {
                return sendRequest('get', host + '/menu_native/dynamic/tv_settings/mobile_devices', _authKey);
            }
        },
        cast: {
            get: () => {
                return sendRequest('get', host + '/menu_native/dynamic/tv_settings/cast', _authKey);
            }
        }
   };

   this.app = {
        /**
         * Launch a specific app on the smartcast device. See https://github.com/exiva/Vizio_SmartCast_API#app-ids
         * @param {string} app URL or ID of the app to cast.
         * @param {string} app_id Defaults to 17 same as app id to test content change api
         * @param {int} name_space Defaults to 4 for app launching via smartcast api
         * @return {promise}
         */
        launch: (app, app_id = '17', name_space = 4) => {
            let data = {
                VALUE: {
                    MESSAGE: app,
                    NAME_SPACE: name_space,
                    APP_ID: app_id
                }
            };
            return sendRequest('put', host + '/app/launch', _authKey, data).then((data) => {
                if (data && data.STATUS && data.STATUS.RESULT === 'SUCCESS') {
                    return data;
                } else {
                    return Promise.reject(data);
                }
            });
        }
    };
};

SMARTCAST.discover = (success, error, timeout) => {
    if (!error) {
        error = () => {};
    }

    if (!timeout) {
        timeout = 4000;
    }

    let ssdp = require('node-ssdp').Client,
        client = new ssdp();

        client.on('response', (headers, statusCode, info) => {
            request.get(headers.LOCATION).then((description) => {
                let device = { ip: info.address };

                try {
                    let sax = require('sax'),
                        parser = sax.parser(true), // true = strict mode
                        tagName;

                    parser.onopentag = function (node) {
                        tagName = node.name;
                    };

                    parser.ontext = function (t) {
                        if (t.trim()) {
                            switch(tagName) {
                                case 'friendlyName':
                                    device.name = t;
                                    break;
                                case 'modelName':
                                    device.model = t;
                                    break;
                                case 'manufacturer':
                                    device.manufacturer = t;
                                    break;
                            }
                        }
                    };

                    parser.onend = function () {
                        if (device.manufacturer.toUpperCase() === 'VIZIO') {
                            success(device);
                        } else {
                            error('Incorrect manufacturer found: ' + device.manufacturer, device);
                        }
                    };

                    parser.write(description).close();
                } catch (err) {
                    error(err);
                }
            }).catch((err) => {
                error(err);
            });

        });
        client.search('urn:dial-multiscreen-org:device:dial:1');

        setTimeout(() => {}, timeout);

};

module.exports = SMARTCAST;
