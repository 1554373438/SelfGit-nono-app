(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('UserApi', UserApi);

  /** @ngInject */
  function UserApi($http, $log, APISERVER, utils, md5, user) {
    var tokenId = localStorage.getItem('tongdun_token');
    if(!tokenId) {
      tokenId =  "shield2016" + (new Date()).getTime();
    }
    // 获取jwt
    this.getJWT = function() {
      return $http.get(APISERVER.FESERVER + '/common/jwt/'+user.sessionId);
    }
    // 刷新jwt
    this.refreshJwt = function(obj) {
       return $http({
        method: 'GET',
        url: APISERVER.FESERVER + '/common/refresh-jwt/'+ obj.refresh,
      });
    };

    //检查是否已经注册过了
    this.checkUserStatus = function(value){
      return $http({
        method:'GET',
        url: APISERVER.FESERVER + '/common/check/'+'mobile'+'/'+value
      })
    };
    //图形验证码获取
    this.getPic = function(){
      return $http({
        method:'GET',
        url: APISERVER.FESERVER + '/common/captcha'
      })
    };
    //图形验证码校验
    this.picCheck = function(obj){
      return $http({
        method:'GET',
        url: APISERVER.FESERVER + '/common/captcha/verify',
        params:{
          captcha: obj.captchaNum,
          uuid: obj.uuid
        }
      })
    };
    // 短信验证码发送
    this.sendCode = function(obj){
      return $http.post(APISERVER.FESERVER + '/user/v-code', {
          mobile: obj.mobile,
          tokenId: tokenId,
          codeType: obj.codeType,
          captcha: obj.captcha,
          uuid: obj.uuid
        });
    };


    //注册接口
    this.registerCheck = function(obj){
      return $http({
        method:'POST',
        url: APISERVER.FESERVER + '/user/register',
        data:{
          mobile: obj.mobile,
          vcode: obj.vcode,
          password: obj.password,
          tokenId: tokenId,
          inviteCode: obj.inviteCode,
          captcha: obj.captcha,
          uuid: obj.uuid
        }
      })
    };
    
    this.getBasicInfo = function() {
      return $http.get(APISERVER.FESERVER + '/user/info');
    }

    // 登录
    this.login = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.FESERVER + '/user/login',
        data: {
          tokenId: tokenId,
          loginType: obj.loginType || 2,
          username: obj.loginType == 1?obj.userTel:obj.username,
          password: obj.password,
          vcode: obj.userVcode,
          bizCode: 0,
          clientType: 2
        }
      });
    };

    //找回密码的短信验证码的校验
    this.findPwdCheckCode = function(obj){
      return $http.post(APISERVER.FESERVER + '/user/login-password/retrieve/mobile-auth', {
          mobile: obj.mobile,
          vcode: obj.vcode
        });
    };
    // 找回密码设置接口
    this.findPwdCheck = function(obj){
      return $http({
        method:'post',
        url: APISERVER.FESERVER + '/user/login-password/retrieve/set',
        data: {
          mobile: obj.mobile,
          vcode: obj.vcode,
          password: obj.password,
          tokenId: tokenId,
          inviteMobile: obj.inviteMobile,
          captcha: obj.captcha,
          uuid: obj.uuid
        },headers: {
            jwt:obj.jwt
        }
      })
    };
    // 获取用户基本信息
    this.getUserInfo = function() {
      return $http({
        method: 'GET',
        url: APISERVER.FESERVER + '/user/info'

      });
    };

    // 校验用户登录密码
    this.checkOldPassword = function(obj) {
      return $http.post(APISERVER.FESERVER + '/user/login-password/check', {
        password: md5.createHash(obj)
      });
    };

    this.getUserLevel = function() {
      return $http({
        method: 'GET',
        url: APISERVER.FESERVER + '/user/level'
      });
    };

    
    // 修改密码
    this.changePassword = function(obj) {
      return $http.post(APISERVER.FESERVER + '/user/login-password/update', {
        oldPassword: md5.createHash(obj.oriPassword),
        newPassword: md5.createHash(obj.newPassword)
      });
    };

    this.changePayPassword = function(obj) {
      return $http.post(APISERVER.MSAPI + '/user/changePayPassword', {
        sessionId: user.sessionId,
        oldZFPwd: md5.createHash(obj.oriPassword),
        newZFPwd: md5.createHash(obj.newPassword)
      });
    };

    this.getSessionId = function() {
      return $http.get(APISERVER.MSAPI + '/user/getSessionId');
    };

    // 获取镑客大使邀请码
    this.getInviteCode = function() {
      return $http.post(APISERVER.MSAPI + '/user/myProlocutorCode', {
        sessionId: user.sessionId
      });
    };

    this.getUserBalance = function() {
      return $http.post(APISERVER.MSAPI + '/payV1/userBalance', {
        sessionId: user.sessionId,
        terminal: 3
      })
    };

    this.getAssetsInfo = function() {
      return $http.post(APISERVER.MSAPI + '/licai/asset', {
        sessionId: user.sessionId
      }, {
        silence: true
      });
    };

    this.getEarningsInfo = function() {
      return $http.post(APISERVER.MSAPI + '/licai/getMyEarning', {
        sessionId: user.sessionId
      });
    };

    this.getEarningList = function(obj) {
      return $http.post(APISERVER.MSAPI + '/licai/getMyEarningListByType', {
        sessionId: user.sessionId,
        pageNo: obj.pageIndex,
        pageSize: obj.itemsPerPage,
        type: obj.type
      }, {
        silence: obj.pageIndex
      });
    };

    this.getUserLevel = function() {
      return $http({
        method: 'GET',
        url: APISERVER.FESERVER + '/user/level'
      });
    };
    
    this.getLevelInfo = function() {
      return $http.post(APISERVER.MSAPI + '/activityvip/getUserNONOVipMsg', {
        sessionId: user.sessionId
      }, {
        silence: true
      });
    };

    this.getBalanceDetail = function(obj) {
      return $http.post(APISERVER.MSAPI + '/licai/moneyBalanceDetail', {
        sessionId: user.sessionId,
        pageNum: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    };
    // 诺币
    this.getUserCoin = function() {
      return $http.post(APISERVER.MSAPI + '/licai/getTotalNoNOCoin', {
        sessionId: user.sessionId
      });
    }




    this.feedback = function(obj) {
      return $http.post(APISERVER.MSAPI + '/user/feedBack', {
        sessionId: user.sessionId,
        suggestion: obj.content
      });
    };

    this.shippingAddr = function(obj) {
      return $http.post(APISERVER.MSAPI + '/user/changeUserCenterAddress', {
        sessionId: user.sessionId,
        province: obj && obj.province.id,
        city: obj && obj.city.id,
        address: obj && obj.detail
      });
    };


    // 忘记密码-发送手机验证码
    // this.sendValidateMobile = function(obj) {
    //     return $http.post(APISERVER.MSAPI + '/user/sendValidateMobile', {
    //       mobilenum: obj.mobilenum
    //     });
    //   }
    //   // 忘记密码-找回密码
    // this.findLoginPwd = function(obj) {
    //   return $http.post(APISERVER.MSAPI + '/user/findPassword', {
    //     mobilenum: obj.mobilenum,
    //     validation: obj.validation,
    //     idCard: obj.idCard
    //   });
    // }
    // this.changeLoginPwd = function(obj) {
    //   return $http.post(APISERVER.MSAPI + '/user/changeFindPassword', {
    //     sessionId: obj.sessionId,
    //     password: obj.password,
    //   });
    // }

    this.getDeliverInfo = function() {
        return $http.post(APISERVER.MSAPI + '/user/getDeliverInfo', {
          sessionId: user.sessionId
        });
      }
      // 更换绑定手机号
    this.validateUserPwd = function(obj) {
      return $http.post(APISERVER.MSAPI + '/user/validateUserPassword', {
        sessionId: user.sessionId,
        password: md5.createHash(obj.pwd)
      });
    }

    this.validateMobile = function(obj) {
      return $http.post(APISERVER.MSAPI + '/user/validateMobile', {
        sessionId: user.sessionId,
        mobile: obj.mobile
      });
    }

    this.validateMobileVerification = function(obj) {
      return $http.post(APISERVER.MSAPI + '/user/validateMobileVerification', {
        sessionId: user.sessionId,
        mobile: obj.mobile,
        validCode: obj.validCode
      });
    }

    this.heguiCheck = function() {
      return $http.post(APISERVER.MSAPI + '/rebuild/userinfo/heguiCheck', {
        sessionId: user.sessionId
      });
    }

    $log.debug('UserApi end');

  }
})();
