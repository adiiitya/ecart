'use strict';

angular.module('ecart.version', [
  'ecart.version.interpolate-filter',
  'ecart.version.version-directive'
])

.value('version', '0.1');
