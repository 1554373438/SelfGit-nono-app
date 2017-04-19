(function(){
  'use strict';

  angular
    .module('nonoApp')
    .controller('NewsListController', NewsListController);

  /** @ngInject */
  function NewsListController($log, $scope, $rootScope, SystemApi){
    var vm = this, slider;
    

    vm.notice = {
      hasMoreData: true,
      pageIndex: 0,
      itemsPerPage: 10,
      list: []
    };
    vm.loadMore = loadMore;

    function loadMore() {
      SystemApi.getNoticeList({
        type: 2,
        pageIndex: vm.notice.pageIndex,
        itemsPerPage: vm.notice.itemsPerPage
      }).success(function(res) {
        if(res.flag === 1) {
          res.data.result.forEach(function(_item) {
            _item.arc_des = _item.arc_des.slice(0, 40);
            vm.notice.list.push(_item);
          });
          vm.notice.hasMoreData = res.data.result.length === vm.notice.itemsPerPage;
          $log.debug('hasMoreData', vm.notice.hasMoreData)
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      vm.notice.pageIndex++;
    }

    loadMore();
   
  }

    
})();