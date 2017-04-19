(function(){
  'use strict';

  angular
    .module('nonoApp')
    .controller('ExternalController', ExternalController);

  /** @ngInject */
  function ExternalController($stateParams) {
    var vm = this;

    vm.name = $stateParams.name;
    vm.link = $stateParams.link.replace('http:','https:');

  }
})();