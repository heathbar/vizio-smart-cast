'use strict';

var expect = require('chai').expect;
var smartCast = require('../index');

describe('#smart-cast-test-suite', function() {
    it('should return whatever is input', function() {
        expect(smartCast(1)).to.equal(1);
    });
});