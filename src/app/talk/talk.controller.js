(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('TalkController', TalkController);

  /** @ngInject */
  function TalkController(BridgeService, $state, $timeout, LIVE_LINK) {
    var vm = this;
  }
})();
