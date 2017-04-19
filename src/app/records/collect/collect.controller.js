(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('CollectDetailController', CollectDetailController);

  /** @ngInject */
  function CollectDetailController(BasicApi, $scope, $state, $rootScope, $ionicSlideBoxDelegate, localStorageService) {
    var vm = this, pageIndex, itemsPerPage;
    vm.listInfo = localStorageService.get('record');

    vm.loadMore = loadMore;

    init();
    function init() {
      pageIndex = 0;
      itemsPerPage = 10;

      vm.planList = [];

      loadMore()
    }
    
    function loadMore() {
      var bId = vm.listInfo.bId
      BasicApi.getAcceptRecord({
        pageIndex: pageIndex,
        itemsPerPage: itemsPerPage,
        boId: bId
      }).success(function(res) {
        if(res.flag === 1) {
          res.data && res.data.record.forEach(function(_item) {
            vm.planList.push(_item);
          });
        }
        vm.hasMoreData = res.data && res.data.record && res.data.record.length ===10;
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });
      console.log(vm.planList);
      pageIndex++;
    }

  }
})();
