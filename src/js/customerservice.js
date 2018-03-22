(function($) {
	$.fn.CustomerService = function() {
		var self = this.CustomerService;

		// cache
		var objCache = {};
		var orderId = "";
		var state = "";

		self.init = function(obj) {
			console.log("CustomerService");

			// 获取 orderId，（即子单编号）
			orderId = _getProid("orderId");
			// orderId = "20171009144738107062";

			// 获取state，（即售后状态）
			state = _getProid("state");
			// state = "N";

			// 1. 初始界面？ 退货界面？ 换货界面？
			if(state == "N") {
				// 初始界面
				$(".enter_area").removeClass("hide");
			}
			else if(state == "Y" || state == "L" || state == "S" || state == "E" || state == "F" || state == "T") {
				// 退货界面
				window.location.href = '/yich/wapservice/dist/html/customerservice_r.html?orderId=' + orderId;
			}
			else if(state == "H" || state == "A" || state == "D" || state == "CP" || state == "CL") {
				if(state == "CP") {
					// 初始界面
					$(".enter_area").removeClass("hide");
				}
				else {
					// 换货界面
					window.location.href = '/yich/wapservice/dist/html/customerservice_c.html?orderId=' + orderId;
				}
			}

			$(".enter_area>ul>li").eq(0).on("click", function() {
				// 退货界面
				window.location.href = '/yich/wapservice/dist/html/customerservice_r.html?orderId=' + orderId;
			});

			$(".enter_area>ul>li").eq(1).on("click", function() {
				// 换货界面
				window.location.href = '/yich/wapservice/dist/html/customerservice_c.html?orderId=' + orderId;
			});
		};

		var _getProid = function(name) {
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r!=null) {
				return unescape(r[2]);
			}else {
				return null;
			};
		};

		return self;
	};
})(Zepto);