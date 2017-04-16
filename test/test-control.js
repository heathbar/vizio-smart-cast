'use strict';

let expect = require('chai').expect,
    sinon = require('sinon'),
    request = require('request-promise-native'),
    smartcast = require('../index');

describe('#smart-cast-control-tests', () => {

    it('keyCommand should use KEYPRESS for default action', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.control.keyCommand(0, 0);
        
        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].body.KEYLIST[0].ACTION).to.equal('KEYPRESS');

        request.put.restore();
    });

    it('keyCommand should use specified parameters', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.control.keyCommand(1, 2, 'KEYDOWN');
        
        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(1);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(2);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].ACTION).to.equal('KEYDOWN');

        request.put.restore();
    });


    it('volume down should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.control.volume.down();
        
        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(5);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(0);

        request.put.restore();
    });

    it('volume up should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.control.volume.up();
        
        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(5);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(1);

        request.put.restore();
    });

        it('mute off should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.control.volume.unmute();
        
        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(5);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(2);

        request.put.restore();
    });

    it('mute on should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.control.volume.mute();
        
        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(5);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(3);

        request.put.restore();
    });

    it('mute toggle should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.control.volume.toggleMute();
        
        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(5);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(4);

        request.put.restore();
    });

    it('cycle input should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.control.input.cycle();
        
        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(7);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(1);

        request.put.restore();
    });

    it('channel down should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.control.channel.down();
        
        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(8);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(0);

        request.put.restore();
    });

    it('channel up should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.control.channel.up();
        
        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(8);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(1);

        request.put.restore();
    });

    it('previous channel should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.control.channel.previous();
        
        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(8);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(2);

        request.put.restore();
    });

    it('power off should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.control.power.off();
        
        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(11);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(0);

        request.put.restore();
    });

    it('power on should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.control.power.on();
        
        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(11);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(1);

        request.put.restore();
    });

    it('power toggle should call api', () => {
        let tv = new smartcast('0.0.0.0'),
            mockData = {};
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));

        tv.control.power.toggle();
        
        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(11);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(2);

        request.put.restore();
    });

});