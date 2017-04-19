(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('EarningsController', EarningsController);

  /** @ngInject */
  function EarningsController(UserService, UserApi, $log, $rootScope) {
    var vm = this, type, pageIndex = 0, itemsPerPage = 15;

    vm.toggle = toggle;
    vm.detail = {};
    vm.loadMore = load;

    init();

    function init() {
      UserApi.getEarningsInfo().success(function(res) {
        if(res.flag === 1) {
          var data = res.data;

          vm.info = {
            label: '累计收益',
            total: +data.myearnings,
            items: [
              {
                type: 'financePlan',
                name: '诺诺精选',
                amount: +data.financePlan.earnings,
                percentage: 100 * +data.financePlan.earnings / +data.myearnings,
                color: '#ffce29'
              },
              {
                type: 'lend',
                name: '诺诺散投',
                amount: +data.lend.earnings,
                percentage: 100 * +data.lend.earnings / +data.myearnings,
                color: '#ffa429'
              },
              {
                type: 'intimatePlan',
                name: '贴心计划',
                amount: +data.intimatePlan.earnings,
                percentage: 100 * +data.intimatePlan.earnings / +data.myearnings,
                color: '#7a70e7'
              },
              {
                type: 'lazyPlan',
                name: '懒人计划',
                amount: +data.lazyPlan.earnings,
                percentage: 100 * +data.lazyPlan.earnings / +data.myearnings,
                color: '#6ccaef'
              },
              {
                type: 'caishenyeye',
                name: '诺诺钱包',
                amount: +data.caishenyeye.earnings,
                percentage: 100* +data.caishenyeye.earnings / +data.myearnings,
                color: '#1eca9e'
              }
            ],
            size: 160
          };
        }
      });
    }

    function toggle(index) {
      vm.showDetail = !vm.showDetail;
      vm.info.items.forEach(function(_item) {
        _item.hide = !_item.hide;
      });
      vm.info.items[index].hide = false;

      type = vm.info.items[index].type;

      if(vm.showDetail) {
        load();
      } else {
        pageIndex = 0;
        vm.detail = {};
      }
    }

    function load() {
      UserApi.getEarningList({
        type: type,
        pageIndex: pageIndex,
        itemsPerPage: itemsPerPage
      }).success(function(res) {
        if(res.flag === 1) {
          angular.merge(vm.detail, res.data);

          var len = 0;
          angular.forEach(res.data, function(value, key) {
            angular.forEach(value, function() {
              len++;
            });
          });

          vm.hasMoreData = len === itemsPerPage;
        } else {
          vm.hasMoreData = false;
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      
      pageIndex++;
    }

    

  }
})();
