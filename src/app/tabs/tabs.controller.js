(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('TabsController', TabsController);

  /** @ngInject */
  function TabsController($rootScope, $state, $ionicHistory, $log) {
    var reset = function() {
      $rootScope.hideTabs = !/tabs.home|tabs.product|tabs.discover|tabs.mine/.test($state.current.name);
    };

    $rootScope.$on('$ionicView.beforeEnter', function() {
      reset();
    });

    $rootScope.$on('$ionicView.afterEnter', function() {
      reset();
    });

    this.onTabSelected = function(tab) {
      $ionicHistory.clearHistory();
    };
  }
})();
