(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('MonthUpProtocolController', MonthUpProtocolController);

  /** @ngInject */
  function MonthUpProtocolController($stateParams, BasicApi, $state) {
    var vm = this;
    console.log($stateParams.id);
    vm.template = 'assets/templates/yys.protocol.html';
    BasicApi.getMonthUpProtol({id:$stateParams.id}).success(function(res){
      if(res.flag == 1){
        vm.data = res.data;
      }
    }); 

    
  }
})();
