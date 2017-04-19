(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('SafeController', SafeController);

  /** @ngInject */
  function SafeController($ionicHistory, $location) {
    var vm = this;

    if($ionicHistory.backView() || /terminal/.test($location.absUrl())) {
      vm.showBackButton = true;
    }
  }
})();
