'use strict';

let expect = require('chai').expect,
    sinon = require('sinon'),
    request = require('request-promise-native'),
    smartcast = require('../index');

describe('#smart-cast-app-tests', function() {
    it('launch should trigger the casting of an app or url', function(done) {
        let tv = new smartcast('0.0.0.0'),
            app = 'http://demo.example.com/vizio.html',
            mockData = { STATUS: { RESULT: 'SUCCESS', DETAIL: 'Success' } };

        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.app.launch(app)

        expect(request.put.called).to.be.true;

        request.put.restore();
        done();
    });
});