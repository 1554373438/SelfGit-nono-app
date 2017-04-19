(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('nonoAgree', nonoAgree);

  /** @ngInject */
  function nonoAgree($ionicActionSheet, $state, AgreementService) {
    var directive = {
      restrict: 'E',
      templateUrl: "app/components/nono-agree/agree.html",
      scope: {
        agree: '=',
        type: '@',
        order: '='
      },
      link: function(scope, element, attr) {
        scope.agree = true;
        var protocolTitle = '', agreementType = '';
        if(scope.type != "debt") {
          if(scope.order.productType == 15) {
            protocolTitle ='月月升计划协议书';
            agreementType = 3;

          } else if(scope.order.productType == 16){
            protocolTitle = '借款协议';
            agreementType = 6;
          } else {
            protocolTitle = scope.order.title + '协议书';
            if(scope.order.productType == 2) {
              agreementType = 5;
            } else {
              agreementType = 4;
            }
          }
        } else {
          protocolTitle = '债权转让协议书';
          agreementType = 1;
        }

        scope.showSheet = function() {
          $ionicActionSheet.show({
            buttons: [
              { text: protocolTitle},
              { text: '电子签章使用授权书'}
            ],
            cancelText: '取消',
            cssClass: 'agree-sheet',
            cancel: function() {
              // add cancel code..
            },
            buttonClicked: function(index) {
              if (index == 0) {
                AgreementService.getTemplate({type: agreementType, productId: scope.order.id, name: protocolTitle});
              } else {
                AgreementService.getTemplate({type: 12, name: '电子签章使用授权书'});

              }
              return true;
            }
          });
        }
      }
    };

    return directive;
  }

})();
