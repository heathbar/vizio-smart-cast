'use strict';

let expect = require('chai').expect,
    sinon = require('sinon'),
    request = require('request-promise-native'),
    smartcast = require('../index');

describe('#smart-cast-power-tests', function() {

    it('currentMode should call api', function() {
        let tv = new smartcast('0.0.0.0');

        sinon.stub(request, 'get');
        tv.power.currentMode();

        expect(request.get.called).to.be.true;
        expect(request.get.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/state/device/power_mode');
        request.get.restore();
    });
});