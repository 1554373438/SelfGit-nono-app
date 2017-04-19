(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('investCounter', investCounter);

  /** @ngInject */
  function investCounter($log, $filter, toastr, OrderService, CouponService) {
    var directive = {
      restrict: 'E',
      required: 'ngModel',
      scope: {
        order: '=ngModel',
        type: '@'
      },
      template: '<ng-include src="getTemplateUrl()">',
      controller: function($scope) {
        $scope.getTemplateUrl = function() {
          if ($scope.type == 'hasbutton') {
            return 'app/components/invest-counter/invest.counter.html'
          } else {
            return 'app/components/invest-counter/invest.counter.no.button.html'
          }
        }
      },

      link: function(scope, element, attrs) {


        var plan = scope.order,
          peer = +plan.increment,
          min = +plan.priceMin,
          max = +plan.priceMax,
          rate = plan.rate,
          unit = plan.unit,
          expect = plan.expect;

        if (unit == 1) { // day
          scope.order.earnings = $filter('number')(scope.order.price * (rate / 100) / 365 * expect, 2);
        } else { // month
          scope.order.earnings = $filter('number')(scope.order.price * (rate / 100) / 12 * expect, 2);
        }
        OrderService.updateOrder({earnings:scope.order.earnings});


        scope.minus = function() {
          if (scope.order.price > min) {
            scope.order.price -= peer;
          }
        };

        scope.plus = function() {
          if (scope.order.price < max) {
            scope.order.price += peer;
          }
        };



        scope.$watch('order.price', function(newVal, oldVal) {
          if (!+newVal) {
            scope.order.earnings = 0;
            return;
          }
          if (newVal == oldVal) {
            return;
          }
          var price = +newVal || 0;
          if (price - max > 0) {
            scope.order.price = max;
            toastr.info('最大投资金额' + max + '元');
          }
        
          if (unit == 1) { // day
            scope.order.earnings = $filter('number')(price * (rate / 100) / 365 * expect, 2);
          } else { // month
            scope.order.earnings = $filter('number')(price * (rate / 100) / 12 * expect, 2);
          }
          OrderService.updateOrder({earnings:scope.order.earnings});
          CouponService.autoSelectd(scope.order.price);

        });

      }

    };

    return directive;
  }

})();
