(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('CouponService', CouponService);

  /** @ngInject */
  function CouponService(AccApi, OrderService, toastr, utils, $log) {
    var order = {};

    var self = this;
    self.cashList = [];
    self.interestList = [];

    self.selectedCash = {
      value: 0,
      hasCoupon: false,
      list: []
    };
    self.selectedInterest = {
      value: 0,
      hasCoupon: false,
      list: []
    };


    self.init = init;
    self.doSelect = doSelect;
    self.autoSelectd = autoSelectd;


    function init(price) {
      order = OrderService.getOrder();


      self.cashList.length = 0;
      self.interestList.length = 0;

      AccApi.getCouponList({
        id: order.id,
        productType: order.productType, 
      }).success(function(res) {
        if (!res.succeed) {
          toastr.info(res.errorMessage);
          return;
        }
        var data = res.data;
        if (data.coupon) {
          data.coupon.forEach(function(_item) {
            var item = {
              id: _item.id,
              code: _item.code,
              value: _item.value,
              expireDate: _item.stopTime,
              remark: _item.approachDesc,
              minimum: _item.moneyLimit,
              // isEnable: +_item.is_enable || 1, // 0 不可用 1 可用
              isEnable: +_item.is_enable || 1, // 0 不可用 1 可用
              canStack: +_item.superposition ? false : true, //0可叠加
              isSelected: false,
            };
            self.cashList.push(item);
          });
        }
        if (data.interest) {
          data.interest.forEach(function(_item) {
            var item = {
              id: _item.uv_id,
              code: _item.uv_code,
              value: _item.value,
              expireDate: _item.stopTime,
              remark: _item.approachDesc,
              minimum: _item.moneyLimit,
              isEnable: +_item.is_enable || 1, // 0 不可用 1 可用
              canStack: +_item.superposition ? false : true, //0可叠加
              isSelected: false,
            };
            self.interestList.push(_item);
          });
        }
        autoSelectd(price);
      });
    }

    function autoSelectd(price) {
      var len = self.cashList.length;
      self.selectedCash.value = 0;
      self.selectedCash.list.length = 0;
      if (!len) {
        self.selectedCash.hasCoupon = false;
        return;
      }
      self.selectedCash.hasCoupon = true;

      var orderPrice = +price || 0;
      var totalValue = 0;
      var hasStack = false;
      

      for (var i = 0; i < len; i++) {
        if (totalValue > orderPrice) {
          return false;
        }
        var item = self.cashList[i];
        item.isSelected = false;
        var canStack = item.canStack; //0 可叠加

        var value = +item.value;
        var minValue = +item.minimum;

        if (!item.isEnable || !canStack || orderPrice < minValue || value > orderPrice) {
          continue;
        }

        hasStack = true;
        if (totalValue + value > orderPrice) {
          continue;
        }
        totalValue += value;
        item.isSelected = true;
        self.selectedCash.list.push(item);
        self.selectedCash.value = totalValue;

      }

      if (!hasStack) { //不可叠加
        for (var i = 0; i < len; i++) {
          var item = self.cashList[i];
          var value = +item.value;
          var minValue = +item.minimum;
          var canStack = item.canStack; //0 可叠加
          
          if (!item.isEnable || orderPrice < minValue || value > orderPrice) {
            continue;
          }

          if (orderPrice >= minValue && value <= orderPrice) {
            if (!canStack) { //如果不可叠加
              item.isSelected = true;
              self.selectedCash.list.push(item);
              self.selectedCash.value = value;
              hasStack = true;
              return false;
            }
          }
        }
      }

    }

    function doSelect(type, index) {
      order = OrderService.getOrder();
      var price = +order.price;
      if (type == 'interest') {
        var curItem = self.interestList[index];
        var selectedObj= self.selectedInterest;
      } else {
        var curItem = self.cashList[index];
        var selectedObj= self.selectedCash;
      }
      var sumValue = 0;
      if (curItem.isSelected) {
        curItem.isSelected = false;
        selectedObj.list.pop(curItem);
        selectedObj.value -= +curItem.value;
      } else {
        var sumValue = selectedObj.value;
        if (type != 'interest') {
          if (curItem.minimum > price) {
            var title = '投资' + curItem.minimum + '元以上可用';
            utils.alert({ title: title });
            return;
          }
          if (+curItem.value > price || +curItem.value + sumValue > price) {
            utils.alert({ 
              title: '提示',
              subTitle: '您选择的现金券抵扣金额不能大于订单金额，请重新选择~',
            });
            return;
          }
          if (!curItem.canStack && sumValue) {
            utils.alert({ title: '该现金券不可与其它现金券叠加使用哦~' });
            return;
          }
          curItem.isSelected = true;
          selectedObj.list.push(curItem);
          selectedObj.value += +curItem.value;
        } else {
          curItem.isSelected = true;
          selectedObj.list.push(curItem);
          selectedObj.value += +curItem.value;
        }
      }


    }

  }
})();
