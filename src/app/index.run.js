(function() {
  'use strict';

  angular
    .module('nonoApp')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $state, $ionicLoading, $http, $httpParamSerializerJQLike, $ionicHistory, $ionicViewSwitcher, BridgeService, UserService, AppService, BILog, utils, user, $location, $timeout, toastr, LIVE_LINK, CommonApi) {
    $rootScope.$on('loading:show', function() {
      $ionicLoading.show({
        noBackdrop: true,
        hideOnStateChange: true
      });
    });

    $rootScope.$on('loading:hide', function() {
      $ionicLoading.hide();
    });

    $rootScope.$on('ajax:error', function(evt, rejection) {
      if (rejection.config.method === 'POST') {
        toastr.info(rejection.status + ' : ' + rejection.statusText);
      }
    });

    // serialize http request data
    $http.defaults.transformRequest.unshift($httpParamSerializerJQLike);

    // override ionicGoBack
    $rootScope.$ionicGoBack = function() {
      if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else if (BridgeService.bridge) {
        BridgeService.backToApp();
      } else {
        var back = ($state.current || {}).defaultBack;
        if (!back) return;

        $ionicViewSwitcher.nextDirection('back');
        $ionicHistory.nextViewOptions({
          disableBack: true,
          historyRoot: true
        });
        $state.go(back.state || 'home', back.params);
      }
    };

    // routing interceptor
    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {
      // enter from APP
      if(!user.jwt && user.sessionId && CLIENT_VERSION) {
        // prevent enter any page
        evt.preventDefault();
        // get jwt
        // UserService.getJwt();
        // continue last routing
        $rootScope.$on('getJwt.succeed', function() {
          $state.go(toState, toParams);
        });

        return;
      }
      switch (toState.name) {
        case 'product':
          var back = fromState.defaultBack;
          if (back && back.state === 'product') {
            toParams.type = back.params.type;
          }
          break;
        case 'flow':
        case 'talk':
          evt.preventDefault();
          $state.go('error');
          break;
        case 'mine':
        case 'envoy':
        case 'limit':
        case 'welfare':
        case 'mall':
        case 'card':
        case 'home:login':
          if (!user.sessionId) {
            evt.preventDefault();
            AppService.login({
              onSuccess: function() {
                $state.go(toState.name, toParams);
                AppService.showNotePopup();
              }
            });
          }
          break;
        case 'external':
          if (/nono-app/.test(toParams.link)) {
            evt.preventDefault();
            $timeout(function() {
              $location.path(decodeURIComponent(toParams.link.split('#')[1]));
            }, 500);
          }
          break;
        case 'purchase':
          if (!user.sessionId) {
            evt.preventDefault();
            AppService.login({
              onSuccess: function() {
                $state.go(toState.name, toParams);
              }
            });
          }

          // if(/card:add/.test(fromState.name)) {
          //   $timeout(function() {
          //     PayService.showModal();
          //   }, 200);
          // }
          break;
      }
      // if(toState.name == 'card:add') {
      //   PayService.hideModal();
      // } else if(toState.name !='purchase'){
      //   PayService.closeModal();
      // }

    });

    $rootScope.$on('$stateChangeSuccess', function() {
      // BI Log, page view event start
      BILog.enter();
    });

    // init security
    CommonApi.getSysTime().success(function(res) {
      if (res.succeed) {
        var sysTime = +res.data.timestamp;
        var offsetTime = sysTime - Date.now();
        sessionStorage.setItem("mzST", offsetTime);
      }
    });
   


    // init bridge
    BridgeService.init();

    // init UserService
    UserService.init();



    $log.debug('runBlock end');
  }

})();
