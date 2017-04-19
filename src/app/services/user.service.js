(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('UserService', UserService);

  /** @ngInject */
  function UserService(UserApi, AccApi, $log, $rootScope, $location, $ionicHistory, user, localStorageService, $timeout, $state, utils, EbankService, toastr) {
    var self = this;

    self.init = function() {
      $log.info('init UserService');
      var search = $location.search();
      if (search.sessionId) { // from native
        removeUser();
        user.sessionId = search.sessionId;
        UserApi.getJWT().success(function(res) {
          if (res.succeed) {
            user.jwt = res.data.jwt;
            user.refresh = res.data.refresh;
            user.sessionId = res.data.sessionId;
            localStorageService.set('user', user);
          }
        });
      } else {
        login();
      }
    };



    self.setUser = function(_user) {
      user.sessionId = _user.sessionId;
      user.jwt = _user.jwt;
      user.refresh = _user.refresh;

      localStorageService.set('user', user);


      self.getBasicInfo();
      self.updateEbankInfo(true); // do check after login

      // trigger timer
      $timeout(login, 14 * 60 * 1000); // 20min
    };

    self.updateUser = function(obj) {
      var _user = self.getUser() || {};
      angular.merge(_user, obj);
      angular.merge(user, _user);
      localStorageService.set('user', _user);

    };

    self.getUser = function() {
      return localStorageService.get('user');
    };


    self.setAccountInfo = function(info) {
      localStorageService.set('account', info);
    };

    self.getAccountInfo = function() {
      return localStorageService.get('account');
    };

    self.updateAccountInfo = function(info) {
      var _info = self.getAccountInfo() || {};
      angular.merge(_info, info);
      self.setAccountInfo(_info);
    };

    self.logout = function() {
      removeUser();

      user.sessionId = null;
      user.jwt = null;
      user.refresh = null;

      $state.go('home');

      $timeout(function() {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
      }, 1000);
    };

    self.getBasicInfo = function() {
      UserApi.getUserInfo().success(function(res) {
        if (res.succeed) {
          var data = res.data;
          var info = {
            idNo: data.idNo,
            mobile: data.mobile,
            mobileEncrypted: utils.formatPhone(data.mobile), // for display
            realName: data.realName,
            username: data.username
          };


          self.updateUser(info);
        }
      });

      UserApi.getUserLevel().success(function(res) {
        if (res.succeed) {
          var level = res.data.level;
          self.updateUser({ level: level });
        }
      });
      UserApi.getUserCoin().success(function(res) {
        if(res.flag == 1) {
          var coin = res.data;
          self.updateUser({coin: coin});
        }
      })
    }

    self.updateAssetsInfo = function() {
      var balance = {
        assets: 0,
        available: 0, // 可用
        earnings: 0,
        total: 0
          // demand: 0,
          // regular: 0
      };
      AccApi.getBalance().success(function(res) {
        if (res.succeed) {
          var info = res.data;
          balance.assets = +(+info.assets).toFixed(2);
          balance.available = +(+info.nonoAvlBalance).toFixed(2);
          balance.earnings = +(+info.earnings).toFixed(2);
          balance.total = balance.assets + balance.available;
          self.updateAccountInfo(balance);
          $rootScope.$broadcast('updateAssetsInfo.complete');

        }
      });
      // UserApi.getAssetsInfo().success(function(res) {
      //   if (res.flag == 1) {
      //     var data = res.data;
      //     balance.demand = +(+data.csyyBalance).toFixed(2); //活期
      //     balance.regular = +(+data.sxjhBalance).toFixed(2); //定期
      //     // self.updateUser({ balance: balance });
      //     self.updateAccountInfo(balance);
      //   }
      // });

    };

    self.updateEbankInfo = function(doCheck) {
      AccApi.getEbankInfo().success(function(res) {
        if (res.succeed) {
          var data = res.data;
          var eBankInfo = {
            hasEBank: data.hasEBank, //是否开户
            isAuth: data.isAuth, //是否绑卡
            hasPayPwd: data.hasPwd, //是否设置密码
            hasSign4Bid: data.hasSign4Bid, // 是否自动投标
            hasSign4Debt: data.hasSign4Debt, // 是否自动债转
            investAuth: data.hasSign4Bid && data.hasSign4Debt
          };

          self.updateUser(eBankInfo);

          if (!eBankInfo.hasEBank && doCheck) {
            utils.confirm({
              title: '通知',
              content: '<p>诺诺镑客全面升级徽商银行存管为您提供资金透明、符合监管、严格自律的平台服务。</p>',
              cssClass: 'popup-eBank text-left',
              okText: '立即开通徽商存管',
              okType: 'button-positive button-clear',
              cancelText: '先去逛逛',
              cancelType: 'button-positive button-clear',
              onOk: function() {
                self.goPage('entrance');
              }
            });
          }
        }
      });
    }

    function removeUser() {
      // Don't clear all, only user related.
      localStorageService.remove('user', 'account');
    }

    // user for first time
    function login() {
      var _user = self.getUser() || {};
      angular.merge(user, _user);
      if (_user.refresh) {
        UserApi.refreshJwt({ refresh: _user.refresh }).success(function(res) {
          if (res.succeed) {
            angular.merge(_user, res.data);
            self.setUser(res.data);
            $rootScope.$broadcast('getJwt.succeed');
          } else {
            removeUser();
          }
        });
      } else {
        getJwt();
      }
    }

    function getJwt() {
      if(!user.sessionId) {
        return;
      }

      UserApi.getJWT().success(function(res) {
        if (res.succeed) {
          self.updateUser(res.data);
          $rootScope.$broadcast('getJwt.succeed');
        }

      });
    }

    self.getJwt = getJwt;

  }
})();
