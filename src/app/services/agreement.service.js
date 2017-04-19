(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('AgreementService', AgreementService);

  /** @ngInject */
  function AgreementService($rootScope, CommonApi, toastr, $state, $log) {
    var self = this;
    $log.debug('AgreementService.init');
    self.templateUrl = '';

    self.getTemplate = function(params) {
      CommonApi.getAgreementTemplate({
        type: params.type,
        productId: params.productId
      }).success(function(res) {
        
        if(res.succeed) {
          self.templateUrl = res.data && res.data.url && res.data.url.replace('.pdf', '.jpeg');
          $state.go('external', {name: params.name, link: self.templateUrl});
          $rootScope.$broadcast('getAgreementTemplate.success');
        } else {
          toastr.info(res.errorMessage);
        }
      })
    }

    self.getAgreementInvest = function(params, name) {
      CommonApi.getAgreementInvest(params).success(function(res) {
        if(res.succeed) {
          if(res.data.status) {
            toastr.info('协议生成中，请耐心等待');
          } else {
            var url = res.data && res.data.url && res.data.url.replace('.pdf', '.jpeg');
            $state.go('external', {name: name, link: url});
          }
         
        } 
      });
    }

   

  }
})();
