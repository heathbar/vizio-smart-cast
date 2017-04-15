'use strict';

let expect = require('chai').expect,
    sinon = require('sinon'),
    request = require('request-promise-native'),
    smartcast = require('../index');

describe('#smart-cast-auth-key-tests', function() {

    it('auth key specified in constructor should should be use for authorized calls', function() {
        let tv = new smartcast('0.0.0.0', 'key456'),
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
        expect(request.get.firstCall.args[0].headers.AUTH).to.equal('key456');

        request.get.restore();
    });

    it('auth key specified in useAuthToken should should be use for authorized calls', function() {
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

        tv.pairing.useAuthToken('key789');
        tv.input.current();
        
        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].headers.AUTH).to.equal('key789');

        request.get.restore();
    });
});