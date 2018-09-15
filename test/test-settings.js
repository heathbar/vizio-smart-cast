'use strict';

let expect = require('chai').expect,
    sinon = require('sinon'),
    request = require('request-promise-native'),
    smartcast = require('../index');

describe('#smart-cast-settings-tests', () => {

    it('picture should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.picture.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/picture');

        request.get.restore();
    });

    it('picture size should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.picture.size.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/picture/picture_size');

        request.get.restore();
    });

    it('picture position should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.picture.position.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/picture/picture_position');

        request.get.restore();
    });

    it('picture modeEdit should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.picture.modeEdit.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/picture/picture_mode_edit');

        request.get.restore();
    });

    it('picture mode should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.picture.mode.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/picture/picture_mode');

        request.get.restore();
    });

    it('picture color calibration should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.picture.color.calibration.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/picture/color_calibration');

        request.get.restore();
    });

    it('picture color tuner should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.picture.color.tuner.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/picture/color_calibration/color_tuner');

        request.get.restore();
    });

    it('picture calibrationTests should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.picture.calibrationTests.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/picture/color_calibration/calibration_tests');

        request.get.restore();
    });

    it('audio should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.audio.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/audio');

        request.get.restore();
    });

    it('timers should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.timers.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/timers');

        request.get.restore();
    });

    it('network should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.network.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/network');

        request.get.restore();
    });

    it('channels should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.channels.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/channels');

        request.get.restore();
    });

    it('closedCaptions should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.closedCaptions.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/closed_captions');

        request.get.restore();
    });

    it('devices should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.devices.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/devices');

        request.get.restore();
    });

    it('system should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.system.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/system');

        request.get.restore();
    });

    it('system information should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.system.information.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/system/system_information');

        request.get.restore();
    });

    it('system information tv should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.system.information.tv.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/system/system_information/tv_information');

        request.get.restore();
    });

    it('system information tuner should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.system.information.tuner.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/system/system_information/tuner_information');

        request.get.restore();
    });

    it('system information network should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.system.information.network.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/system/system_information/network_information');

        request.get.restore();
    });

    it('system information uli should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.system.information.uli.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/system/system_information/uli_information');

        request.get.restore();
    });

    it('mobileDevices should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.mobileDevices.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/mobile_devices');

        request.get.restore();
    });

    it('cast should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.settings.cast.get();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/cast');

        request.get.restore();
    });
    
});