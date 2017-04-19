(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('coupon', coupon);

  /** @ngInject */
  function coupon($state, $log, $timeout, $filter) {
    var directive = {
      restrict: 'E',
      scope: {
        data: '=',
        type: '@'
      },
      replace: true,
      templateUrl: 'app/components/coupon/coupon.html',
      link: function(scope, element, attrs) {
        var d = scope.data;

        switch(scope.type) {
          case 'coupon':
          case 'interest':
            scope.info = {
              name: d.uv_approach,
              value: d.value,
              isUsed: +d.is_used,
              isExpired: +d.statue === 4,
              remark: d.uv_remark,
              expireDate: d.stop_time,
              type: scope.type === 'coupon' ? '现<br />金<br />券' : '加<br />息<br />券'
            };
            break;
        
          case 'rp':
            scope.info = {
              name: '红包',
              value: d.gain_amount,
              isUsed: +d.gain_status === 2,
              isExpired: +d.gain_status === 3,
              remark: d.package_resource,
              expireDate: d.end_date,
              type: '现<br />金<br />红<br />包'
            };
            break;
        }
      }
    };

    return directive;
  }

})();
