'use strict';

let expect = require('chai').expect,
    sinon = require('sinon'),
    request = require('request-promise-native'),
    smartcast = require('../index');

describe('#smart-cast-pairing-tests', function() {

    it('initiate should call api', function() {
        let tv = new smartcast('0.0.0.0'),
            mockData = {
                STATUS: {
                    RESULT: 'SUCCESS'
                },
                ITEM: {
                    PAIRING_REQ_TOKEN: 'foobar'
                }
            };
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.pairing.initiate();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/pairing/start');
        request.put.restore();
    });

    it('initiate should pass through data from the api', function(done) {
        let tv = new smartcast('0.0.0.0'),
            mockData = {
                STATUS: {
                    RESULT: 'SUCCESS'
                },
                ITEM: {
                    PAIRING_REQ_TOKEN: 'foobar'
                }
            };

        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.pairing.initiate().then((data) => {
            expect(data).to.equal(mockData);
            done();
        });

        expect(request.put.called).to.be.true;
        request.put.restore();
    });

    it('pair should call api', function() {
        let tv = new smartcast('0.0.0.0'),
            pin = 1234,
            mockData = {
                "STATUS": {
                    "RESULT": "SUCCESS",
                    "DETAIL": "Success"
                },
                "ITEM": {
                    "AUTH_TOKEN": "mocn3yuh66"
                }
            };

        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.pairing.pair(pin);

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/pairing/pair');
        request.put.restore();
    });

    it('pair should pass through data from the api', function(done) {
        let tv = new smartcast('0.0.0.0'),
            mockData = {
                "STATUS": {
                    "RESULT": "SUCCESS",
                    "DETAIL": "Success"
                },
                "ITEM": {
                    "AUTH_TOKEN": "aaabbbcc88"
                }
            };

        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.pairing.initiate().then((data) => {
            expect(data).to.equal(mockData);
            done();
        });

        expect(request.put.called).to.be.true;
        request.put.restore();
    });

    it('pair should use default device id', function(done) {
        let tv = new smartcast('0.0.0.0'),
            mockData = {
                "STATUS": {
                    "RESULT": "SUCCESS",
                    "DETAIL": "Success"
                },
                "ITEM": {
                    "AUTH_TOKEN": "foobarbaz"
                }
            };

        sinon.stub(request, 'put').returns(Promise.resolve(mockData));
        
        tv.pairing.pair('1234').then((data) => {
            expect(request.put.firstCall.args[0].body.DEVICE_ID).to.equal('vizio-smart-cast-node-app');
            request.put.restore();
            done();
        });
    });

    it('pair should use specified device id', function(done) {
        let tv = new smartcast('0.0.0.0', '', 'custom-device-id'),
            mockData = {
                "STATUS": {
                    "RESULT": "SUCCESS",
                    "DETAIL": "Success"
                },
                "ITEM": {
                    "AUTH_TOKEN": "foobarbaz"
                }
            };

        sinon.stub(request, 'put').returns(Promise.resolve(mockData));
        
        tv.pairing.pair('1234').then((data) => {
            expect(request.put.firstCall.args[0].body.DEVICE_ID).to.equal('custom-device-id');
            request.put.restore();
            done();
        });
    });

    it('pair should send pin to the api', function(done) {
        let tv = new smartcast('0.0.0.0'),
            mockData = {
                "STATUS": {
                    "RESULT": "SUCCESS",
                    "DETAIL": "Success"
                },
                "ITEM": {
                    "AUTH_TOKEN": "foobarbaz"
                }
            };

        sinon.stub(request, 'put').returns(Promise.resolve(mockData));
        
        tv.pairing.pair('1234').then((data) => {
            expect(request.put.firstCall.args[0].body.RESPONSE_VALUE).to.equal('1234');
            request.put.restore();
            done();
        });
    });

    it('pair should use the pairing request token from initialize', function(done) {
        let tv = new smartcast('0.0.0.0'),
            mockInitializeResponse = {
                "STATUS": {
                    "RESULT": "SUCCESS",
                    "DETAIL": "Success"
                },
                "ITEM": {
                    "CHALLENGE_TYPE": 1,
                    "PAIRING_REQ_TOKEN": 208507
                }
            },
            mockPairResponse = {
                "STATUS": {
                    "RESULT": "SUCCESS",
                    "DETAIL": "Success"
                },
                "ITEM": {
                    "AUTH_TOKEN": "foobarbaz"
                }
            };

        sinon.stub(request, 'put').returns(Promise.resolve(mockInitializeResponse));

        tv.pairing.initiate().then((data) => {

            // request.put.restore();
            sinon.stub(request, 'put').returns(Promise.resolve(mockPairResponse));
            
            tv.pairing.pair('1234').then((data) => {
                expect(request.put.firstCall.args[0].body.PAIRING_REQ_TOKEN).to.equal(mockInitializeResponse.ITEM.PAIRING_REQ_TOKEN);
                request.put.restore();
                done();
            });
        });

        expect(request.put.called).to.be.true;
        request.put.restore();
    });
});