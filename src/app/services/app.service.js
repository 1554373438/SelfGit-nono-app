(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('AppService', AppService);

  /** @ngInject */
  function AppService($ionicModal, $http, $ionicActionSheet, $ionicPopup, $rootScope, $timeout, $state, UserApi, toastr, UserService, EbankService, md5, user, HOST) {
    var self = this,
        modals = [],
        sendSwitch = false,//开关按钮控制二次点击发送请求－－公用
        options, mScope = $rootScope.$new(true),
        noteScope = $rootScope.$new(true),
        notePopup, noteOption;


    mScope.fn = {}; // fix method can't pass to template
    mScope.user = {}; // modal model
    mScope.fn.btnText = '获取验证码';
    mScope.fn.countdown = 0;
    mScope.fn.registerLog = true; // 控制注册按钮的显示
    mScope.fn.close = closeModal;
    mScope.fn.getVcode = sendVcode; //发送短信验证码
    mScope.fn.goBack = goBack;
    mScope.fn.chooseLoginType = chooseLoginType;
    mScope.fn.doLogin = doLogin;
    mScope.fn.doRetrievePwd = doRetrievePwd;
    mScope.fn.checkPhone = checkPhone;
    mScope.fn.goInSetPwd = goInSetPwd;
    mScope.fn.sendMsg = sendMsg;
    mScope.fn.registerCheck = registerCheck;


    // page switch
    mScope.fn.goPage = goPage;

    //接收注册或登录之后的徽商弹框点击事件
    // $rootScope.$on('toHscg',function (e,data) {
    //   EbankService.goPage(data);
    // });

    // self.linkState = function(state) {
    //   var link;
    //   if (state.indexOf('?') !== -1) {
    //     link = HOST + '/hscg/' + state + '&sessionId=' + user.sessionId + '&terminal=3&version=5.2.0&urlCallBack=iframe';
    //   } else {
    //     link = HOST + '/hscg/' + state + '/?sessionId=' + user.sessionId + '&terminal=3&version=5.2.0&urlCallBack=iframe';
    //   }
    //   $state.go('hscg', { link: link });
    // };


    // export
    self.login = function(_options) {
      options = _options;
      goPage('login.html', 'slide-in-up', true);
    };


    function goPage(templateUrl, animation, isClose) {
      if (isClose) {
        closeModal();
      }
      $ionicModal.fromTemplateUrl('app/login/' + templateUrl, {
        scope: mScope,
        animation: animation || 'slide-in-left'
      }).then(function(_modal) {
        modals.push(_modal);
        _modal.show();
      });
      /*粘贴事件*/
      // if(templateUrl == 'register.vcode.html'){
      //   var pasteEle = document.getElementById('code_input');
      //   pasteEle.addEventListener("paste", function (event){
      //     var elm = document.getElementById('code_input');
      //     var elmLength = elm.innerHTML.length;
      //     if(elm.setSelectionRange) {
      //         elm.setSelectionRange(elmLength, elmLength);
      //         elm.focus();
      //     }
      //     if ( event.clipboardData || event.originalEvent ) {
      //         var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
      //         if ( clipboardData.items ) {
      //             //for chrome
      //             setTimeout(function () {
      //             self.$watch('user.userVcode', function(e, val) {
      //             });
      //             }, 10);
      //         }
      //     }
      //   });
      // }
      // if(templateUrl == 'vcode.login.html'){
      //   setTimeout(function() {
      //    var pasteEle = document.getElementById('main_paste');
      //   pasteEle.addEventListener("paste", function (event){
      //     var elm = document.getElementById('main_paste');
      //     var elmLength = elm.innerHTML.length;
      //     if(elm.setSelectionRange) {
      //         elm.setSelectionRange(elmLength, elmLength);
      //         elm.focus();
      //     }
      //     if ( event.clipboardData || event.originalEvent ) {
      //         var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
      //         if ( clipboardData.items ) {
      //             //for chrome
      //             setTimeout(function () {
      //             self.$watch('user.userVcode', function(e, val) {
      //             });
      //             }, 10);
      //         }
      //     }
      //   });
      //   }, 10);

      // }
    }

    function goBack(root, set) {
      if (set) { //设置密码的返回的提示
        $ionicPopup.show({
          template: '<p class="text-center">是否放弃设置密码?</p>',
          title: '提示',
          scope: mScope,
          cssClass: 'captcha-pop-1',
          buttons: [{
            text: '放弃',
            onTap: function(e) {
              var curModal = modals.pop();
              curModal && curModal.remove();
            }
          }, {
            text: '继续设置'
          }]
        });
        return;
      }
      var curModal = modals.pop();
      curModal && curModal.remove();
      if (root) {
        mScope.user = {};
      }

    }

    function closeModal() {
      var len = modals.length;
      for (var i = len - 1; i >= 0; i--) {
        var _modal = modals[i];
        _modal.remove();
        modals.pop(_modal);
      }
      mScope.user = {};
      $timeout(function () {
        options && options.onCancel && options.onCancel();
      },200);
    }


    function chooseLoginType() {
      $ionicActionSheet.show({
        buttons: [
          { text: '验证码登录' },
          { text: '找回密码' }
        ],
        cancelText: '取消',
        cssClass: 'login-sheet',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          if (index == 0) {
            mScope.user = {};
            mScope.fn.btnText = '获取验证码';
            mScope.user.loginType = 1;
            mScope.fn.registerLog = false;
            goPage('vcode.login.html');
          } else {
            mScope.user = {};
            mScope.fn.btnText = '获取验证码';
            mScope.fn.registerLog = false;
            goPage('register.html');
          }
          return true;
        }
      });
    }

    function ajaxHandler(res) {
      if (res.succeed) {
        UserService.setUser(res.data);
        closeModal();
        $timeout(function () {
          options && options.onSuccess && options.onSuccess();
        },300);
      }

    }

    function doLogin() {
      if(sendSwitch)return;
      if(!sendSwitch){
        sendSwitch = true;
        if (mScope.user.loginType !== 1) {//验证码登录不需要密码
          mScope.user.password = md5.createHash(mScope.user.pwd);
        }
        UserApi.login(mScope.user).success(function(res) {
          sendSwitch = false;
          if (!res.succeed) {
            toastr.info(res.errorMessage);
            return;
          }
          ajaxHandler(res);
        }).error(function(){
          sendSwitch = false;
        });
      }

    }

    /*注册 start 待修改*/

    //注册输入手机号之后的下一步
    function checkPhone() {
      if (!/^1\d{10}/.test(mScope.user.userTel)) {
        toastr.info('手机号码格式不正确');
        return;
      }
      var req = /1[345789]\d{9}$/;
      if (!req.test(mScope.user.userTel)) {
        toastr.info('手机号不合法');
        return false;
      }
      UserApi.checkUserStatus(mScope.user.userTel).success(function(res) {
        if (!res.succeed) {
          toastr.info(res.errorMessage);
          return;
        }
        if(mScope.fn.registerLog){
          if (res.data && res.data.exists == 1) {
            $ionicPopup.show({
              template: '<p class="text-center">该手机号已注册</p>',
              title: '提示',
              scope: noteScope,
              cssClass: 'captcha-pop-1',
              buttons: [
                { text: '知道了' }, {
                  text: '去登录',
                  onTap: function(e) {
                    goPage('login.html');
                  }
                }
              ]
            });
            return;
          }
          mScope.fn.countdown = 0; //显示获取验证码
          mScope.fn.btnText = '获取验证码';
          mScope.fn.sureCaptaha = false;
        }else{
          if (res.data && res.data.exists == 0) {
            $ionicPopup.show({
              template: '<p class="text-center">该手机号还未注册</p>',
              title: '提示',
              scope: noteScope,
              cssClass: 'captcha-pop-1',
              buttons: [
                { text: '知道了' }, {
                  text: '去注册',
                  onTap: function(e) {
                    mScope.fn.registerLog = true;
                    goPage('register.html');
                  }
                }
              ]
            });
            return;
          }
          mScope.fn.countdown = 0; //显示获取验证码
          mScope.fn.btnText = '获取验证码';
          sendVcode();
        }
        goPage('register.vcode.html');
      })
    }
    // 刷新图片验证码
    function refreshCaptcha() {
      UserApi.getPic().success(function(res) {
        if (!res.succeed) {
          toastr.info(res.errorMessage);
          return;
        }
        if(res.data){
          noteScope.data.captcha = res.data.captcha;
          noteScope.data.uuid = res.data.uuid;
        }

      })
    }

    function sendMsg() {
      //注册的获取验证码需要弹窗的
      if (mScope.fn.registerLog) {
        if(!mScope.fn.sureCaptaha){//如果已经成功输入过验证码的话 再次点击不用再输入一遍了
          noteScope.data = {};
          noteScope.data.refreshCap = refreshCaptcha;//注册时发送图片验证码的时候再注册点击事件
          refreshCaptcha();
          var myPopup = $ionicPopup.show({
            templateUrl: 'app/login/notePop.captcha.html',
            title: '请输入图形验证码',
            scope: noteScope,
            cssClass: 'captcha-pop-1',
            buttons: [
              { text: '取消' }, {
                text: '确认',
                onTap: function(e) {
                  e.preventDefault();
                  if (!noteScope.data.captchaNum) {
                    toastr.info('请输入图形验证码');
                    mScope.fn.sureCaptaha = false;
                  } else {
                    if(sendSwitch)return;
                    if(!sendSwitch){
                      sendSwitch = true;
                      UserApi.picCheck(noteScope.data).success(function(res) {
                        sendSwitch = false;
                        if (!res.succeed || (res.data && !res.data.valid)) {
                          toastr.info('图片验证码不正确');
                          noteScope.data.captchaNum = '';
                          refreshCaptcha(); //验证码输入错误后需要更新图形验证码
                          return;
                        }
                        myPopup.close();
                        mScope.fn.sureCaptaha = true;
                        sendVcode();
                      }).error(function(){
                        sendSwitch = false;
                        // toastr.info('系统繁忙，请稍后再试！');
                      })
                    }

                  }
                }
              }
            ]
          });
        }else{
          sendVcode();
        }

        return;
      }
      // 找回密码点击时就直接发送验证码
      sendVcode();



    }
    //发送短信验证码
    function sendVcode() {
      if(sendSwitch)return;
      if(!sendSwitch){
        sendSwitch = true;
        var data = {
          mobile: mScope.user.userTel,
          codeType: mScope.fn.registerLog ? 0 : 3,
          captcha: noteScope.data ? noteScope.data.captchaNum : '',
          uuid: noteScope.data ? noteScope.data.uuid : ''
        };
        UserApi.sendCode(data).success(function(res) {
          sendSwitch = false;
          if (!res.succeed) {
            toastr.info(res.errorMessage);
            mScope.fn.countdown = 0;
            mScope.fn.btnText = '重新获取';
            return;
          }
          startCountdown();
        }).error(function(){
          sendSwitch = false;
          // toastr.info('系统繁忙，请稍后再试！');
          mScope.fn.countdown = 0;
          mScope.fn.btnText = '重新获取';
        })
      }

    }
    // 有验证码的下一步
    function goInSetPwd() {
      if (!mScope.fn.registerLog) { //找回密码输入完验证码之后的校验－－－需要单独校验一下短信验证码
        var data = {
          mobile: mScope.user.userTel,
          vcode: mScope.user.userVcode
        };
        UserApi.findPwdCheckCode(data).success(function(res) {
          if (!res.succeed) {
            toastr.info(res.errorMessage);
            return;
          }
          if (res.data && res.data.jwt) {
            mScope.fn.findJwt = res.data.jwt;
          }
          goPage('register.setPwd.html');
        });

        return;
      }
      goPage('register.setPwd.html');
    }

    //设置密码接口
    function registerCheck() {
      if (!/^(?!\d+$|[a-zA-Z]+$|[\W-_]+$)[\s\S]{6,16}$/.test(mScope.user.pwd)) {
        toastr.info('请输入6-16位数字、字母组成的密码');
        return;
      }
      mScope.user.password = md5.createHash(mScope.user.pwd);
      var data = {
        mobile: mScope.user.userTel,
        vcode: mScope.user.userVcode,
        password: mScope.user.password,
        inviteCode: mScope.user.inviteCode,
        captcha: noteScope.data ? noteScope.data.captchaNum : '',
        uuid: noteScope.data ? noteScope.data.uuid : '',
        jwt: mScope.fn.findJwt
      };
      if (!mScope.fn.registerLog) { //找回密码设置密码接口
        UserApi.findPwdCheck(data).success(function(res) {
          if (!res.succeed) {
            toastr.info(res.errorMessage);
            return;
          }
          mScope.user.username = mScope.user.userTel;//用户返回去登录时不用再一次输入用户名了
          mScope.fn.changePwdStatus = 'find';
          setTimeout(function() {
            goPage('login.html');
          }, 3200);
        });
        return;
      }

      UserApi.registerCheck(data).success(function(res) {
        if (!res.succeed) {
          //短信验证码不正确
          $ionicPopup.show({
            template: '<p class="text-center">' + res.errorMessage + '</p>',
            title: '提示',
            scope: noteScope,
            cssClass: 'captcha-pop-1',
            buttons: [{
              text: '请重试',
              onTap: function(e) {
                mScope.fn.countdown = 0; //显示获取验证码
                mScope.fn.btnText = '获取验证码';
                goBack();
              }
            }]
          });
          return;
        }
        mScope.fn.changePwdStatus = 'register';
        setTimeout(function() {
          ajaxHandler(res);
        }, 3200);
      })
    }

    function startCountdown() {
      mScope.fn.countdown = 60;
      var fn = function() {
        if (mScope.fn.countdown) {
          mScope.fn.countdown--;
          if (mScope.fn.countdown == 0) {
            mScope.fn.btnText = '重新获取';
            return;
          }
          $timeout(fn, 1000);
        }
      };

      fn();
    }

    function doRetrievePwd() {
      modal.hide();
      $timeout(function() {
        $state.go('password:forget');
      }, 0);

    }


    /*注册 end*/

    // 以下不要动
    $rootScope.$on('login:show', function() {
      modal.show();
    });


    noteScope.fn = {};
    self.showNotePopup = function(_option) {
      noteScope.data = {};

      UserApi.heguiCheck().success(function(res) {
        noteScope.data = res.data;
        if (res.errorCode == '0100281') {
          notePopup = $ionicPopup.show({
            cssClass: 'login-note-popup',
            templateUrl: 'app/components/login/note.popup.html',
            title: '',
            scope: noteScope
          });
        }
      });
      noteOption = _option;
    };
    noteScope.fn.close = function() {
      notePopup.close();
      noteOption && noteOption.onClose && noteOption.onClose();
    }

  }
})();
