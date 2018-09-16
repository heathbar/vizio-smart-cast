'use strict';

let expect = require('chai').expect,
    sinon = require('sinon'),
    request = require('request-promise-native'),
    smartcast = require('../index');

describe('#smart-cast-settings-tests', () => {
    let tv = new smartcast('0.0.0.0'),
    mockData = {};

    it('picture should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.picture.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/picture');

        request.get.restore();
    });

    it('picture size should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.picture.size.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/picture/picture_size');

        request.get.restore();
    });

    it('picture position should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.picture.position.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/picture/picture_position');
    
            request.get.restore();
        });
    });

    it('picture modeEdit should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.picture.modeEdit.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/picture/picture_mode_edit');

            request.get.restore();
        });
    });

    it('picture mode get() should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.picture.mode.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/picture/picture_mode');

            request.get.restore();
        });
    });

    it('picture color calibration should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.picture.color.calibration.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/picture/color_calibration');

            request.get.restore();
        });
    });

    it('picture color tuner should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.picture.color.tuner.get().then(() => {    
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/picture/color_calibration/color_tuner');

            request.get.restore();
        });
    });

    it('picture calibrationTests should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.picture.calibrationTests.get().then(() => {            
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/picture/color_calibration/calibration_tests');

            request.get.restore();
        });
    });

    it('audio should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.audio.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/audio');

            request.get.restore();
        });
    });

    it('timers should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.timers.get().then(() => {    
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/timers');

            request.get.restore();
        });
    });

    it('timers sleepTimer get() should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.timers.sleepTimer.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/timers/sleep_timer');

            request.get.restore();
        });
    });

    it('timers sleepTimer set() should not accept integers outside of 0-5', () => {
        return tv.settings.timers.sleepTimer.set(6).then(() => {
            throw new Error('Promise was unexpectedly resolved');
    it('timers blankScreen get() should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.timers.blankScreen.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/timers/blank_screen');

            request.get.restore();
        });
    });

    it('timers autoPowerOffTimer get() should call api', () => {
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.timers.autoPowerOffTimer.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/timers/auto_power_off_timer');

            request.get.restore();
        });
    });

    it('timers autoPowerOffTimer set() should not accept integers outside of 0-1', () => {
        return tv.settings.timers.autoPowerOffTimer.set(2).then(() => {
            throw new Error('Promise was unexpectedly resolved');
        }, (error) => {
            expect(error).to.contain('value out of range')
        });
    });

    it('timers autoPowerOffTimer set() should not accept invalid string values', () => {
        return tv.settings.timers.autoPowerOffTimer.set("30 minutes").then(() => {
            throw new Error('Promise was unexpectedly resolved');
        }, (error) => {
            expect(error).to.contain('value out of range')
        });
    });

    it('timers autoPowerOffTimer set() should call api', () => {
        mockData = {
            STATUS: {
                RESULT: "SUCCESS",
                DETAIL: "Success"
            },
            ITEMS: [
                {
                    INDEX: 0,
                    HASHVAL: 3630612972,
                    NAME: "Auto Power Off",
                    VALUE: "10 minutes",
                    CNAME: "auto_power_off_timer",
                    TYPE: "T_LIST_V1"
                }
            ],
            HASHLIST: [
                2557875263,
                2021181097
            ],
            URI: "/menu_native/dynamic/tv_settings/timers/auto_power_off_timer",
            PARAMETERS: {
                FLAT: "TRUE",
                HELPTEXT: "FALSE",
                HASHONLY: "FALSE"
            }
        };
        let get = sinon.stub(tv.settings.timers.autoPowerOffTimer, 'get').returns(Promise.resolve(mockData));
        let set = sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        return tv.settings.timers.autoPowerOffTimer.set(1).then(() => {
            expect(set.called).to.be.true;
            expect(set.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/timers/auto_power_off_timer');
    
            get.restore();
            set.restore();
        });
    });

    it('network should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.network.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/network');

            request.get.restore();
        });
    });

    it('channels should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.channels.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/channels');

            request.get.restore();
        });
    });

    it('closedCaptions should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.closedCaptions.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/closed_captions');

            request.get.restore();
        });
    });

    it('devices should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.devices.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/devices');

            request.get.restore();
        });
    });

    it('system should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.system.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/system');

            request.get.restore();
        });
    });

    it('system information should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.system.information.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/system/system_information');

            request.get.restore();
        });
    });

    it('system information tv should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.system.information.tv.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/system/system_information/tv_information');

            request.get.restore();
        });
    });

    it('system information tuner should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.system.information.tuner.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/system/system_information/tuner_information');

            request.get.restore();
        });
    });

    it('system information network should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.system.information.network.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/system/system_information/network_information');

            request.get.restore();
        });
    });

    it('system information uli should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.system.information.uli.get().then(() => {     
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/system/system_information/uli_information');

            request.get.restore();
        });
    });

    it('mobileDevices should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.mobileDevices.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/mobile_devices');

            request.get.restore();
        });
    });

    it('cast should call api', () => {
        mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        return tv.settings.cast.get().then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/cast');

            request.get.restore();
        });
    });
    
});