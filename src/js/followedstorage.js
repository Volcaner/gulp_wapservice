(function($) {
	$.fn.FollowedStorage = function() {
		var self = this.FollowedStorage;

		// cache
		var objCache = {};

		self.init = function(obj) {
			// 初始化
			console.log("welcome");
			setTimeout(function() {
				_showContent(true);
			}, 200)

			// 初始数据
			var params = {};
			_post4FollowedData(params, function(res) {
				_drawFollowedData(res);
			});

			// 监听 header click事件
			$(".followed>a")[0].addEventListener("click", function() {
				$(".followed>a").addClass("hActive");
				$(".collected>a").removeClass("hActive");
				_showFollowOrCollect(true);
			}, false);
			$(".collected>a")[0].addEventListener("click", function() {
				$(".collected>a").addClass("hActive");
				$(".followed>a").removeClass("hActive");
				_showFollowOrCollect(false);
			}, false);
		};

		var _showContent = function(bool) {
			// content 是否显示
			if(bool) {
				if($("#content").hasClass("hide")) {
					$("#content").removeClass("hide");
				}
			}
			else {
				$("#content").addClass("hide");
			}
		};
		var _showFollowOrCollect = function(bIsFollowed) {
			// true: followedCon; false: collectedCon
			if(bIsFollowed) {
				$(".followedCon").removeClass("hide");
				$(".collectedCon").addClass("hide")

				// 更新数据
				var params = {};
				_post4FollowedData(params, function(res) {
					_drawFollowedData(res);
				});
			}
			else {
				$(".collectedCon").removeClass("hide");
				$(".followedCon").addClass("hide");

				// 更新数据
				var params = {};
				_post4CollectedData(params, function(res) {
					_drawCollectedData(res);
				});
			}
		};
		var _post4FollowedData = function(params, afterOkCallback) {
			var url = '/yich/PhoneWarehousingConcerns';
			var params = params;
			var template = {
				"userId": '20170809162829100300',
				"list|10-60": [
					{
						"group_information|1-3": '光之晨曦海景房白马非马发际线成本',
						"group_information_time": '2017-09-20 17:07:17',
						"notsee_number": 3,
						"publicSignal": {
							"headImg": 'http://wx.qlogo.cn/mmopen/ZBbgbqmSRxzKaTmefRAB5smwhEViaiayaLpbRTrTbj6dYGbXqQOD8PiargGo8ciauW3gGeq9IFqvKPqaibG6icNeKdYTpI28HmZK98/0',
							"nickName|1-4": '蚁巢测试服务号',
							"publicSignalId": '20170918191211100056',
							// "qrcodeUrl": 'http://ngsimage.oss-cn-hangzhou.aliyuncs.com/大b/7c1ddb0c45714d8个任务e8d68c55490ae3ac8-1505801512660.jpg',
						},
						"follow_id": '20170919170456100003',
						"user_name": 'gh_5185fb102ab5',
					},
				],
				"publicSignal": {
					"appid": 'wx434da212d9be10d3',
					"authorizerRefreshToken": 'refreshtoken@@@0Ig7hVuFpmSKeSvPiq0uDvKLemzNHlezP-5RNP3Iupg',
					"creationTime": '2017-09-18',
					"headImg": 'http://wx.qlogo.cn/mmopen/ZBbgbqmSRxzKaTmefRAB5smwhEViaiayaLpbRTrTbj6dYGbXqQOD8PiargGo8ciauW3gGeq9IFqvKPqaibG6icNeKdYTpI28HmZK98/0',
					"isDel": 1,
					"nickName": '蚁巢测试服务号',
					"publicSignalId": '20170918191211100056',
					"qrcodeUrl": 'http://ngsimage.oss-cn-hangzhou.aliyuncs.com/大b/7c1ddb0c45714d8个任务e8d68c55490ae3ac8-1505801512660.jpg',
					"serviceTypeInfo": '2',
					"supshopId": '201702231427410',
					"userName": 'gh_5185fb102ab5',
					"uuid": '201702231427410@1505801490246ZkmTrK3tvh0GXpYj'
				}
			};
			_Ajax(url, params, template, "post", function(res) {
				afterOkCallback(res);
			});

		};
		var _post4CollectedData = function(params, afterOkCallback) {
			var url = '/yich/PhoneCollectionStorage';
			var params = params;
			var template = {
				"userId": "20170223102231100078",
				"supplierShop|10-60": [
					{
						"onthe_New": 23,
						"put_count": "53",
						"shop_logo": "http://ngsimage.img-cn-hangzhou.aliyuncs.com/User/userCenter/2017818145352211527cee46e366616wi36.jpeg",
						"shop_name|1-3": "这个是大B的1",
						"tra_total_money": 3081.23,
						"supshop_id|+5": 0,
					},
				],
			};
			_Ajax(url, params, template, "post", function(res) {
				afterOkCallback(res);
			});
		};
		var _post4CancelCollected = function(params, afterOkCallback) {
			var url = '/yich/PhoneCancelCollectServlet';
			var params = params;
			var template = {
				"flag": "2",
				"userId": "20170223102231100078",
			};
			_Ajax(url, params, template, "post", function(res) {
				afterOkCallback(res);
			});
		};
		var _drawFollowedData = function(res) {
			if(res) {
				// 清空 关注的仓储
				$(".followedCon>ul").empty();

				// cache
				// var result = $.parseJSON(res);
				var result = res;
				objCache = result;

				// 重绘
				if(result.list && result.list.length > 0) {
					result.list.forEach(function(item, index) {
						if(item.publicSignal) {
							var headImg = !isNullorUndefined(item.publicSignal.headImg)?item.publicSignal.headImg:"./../images/icon_0.jpg";
							var nickName = !isNullorUndefined(item.publicSignal.nickName)?item.publicSignal.nickName:"";
							var group_information_time = !isNullorUndefined(item.group_information_time)?item.group_information_time.split(' ')[0].split('-')[1] + "月" + item.group_information_time.split(' ')[0].split('-')[2] + "日":"";
							var group_information = !isNullorUndefined(item.group_information)?item.group_information:"";
							var notsee_number = !isNaN(parseInt(item.notsee_number))&&parseInt(item.notsee_number)>0?"[" + item.notsee_number + "条] ": "";

							var strHtml = '<li class="clearfix">\
									<div class="headerIcon">\
										<img src=' + headImg + ' alt="i">\
										<span class="hide"></span>\
									</div>\
									<div class="storageInfo">\
										<div class="nameArea clearfix">\
											<p>' + nickName + '</p>\
											<span> ' + group_information_time + ' </span>\
										</div>\
										<div class="notice">\
											<p><span>' + notsee_number + '</span>' + group_information + '</p>\
										</div>\
									</div>\
								</li>';

							$(".followedCon>ul").append(strHtml);

							// click event
							$(".followedCon>ul>li")[index].addEventListener("click", function() {
								console.log("___" + index);
								// _htmlScrollPok
								_htmlScrollPok();

								// 二维码
								var qrcodeUrl = !isNullorUndefined(item.publicSignal.qrcodeUrl)?item.publicSignal.qrcodeUrl:'./../images/timg.jpg';
								var qrHtml = '<div class="qrPop">\
										<div class="qrcode">\
											<div class="qrName">\
												<p>' + nickName + '</p>\
												<span class="icon-close"></span>\
											</div>\
											<div class="qrCodePic">\
												<img src=' + qrcodeUrl + ' alt="q">\
											</div>\
											<div class="qrTip">\
												<p>长按识别二维码</p>\
												<p>前往关注的公众号</p>\
											</div>\
										</div>\
									</div>';

								$("body").append(qrHtml);

								$(".qrName>span")[0].addEventListener("click", function() {
									// _htmlScrollOk
									_htmlScrollOk();

									$(".qrPop").remove();
								}, false);

								// 消除提示信息的 条数
								var params = {
									follow_id: !isNullorUndefined(item.follow_id)?item.follow_id:"",
								};
								_post4FollowedData(params, function(res) {
									if(res) {
										if(1 == parseInt(res.flag)) {
											$(".followedCon>ul>li").eq(index).find('.notice').find('span').empty();
										}
										else {
											alert("失败！");
										}
									}
								});
								
							}, false);
						}
					});
				}
			}
		};
		var _drawCollectedData = function(res) {
			if(res) {
				// 清空 收藏的仓储
				$(".collectedCon>ul").empty();

				// cache
				// var result = $.parseJSON(res);
				var result = res;
				objCache = result;

				// 重绘
				if(result.supplierShop && result.supplierShop.length > 0) {
					result.supplierShop.forEach(function(item, index) {
						var shop_logo = !isNullorUndefined(item.shop_logo)?item.shop_logo:"./../images/icon_0.jpg";
						var shop_name = !isNullorUndefined(item.supshop_name)?item.supshop_name:"";
						var put_count = !isNaN(parseInt(item.put_count))&&parseInt(item.put_count)>0?item.put_count: "0";
						var onthe_New = !isNaN(parseInt(item.onthe_New))&&parseInt(item.onthe_New)>0?item.onthe_New: "0";

						var strHtml = '\
							<li class="clearfix">\
								<div class="headerIcon">\
									<img src=' + shop_logo + ' alt="i">\
								</div>\
								<div class="storageInfo">\
									<div class="nameArea clearfix">\
										<p>' + shop_name + '</p>\
									</div>\
									<div class="level clearfix">\
									</div>\
									<div class="product">\
										<p>在线商品数：<span>' + put_count + '</span>件  |  本月上新数：<span>' + onthe_New + '</span>件</p>\
									</div>\
								</div>\
								<div class="cancelCollect">\
									<a class="tabbar-items">\
				                        <span class="tabbar-icon tabbar-active">\
				                            <i class="icon-cancelstar icon-font-nomal"></i>\
				                        </span>\
				                        <span class="tabbar-text">取消收藏</span>\
				                    </a>\
								</div>\
							</li>';

						$(".collectedCon>ul").append(strHtml);

						// 计算等级
						var tra_total_money = !isNaN(parseFloat(item.tra_total_money))&&parseFloat(item.tra_total_money)>0?parseFloat(item.tra_total_money): 0;
						var level = _getLevel(tra_total_money);
						for(var i = 0; i < parseInt(level.split("-")[1]); i++) {
							var imgsrc = "./../images/level_" + level.split("-")[0] + ".png";
							$(".collectedCon>ul>li").eq(index).find(".level").append('<img src=' + imgsrc + ' alt=' + level.split("-")[0] + ' >');
						}

						// 取消收藏
						$(".collectedCon>ul>li").eq(index).find("a")[0].addEventListener("click", function() {
							console.log("取消收藏" + index);

							var params = {
								supshopId: !isNullorUndefined(item.supshop_id)?item.supshop_id:"",
							};
							_post4CancelCollected(params, function(res) {
								if(res) {
									// var result = $.parseJSON(res);
									var result = res;
									if(2 == parseInt(result.flag)) {
										// 取消成功
										console.log(index);

										// 处理缓存cache
										objCache.supplierShop.forEach(function(atom, num) {
											if(item.supshop_id == atom.supshop_id) {
												objCache.supplierShop.splice(num, 1);

												// 删除 dom
												$(".collectedCon>ul>li").eq(num).remove();
											}
										});
									}
									else {
										// 取消失败
										alert("取消失败");
									}
								}
							});
						}, false);
					});
				};
			}
		};
		var _Ajax = function(url, params, template, type, afterOkCallback, afterPOkCallback) {
			// mock 模拟请求，并返回模拟数据
			if(window.bIsMock) {
				Mock.mock(url, template);
			}

			// ajax 请求
			$.ajax({
				type: type,
				url: url,
				data: params,
				success: function(res){
					console.log(res);
					if(typeof res == "string") {
						res = $.parseJSON(res);
					}
					afterOkCallback(res);
				},
				error: function(error){
					console.log(error);
				  	// afterPOkCallback(error);
				}
			});
		};
		var isNullorUndefined = function(str){
			if(str == undefined || str == null || str == ""){
				return true;
			}else{
				return false;
			}
		};
		var _htmlScrollOk = function() {
			var htmlTop = parseFloat($('html').css("top"));
			$('html').css({overflow: "auto", position: "absolute", top: "0px"});
			$('body').scrollTop(Math.abs(htmlTop));
		};
		var _htmlScrollPok = function() {
			var scrollTop = document.body.scrollTop;
			$('html').css({overflow: "hidden", position: "fixed", top: -scrollTop+"px"});
		};
		var _getLevel = function(money) {
			var level="C-1";
			if(money<=500){
				level="C-1";
			}else if(money>500 && money<=2000){
				level="C-2";
			}else if(money>2000 && money<=8000){
				level="C-3";
			}else if(money>8000 && money<=20000){
				level="C-4";
			}else if(money>20000 && money<=50000){
				level="C-5";
			}else if(money>50000 && money<=100000){
				level="B-1";
			}else if(money>100000 && money<=300000){
				level="B-2";
			}else if(money>300000 && money<=1500000){
				level="B-3";
			}else if(money>1500000 && money<=5000000){
				level="B-4";
			}else if(money>5000000 && money<=10000000){
				level="B-5";
			}else if(money>10000000 && money<=20000000){
				level="A-1";
			}else if(money>20000000 && money<=50000000){
				level="A-2";
			}else if(money>50000000 && money<=200000000){
				level="A-3";
			}else if(money>200000000 && money<=600000000){
				level="A-4";
			}else if(money>600000000){
				level="A-5";
			}
			return level;
		};

		return self;
	};
})(Zepto);