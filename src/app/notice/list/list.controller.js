(function(){
  'use strict';

  angular
    .module('nonoApp')
    .controller('MsgController', MsgController);

  /** @ngInject */
  function MsgController($scope, $rootScope, SystemApi){
    var vm = this, slider;

    $scope.$watch(function() {
      return vm.sliderIndex;
    }, function(val) {
      slider && slider.slideTo && slider.slideTo(+val);
    });

    $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
      // data.slider is the instance of Swiper
      slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
      // note: the indexes are 0-based
      vm.sliderIndex = data.slider.activeIndex;
      $scope.$apply();
    });

    vm.notice = {
      hasMoreData: true,
      loadMore: loadNoticeList,
      pageIndex: 0,
      itemsPerPage: 10,
      list: []
    };

    function loadNoticeList() {
      SystemApi.getNoticeList({
        pageIndex: vm.notice.pageIndex,
        itemsPerPage: vm.notice.itemsPerPage
      }).success(function(res) {
        if(res.flag === 1) {
          res.data.result.forEach(function(_item) {
            _item.arc_des = _item.arc_des.slice(0, 40);
            vm.notice.list.push(_item);
          });
          vm.notice.hasMoreData = res.data.result.length === vm.notice.itemsPerPage;
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      vm.notice.pageIndex++;
    }

    loadNoticeList();

    vm.sys = {
      hasMoreData: true,
      loadMore: loadSysMsgList,
      pageIndex: 0,
      itemsPerPage: 10,
      list: []
    };

    function loadSysMsgList() {
      SystemApi.getSysMsgList({
        pageIndex: vm.sys.pageIndex,
        itemsPerPage: vm.sys.itemsPerPage
      }).success(function(res) {
        if(res.flag === 1) {
          res.data.result.forEach(function(_item) {
            vm.sys.list.push(_item);
          });
          vm.sys.hasMoreData = res.data.result.length === vm.sys.itemsPerPage;
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      vm.sys.pageIndex++;
    }

    loadSysMsgList();

    
  }

    
})();