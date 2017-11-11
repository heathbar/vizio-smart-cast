'use strict';

let expect = require('chai').expect,
    sinon = require('sinon'),
    request = require('request-promise-native'),
    smartcast = require('../index');

describe('#smart-cast-control-tests', () => {

    let tv = new smartcast('0.0.0.0'),
        mockData = {};
    beforeEach(() => {
        sinon.stub(request, 'put').returns(Promise.resolve(mockData));
    });
    afterEach(() => {
      request.put.restore();
    });

    it('keyCommand should use KEYPRESS for default action', () => {
        tv.control.keyCommand(0, 0);

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].body.KEYLIST[0].ACTION).to.equal('KEYPRESS');
    });

    it('keyCommand should use specified parameters', () => {

        tv.control.keyCommand(1, 2, 'KEYDOWN');

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(1);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(2);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].ACTION).to.equal('KEYDOWN');

    });


    it('volume down should call api', () => {
        tv.control.volume.down();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(5);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(0);

    });

    it('volume up should call api', () => {
        tv.control.volume.up();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(5);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(1);
    });

    it('mute off should call api', () => {
        tv.control.volume.unmute();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(5);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(2);
    });

    it('mute on should call api', () => {
        tv.control.volume.mute();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(5);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(3);
    });

    it('mute toggle should call api', () => {
        tv.control.volume.toggleMute();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(5);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(4);
    });

    it('cycle input should call api', () => {
        tv.control.input.cycle();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(7);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(1);
    });

    it('channel down should call api', () => {
        tv.control.channel.down();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(8);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(0);
    });

    it('channel up should call api', () => {
        tv.control.channel.up();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(8);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(1);
    });

    it('previous channel should call api', () => {
        tv.control.channel.previous();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(8);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(2);
    });

    it('power off should call api', () => {
        tv.control.power.off();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(11);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(0);
    });

    it('power on should call api', () => {
        tv.control.power.on();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(11);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(1);
    });

    it('power toggle should call api', () => {
        tv.control.power.toggle();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(11);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(2);
    });

    it('Media seek forward should call api', () => {
        tv.control.media.seek.forward();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(2);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(0);
    });

    it('Media seek back should call api', () => {
        tv.control.media.seek.back();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(2);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(1);
    });

    it('Media play should call api', () => {
        tv.control.media.play();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(2);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(3);
    });

    it('Media pause should call api', () => {
        tv.control.media.pause();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(2);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(2);
    });

    it('Media cc should call api', () => {
        tv.control.media.cc();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(4);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(4);
    });

    it('Navigate up should call api', () => {
        tv.control.navigate.up();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(3);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(3);
    });

    it('Navigate down should call api', () => {
        tv.control.navigate.down();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(3);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(0);
    });

    it('Navigate left should call api', () => {
        tv.control.navigate.left();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(3);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(1);
    });

    it('Navigate right should call api', () => {
        tv.control.navigate.right();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(3);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(5);
    });

    it('Navigate ok should call api', () => {
        tv.control.navigate.ok();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(3);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(2);
    });

    it('Navigate back should call api', () => {
        tv.control.navigate.back();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(4);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(0);
    });

    it('Navigate exit should call api', () => {
        tv.control.navigate.exit();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(9);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(0);
    });

    it('Info should call api', () => {
        tv.control.info();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(4);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(6);
    });

    it('Menu should call api', () => {
        tv.control.menu();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(4);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(8);
    });

    it('SmartCast should call api', () => {
        tv.control.smartcast();

        expect(request.put.called).to.be.true;
        expect(request.put.firstCall.args[0].url).to.equal('https://0.0.0.0:9000/key_command/');
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODESET).to.equal(4);
        expect(request.put.firstCall.args[0].body.KEYLIST[0].CODE).to.equal(3);
    });

});
