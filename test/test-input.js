'use strict';

let expect = require('chai').expect,
    sinon = require('sinon'),
    request = require('request-promise-native'),
    smartcast = require('../index');

describe('#smart-cast-input-tests', function() {

    it('list should call api', function() {
        let tv = new smartcast('0.0.0.0'),
            mockData = {
                "STATUS": {
                    "RESULT": "SUCCESS",
                    "DETAIL": "Success"
                },
                "HASHLIST": [
                    1234567890,
                    987654321,
                    9999999999
                ],
                "GROUP": "G_DEVICES",
                "NAME": "Name Input",
                "PARAMETERS": {
                    "FLAT": "TRUE",
                    "HELPTEXT": "FALSE",
                    "HASHONLY": "FALSE"
                },
                "ITEMS": [
                    {
                    "HASHVAL": 1111111111,
                    "CNAME": "cast",
                    "NAME": "CAST",
                    "TYPE": "T_DEVICE_V1",
                    "READONLY": "TRUE",
                    "VALUE": {
                        "NAME": "CAST",
                        "METADATA": ""
                    }
                    },
                    {
                    "HASHVAL": 2222222222,
                    "CNAME": "hdmi1",
                    "TYPE": "T_DEVICE_V1",
                    "NAME": "HDMI-1",
                    "VALUE": {
                        "NAME": "BLU-RAY",
                        "METADATA": ""
                    }
                    },
                    {
                    "HASHVAL": 3333333333,
                    "CNAME": "hdmi2",
                    "TYPE": "T_DEVICE_V1",
                    "NAME": "HDMI-2",
                    "VALUE": {
                        "NAME": "XBOX 360",
                        "METADATA": ""
                    }
                    },
                    {
                    "HASHVAL": 4444444444,
                    "CNAME": "hdmi3",
                    "TYPE": "T_DEVICE_V1",
                    "NAME": "HDMI-3",
                    "VALUE": {
                        "NAME": "XBOX ONE",
                        "METADATA": ""
                    }
                    },
                    {
                    "HASHVAL": 5555555555,
                    "CNAME": "hdmi4",
                    "TYPE": "T_DEVICE_V1",
                    "NAME": "HDMI-4",
                    "VALUE": {
                        "NAME": "PLAYSTATION",
                        "METADATA": ""
                    }
                    },
                    {
                    "HASHVAL": 66666666666,
                    "CNAME": "hdmi5",
                    "TYPE": "T_DEVICE_V1",
                    "NAME": "HDMI-5",
                    "VALUE": {
                        "NAME": "",
                        "METADATA": ""
                    }
                    },
                    {
                    "HASHVAL": 7777777777,
                    "CNAME": "comp",
                    "TYPE": "T_DEVICE_V1",
                    "NAME": "COMP",
                    "VALUE": {
                        "NAME": "",
                        "METADATA": ""
                    }
                    }
                ],
                "URI": "/menu_native/dynamic/tv_settings/devices/name_input",
                "CNAME": "name_input",
                "TYPE": "T_MENU_V1"
            };
        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.input.list();

        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/devices/name_input');

        request.get.restore();
    });

    it('current should call api', function() {
        let tv = new smartcast('0.0.0.0'),
            mockData = {
                STATUS: {
                    RESULT: 'SUCCESS',
                    DETAIL: 'Success'
                },
                ITEMS: [
                    {
                        HASHVAL: 3057664350,
                        NAME: 'Current Input',
                        ENABLED: 'FALSE',
                        VALUE: 'CAST',
                        CNAME: 'current_input',
                        TYPE: 'T_STRING_V1'
                    }
                ],
                HASHLIST: [ 1111122222, 3333333444 ],
                URI: '/menu_native/dynamic/tv_settings/devices/current_input',
                PARAMETERS: { FLAT: 'TRUE', HELPTEXT: 'FALSE', HASHONLY: 'FALSE' }
            };

        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.input.current();

        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/devices/current_input');

        request.get.restore();
    });

    it('set should call list() and current() with parameters', function(done) {
        let tv = new smartcast('0.0.0.0'),
            inputName = 'HDMI-1',
            mockData = { STATUS: { RESULT: 'SUCCESS'}, ITEMS: [ { NAME: inputName, HASHVAL: '' }] }; // this is a little weird, single mock object returned for two different request.get(...) calls

        sinon.stub(request, 'get').returns(Promise.resolve(mockData));
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.input.set(inputName).then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/devices/name_input');
            expect(request.get.secondCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/devices/current_input');

            request.get.restore();
            request.put.restore();
            done();
        });
    });

    it('set should reject if list() or current() fails', function(done) {
        let tv = new smartcast('0.0.0.0'),
            inputName = 'HDMI-1',
            inputHash = 'DEADBEEF',
            mockData = { STATUS: { RESULT: 'ERROR' } };

        sinon.stub(request, 'get').returns(Promise.resolve(mockData));

        tv.input.set(inputName).catch(() => {
            expect(request.get.called).to.be.true;
            request.get.restore();
            done();
        });
    });

    it('set should reject if name not found', function(done) {
        let tv = new smartcast('0.0.0.0'),
            inputName = 'INVALID-INPUT-NAME',
            mockData = { STATUS: { RESULT: 'SUCCESS'}, ITEMS: [ { NAME: 'HDMI-1', VALUE: { NAME: 'Blu-ray' }, HASHVAL: '' }] }; // this is a little weird, single mock object returned for two different request.get(...) calls

        sinon.stub(request, 'get').returns(Promise.resolve(mockData));
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.input.set(inputName).catch(() => {
            expect(request.get.called).to.be.true;
            expect(request.put.called).to.be.false;

            request.get.restore();
            request.put.restore();
            done();
        });
    });

    it('set should find input by user name if built-in name not found', function(done) {
        let tv = new smartcast('0.0.0.0'),
            inputName = 'USER-NAMED-INPUT',
            mockData = { STATUS: { RESULT: 'SUCCESS'}, ITEMS: [ { NAME: 'HDMI-1', VALUE: { NAME: inputName }, HASHVAL: '' }] }; // this is a little weird, single mock object returned for two different request.get(...) calls

        sinon.stub(request, 'get').returns(Promise.resolve(mockData));
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.input.set(inputName).then(() => {
            expect(request.get.called).to.be.true;
            expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/devices/name_input');
            expect(request.get.secondCall.args[0].url).to.equal('https://0.0.0.0:7345/menu_native/dynamic/tv_settings/devices/current_input');

            expect(request.put.called).to.be.true;

            request.get.restore();
            request.put.restore();
            done();
        });
    });
});