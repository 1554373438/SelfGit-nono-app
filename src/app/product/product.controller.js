(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('ProductController', ProductController);

  /** @ngInject */
  function ProductController($stateParams, $rootScope, $scope, $state, $ionicHistory, BasicApi) {

    var vm = this,
      itemsPerPage, slider;

    vm.flag = 0;
    vm.isModals = false;
    vm.isFlag = false;
    vm.isClass = false;
    vm.t = 0;

    // methods
    vm.close = close;
    vm.modals = modals;
    vm.toView = toView;
    vm.reset = reset;

    function reset() {
      vm.isClass = false;
      vm.min = vm.rangeMin;
      vm.max = vm.rangeMax;
    }

    $scope.rangea = function(t) {
      vm.isClass = true;
      $scope.$apply();
      if (+vm.min >= +vm.max) {
        vm.min = vm.max;
        $scope.$apply();
      }

    }
    $scope.rangeb = function(t) {
      vm.isClass = true;
      $scope.$apply();
      if (+vm.max <= +vm.min) {
        vm.max = vm.min;
        $scope.$apply();
      }
    }


    function modals() {
      vm.isModals = true;
    }

    function close() {
      vm.isModals = false;
    }

    // 优化
    // var vm = this, itemsPerPage, slider;
    var product = null;
    vm.dingtou = {
      desc: '',
      list: [],
      hasMoreData: false,
      pageIndex: 0

    };
    vm.zhitou = {
      desc: '',
      list: [],
      hasMoreData: false,
      pageIndex: 0
    };
    vm.debt = {
      desc: '',
      list: [],
      hasMoreData: false,
      pageIndex: 0,
      type: 0
    };
    vm.isLoading = true;
    vm.noData = false;

    vm.minExpect = 1;
    vm.maxExpect = 36;

    vm.showToolBar = false;
    vm.goDetail = goDetail;
    vm.loadMore = loadMore;
    vm.doRefresh = doRefresh;
    // init();

    $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
      // data.slider is the instance of Swiper
      slider = data.slider;
      $scope.$watch(function() {
        return vm.sliderIndex;
      }, function(val) {
        slider && slider.slideTo && slider.slideTo(+val);
        $ionicHistory.nextViewOptions({
          disableBack: true,
          historyRoot: true
        });
        $state.go('.', { type: +val }, { notify: false, location: 'replace' });
      });

    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
      // note: the indexes are 0-based
      vm.sliderIndex = data.slider.activeIndex;
      vm.minExpect = null;
      vm.maxExpect = null;
      if (vm.sliderIndex == 1) {
        vm.showToolBar = true;
        vm.minExpect = 1;
        vm.maxExpect = 12;
      } else if (vm.sliderIndex == 2) {
        vm.minExpect = 1;
        vm.maxExpect = 36;
        vm.showToolBar = true;
      } else {
        vm.showToolBar = false;
      }
      vm.noData = false;
      $scope.$apply();
      init();
    });

    vm.sliderIndex = +$stateParams.type || 0;

    init();

    function toView(t) {
      vm.isModals = false;
      vm.zhitou.pageIndex = 0;
      vm.zhitou.hasMoreData = false;
      vm.zhitou.list = [];
      vm.debt.pageIndex = 0;
      vm.debt.hasMoreData = false;
      vm.debt.list = [];
      vm.minExpect = vm.min;
      vm.maxExpect = vm.max;

      loadMore(t);
    }

    function init() {
      vm.isModals = false;
      itemsPerPage = 20;
      loadMore();
    }

   

    function doRefresh(flag) {
      BasicApi.getProductIndexList({
        productType: vm.sliderIndex,
        pageSize: itemsPerPage,
        pageNo: product.pageIndex,
        min_expect: vm.minExpect,
        max_expect: vm.maxExpect,
        type: product.type
      }).success(function(res) {
        if(flag) {
          product.list.length = 0;
        }

        vm.isLoading = false;
        if (res.flag != 1) {
          vm.noData = true;
          product.hasMoreData = false;
          product.pageIndex = 0;
          return;
        }
        if (res.flag == 1) {
          var data = res.data;
          if (vm.sliderIndex == 1) {
            vm.temp = data.max_expect;
          }
          vm.min = vm.rangeMin = data.min_expect || 1;
          vm.max = vm.rangeMax = data.max_expect || 36;
          product.desc = data.product_desc;
          product.total = data.total;

          if ((!+data.total && vm.sliderIndex != 0) || (vm.sliderIndex == 0 && data.productList && !data.productList.length)) {
            vm.noData = true;
            product.hasMoreData = false;
            return;
          }

          vm.noData = false;
          data.productList.forEach(function(item) {
            item.rateShow = item.rate_show && item.rate_show.replace(/%/g, '<span class="small">%</span>');
          });


          data.productList.forEach(function(item) {
            product.list.push(item);
          })

          product.hasMoreData = (res.data.productList && res.data.productList.length) == itemsPerPage;

        }
      }).finally(function() {
        if (vm.sliderIndex != 0) {
          $rootScope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.$broadcast('scroll.refreshComplete');

      });
    }

    function loadMore(reload) {
      product = null;
      var length = 0,
        type = null;
      if (vm.sliderIndex == 0) {
        product = vm.dingtou;
      } else if (vm.sliderIndex == 1) {
        product = vm.zhitou;
      } else {
        product = vm.debt;
        type = 0; //1 为债转包
      }

      length = product.list.length;
      if (length && !reload) {
        vm.noData = false;
        vm.isLoading = false;
        if (vm.sliderIndex == 1) {
          vm.min = vm.rangeMin = 1;
          vm.max = vm.rangeMax = vm.temp;
        } else if (vm.sliderIndex == 2) {
          vm.min = vm.rangeMin = 1;
          vm.max = vm.rangeMax = 36;
        }
        return;
      }

      if (!length) {
        vm.isLoading = true;
      } else {
        vm.isLoading = false;
      }
      doRefresh();
      
      product.pageIndex++;
    }

    function goDetail(index) {
      var route = '';
      var p = null;
      if (vm.sliderIndex == 0) {
        p = vm.dingtou.list[index];
        route = 'invest:detail';
      } else if (vm.sliderIndex == 1) {
        p = vm.zhitou.list[index];
        route = 'directInvest:detail';
      } else {
        p = vm.debt.list[index];
        route = 'debtInvest:detail';
      }

      $state.go(route, { scope: p.scope, id: p.pro_id });
    }
  }
})();
