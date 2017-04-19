(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('productList', productList)
    .directive('productItem', productItem);

  /** @ngInject */
  function productList() {
    var directive = {
      restrict: 'E',
      transclude: true,
      template: '<div class="list nono-product-list" ng-transclude></div>',
      link: function(scope, element, attr) {

      }
    };

    return directive;
  }

  /** @ngInject */
  function productItem($log) {
    var directive = {
      restrict: 'E',
      scope: {
        product: '='
      },
      templateUrl: 'app/components/product-list/product.html',
      link: function(scope, element, attr) {
        var format = function() {
          var p = scope.product, refundMode;

          switch(+p.collectionMode) {
            case 0:
              refundMode = '先息后本';
              break;
            case 1:
              refundMode = '退出还本付息';
              break;
            case 2:
              refundMode = '等额本息';
              break;
          }

          p.duration = p.expect + (+p.expectUnit ? '天' : '个月');
          p.refundMode = refundMode;
          p.priceMin = (+p.priceMin).toFixed(0);

          var rates = p.rateShow.split('+');
          p.yield = rates[0];
          p.yieldPlus = rates[1];

          p.isEnd = +p.percent === 100;
        };

        scope.$watch('product', format, true);
        
      }
    };

    return directive;
  }

})();
