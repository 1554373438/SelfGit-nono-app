(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController($scope, $rootScope, $state, user, AppService, BasicApi, UserApi, toastr,toastrConfig, $interval, $ionicScrollDelegate, $log, $location, localStorageService) {
    var vm = this;
    vm.user = user;
    var tip = {
      active: false,
      info: function(msg) {
        var _this = this;
        if (_this.active) {
          return; 
        }
        _this.active = true;
        vm.tipInfo = msg;
        $interval(function() {
          vm.tipInfo = '';
          _this.active = false;
        }, 3000)
      }
    };

    vm.hideNavBar = true;
    vm.doRefresh = loadData;
    vm.bannerDetail = bannerDetail;
    vm.hotDetail = hotDetail;
    vm.typeShowDetail = typeShowDetail;
    vm.sepcInvestDetail = sepcInvestDetail;
  
    // main scroll 
    $scope.$watch(function() {
      return $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
    }, function(val) {
      vm.hideNavBar = val < 44;
    });

    init();

    function init() {
      var data = localStorageService.get('home');
      if (data) {
        initData(data);
      }
      loadData();
      getCoupon();
    }

    function getCoupon() {
      BasicApi.getAppCoupon().success(function(res) {
        if (res.flag == 1) {
          var info = res.data.info;
          if (info) {
            tip.info(info);
          }
        }
      });
    }

    function initData(data) {
      vm.banners = data.banner;
      vm.viceBanner = data.viceBanner;
      vm.userType = data.userType;

      vm.hotRecommend = data.hotRecommend;
      vm.hotRecommendOne = data.hotRecommend[0];
      vm.hotRecommendNew = data.hotRecommend && data.hotRecommend.slice(1);
      vm.secondaryBanner = data.secondaryBanner && data.secondaryBanner[0] || null;

      vm.typeShows = data.typeShow;
      vm.characterInvest = data.characterInvest;
    }

    function loadData() {
      BasicApi.getHomeData().success(function(res) {
        if (res.flag == 1) {
          var data = res.data;
          console.log(data);
          localStorageService.set('home', data);
          initData(data);
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.refreshComplete');
      });
    }

    function bannerDetail(index) {
      var item = vm.banners[index];

      linkJumper(item);
    }

    function hotDetail(index) {
      var p = vm.hotRecommend[index];
      var type = p.proType || p.type;
      if (type < 3) { //定投产品信息
        $state.go('invest:detail', { scope: p.scope, id: p.fp_id });
      } else if (type == 3) { //直投产品信息
        $state.go('product',{type: 1});
      } else { //债转产品信息
        $state.go('product', {type: 2});
      }
    }

    function typeShowDetail(index) {
      var p = vm.typeShows[index];
      var type = p.proType || p.type;

      switch (+type) {
        case 2:
          $state.go('invest:detail', { scope: 15, id: p.fp_id }); //月月升
          break;
        case 3:
          $state.go('product',{type: 1}); //诺诺盈
          break;
        case 1:
          $state.go('product', { type: 0});//贴心计划
          break;
        case 4:
          $state.go('product', {type: 2}); //债权转让
          break;
       
      }
    }
    function sepcInvestDetail(index) {
      var p = vm.characterInvest[index];
      var name = p.name;
      $state.go('specInvest:detail', {name: name, isShare: false})
    }

    function linkJumper(item) {
      $state.go('external', { name: item.name, link: item.link });
    }

  }
})();
