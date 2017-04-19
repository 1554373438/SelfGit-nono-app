(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('RecordsListController', RecordsListController);

  /** @ngInject */
  function RecordsListController(BasicApi, $scope, $state, $rootScope, $ionicSlideBoxDelegate, localStorageService) {
    var vm = this,
      slider, pageIndex=0, pageIndexDirect=0, pageIndexDebt=0, itemsPerPage=10, recVersion="5.0.0";
    vm.planList = [];
    vm.recordDirectList = [];
    vm.myDebtList = [];

    vm.loadMorePlan = loadMorePlan;
    vm.loadRecordDirect = loadRecordDirect;
    vm.loadMydebt = loadMydebt;

    vm.detailPlan = detailPlan;
    vm.detailRecordDirect = detailRecordDirect;
    vm.detailDebt = detailDebt;

    vm.sliderTabs = ['计划类', '诺诺盈', '债转类'];
    vm.sliderIndex = 0;

    $scope.$watch(function() {
      return vm.sliderIndex;
    }, function(val) {
      slider && slider.slideTo && slider.slideTo(+val);
    });

    $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
      // data.slider is the instance of Swiper
      slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
      // note: the indexes are 0-based
      vm.sliderIndex = data.slider.activeIndex;
      $scope.$apply();
      switch (vm.sliderIndex) {
        case 0:
          if (!vm.planList.length) {
            vm.loadMorePlan();
          }
          break;
        case 1: 
          if (!vm.recordDirectList.length) {
            vm.loadRecordDirect();
          }
          break;
        case 2: 
          if (!vm.loadMydebt.length) {
            vm.loadMydebt();
          }
          break;

      }


    });

    // init();
    loadMorePlan();

    
    //计划类
    function loadMorePlan() {
      BasicApi.investRecords({
        pageIndex: pageIndex,
        itemsPerPage: itemsPerPage
      }).success(function(res) {
        if (res.flag === 1) {
          res.data && res.data.investRecords.forEach(function(_item) {
            vm.planList.push(_item);
            vm.investRecordNum = res.data.investRecordNum || 0;
          });
        }

        vm.hasMoreDataPlan = res.data && res.data.investRecords && res.data.investRecords.length === 10;
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });
      pageIndex++;
    }

    function detailPlan(index) {
      localStorageService.set('record', vm.planList[index]);
      $state.go('records:detail');
    }

    // 诺诺盈
    function loadRecordDirect() {
      BasicApi.getInvestRecord({
        pageIndex: pageIndexDirect,
        itemsPerPage: itemsPerPage
      }).success(function(res) {
        if (res.flag === 1) {
          res.data && res.data.records.forEach(function(_item) {
            vm.recordDirectList.push(_item);
            vm.RecordDirectTotal = res.data.total;
          });
        }

        vm.hasMoreDataRecordDirect = res.data && res.data.records && res.data.records.length === 10;
        // vm.hasMoreDataRecordDirect = vm.recordDirectList.length && vm.recordDirectList.length !== (res.data && +res.data.total);
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });
      pageIndexDirect++;
    }

    function detailRecordDirect(index) {
      localStorageService.set('record', vm.recordDirectList[index]);
      $state.go('records:detail');
    }

    // 债转类
    function loadMydebt() {
      BasicApi.getDebtInvest({
        pageIndex: pageIndexDebt,
        itemsPerPage: itemsPerPage
      }).success(function(res) {
        if (res.flag === 1) {
          res.data && res.data.investRecords && res.data.investRecords.forEach(function(_item) {
            vm.myDebtList.push(_item);
          });
          vm.myDebtTotal = res.data.investRecordNum;
        }
        vm.hasMoreDataDebt = res.data && res.data.investRecords && res.data.investRecords.length === 10;
        // vm.hasMoreDataDebt = vm.myDebtList.length && vm.myDebtList.length !== (res.data && +res.data.investRecordNum);
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });
      pageIndexDebt++;
    }

    function detailDebt(index) {
      localStorageService.set('record', vm.myDebtList[index]);
      $state.go('records:detail');
    }
  }
})();
