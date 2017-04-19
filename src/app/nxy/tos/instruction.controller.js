(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('NxyInstructionController', NxyInstructionController);

  /** @ngInject */
  function NxyInstructionController($stateParams, BasicApi, $state) {
    var vm = this;
    vm.template = 'assets/templates/nxy.instructions.html';
  }
})();
