'use strict';

describe('ecart.version module', function() {
  beforeEach(module('ecart.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
