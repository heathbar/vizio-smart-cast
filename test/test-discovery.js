'use strict';

let expect = require('chai').expect,
    sinon = require('sinon'),
    request = require('request-promise-native'),
    smartcast = require('../index');

describe('#smart-cast-discovery-tests', function() {

    it('discover method should exist', function() {
        expect(smartcast.discover).to.be.a('function');
    });

    // TODO: figure out how to test this thing
});