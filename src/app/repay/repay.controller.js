(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('RepayController', RepayController);

  /** @ngInject */
  function RepayController($rootScope, $scope, BasicApi, UserService, localStorageService, toastr, $log) {
    var vm = this,
      PageIndex;
    vm.repayMonthItems = [];
    vm.repayDetailItems = [];
    vm.toggle = toggle;

    vm.titleButton = true;
    vm.noRepay = false;
    vm.noRepayDetail = false;

    var today = new Date();
    var _year = today.getFullYear(),
      _month = today.getMonth() + 1;
    _month = (_month < 10 ? '0' + _month : _month);

    vm.repayData = _year.toString().concat(_month.toString());
    init(vm.repayData);
    // $scope.repayMonthDetail = init;

    $rootScope.$on('repay.confirmData', function() {
      var selectDate = localStorageService.get('confirmData');
      init(selectDate);
    });

    function init(YyMm) {
      vm.info = [];
      vm.titleButton = true;
      vm.repayData = YyMm;
      BasicApi.getRepayPlanForMonth({
        data: vm.repayData
      }).success(function(res) {
        if (res.flag === 1) {
          if(res.data.repay_items.length == 0){
            vm.noRepay = true;
            return;
          }
          vm.noRepay = false;
          vm.month_expect = res.data.month_expect;
          vm.repayMonthItems = res.data.repay_items;
          res.data.repay_items && res.data.repay_items.forEach(function(_item) {
            vm.info.push(_item.repay_date);
          });
        }
      }).error(function(){
        vm.noRepay = true;
        toastr.info('系统繁忙，请稍后再试!');
      });
    }

    function toggle() {
      vm.titleButton = !vm.titleButton;
      BasicApi.getRepayListInfo({
        pageIndex: 0
      }).success(function(res) {
        if (res.flag === 1) {
          if(res.data.repay_items.length == 0){
            vm.noRepayDetail = true;
            return;
          }
          vm.noRepayDetail = false;
          vm.repayDetailItems = res.data.repay_items;
        }
      }).error(function(){
        vm.noRepayDetail = true;
        toastr.info('系统繁忙，请稍后再试!');
      });
    }
  }
})();
