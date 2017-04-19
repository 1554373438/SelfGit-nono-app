(function(){
	'use strict';

	angular
		.module('nonoApp')
		.controller('MsgDetailController', MsgDetailController);

	/** @ngInject */
	function MsgDetailController($stateParams, utils, SystemApi, toastr){
		var vm = this, id = +$stateParams.id, type = +$stateParams.type;
		switch(type) {
			case 0:
				vm.viewTitle = '公告资讯';
				break;
			case 1: 
				vm.viewTitle = '系统消息';
				break;
			case 2:
				vm.viewTitle = '公司新闻';
				break;
		}

		if(type == 1) {
			SystemApi.getSysMsgDetail({id: id}).success(function(res) {
				if(res.flag != 1) {
					toastr.info(res.msg);
					return;
				}
				var data = res.data;
				if(data){
					vm.title = data.mess_title;
					vm.content = linkFilter(data.mess_content);
					vm.time = data.mess_time ;
				}
			});
			
		} else {
			SystemApi.getNoticeDetail({id: id}).success(function(res) {
				if(res.flag != 1) {
					toastr.info(res.msg);
					return;
				}

				var data = res.data && res.data.result;
				if(data){
					vm.title = data.arc_title;
					vm.content = linkFilter(data.arc_content);
					vm.time = data.create_time;
				}
			});
		}

		function linkFilter(str) {
			// return str.replace(/<a[^<>]*>[^<>]+<\/a>/ig, '');
			return str && str.replace(/href/ig, 'ext-href');
		}
	}

		
})();