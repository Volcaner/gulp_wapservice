(function($) {
	$.fn.CustomerServiceC = function() {
		var self = this.CustomerServiceC;

		// cache
		var objCache = {};
		var orderId = "";
		var state = "";
		var changeId = "";

		// 
		var maxNum = 4;
		var index = 0;
		var files = [];
		var maxSize = 5;
		var imgList = [];

		// postTypes
		var postChildren = [
			{
				id: 0,
				name: "顺丰快递",
			},{
				id: 1,
				name: "天天快递",
			},{
				id: 2,
				name: "申通快递",
			},{
				id: 3,
				name: "韵达快递",
			},{
				id: 4,
				name: "圆通快递",
			},{
				id: 5,
				name: "汇通快递",
			},{
				id: 6,
				name: "EMS邮政快递",
			},{
				id: 7,
				name: "中通快递",
			},{
				id: 8,
				name: "宅急送",
			},{
				id: 9,
				name: "国通快递",
			},{
				id: 10,
				name: "快捷快递",
			},{
				id: 11,
				name: "龙邦快递",
			},{
				id: 12,
				name: "其他快递",
			}
		];

		self.init = function(obj) {
			console.log("CustomerServiceC");

			// 获取 orderId，（即子单编号）
			orderId = _getProid("orderId");

			// haha,初始状态判断
			_post4Status();
		};

		var _post4Status = function() {
			var url = "/yich/PhoneChangeLink";
			var params = {
				orderId: orderId,
			};
			var template = {};
			_Ajax(url, params, template, "post", function(res) {
				_drawPage(res);
			});

		};
		var _drawPage = function(res) {
			if(res) {
				objCache = res;

				if(res.order) {
					var order = res.order;

					// wxsdk
					var wxUrl = "/yich/WechatShareSevlert";
					var wxParams = JSON.stringify({
						"proId": "",
        				"thisdata": window.location.href.split('#')[0],
					});
					var wxTemplate = {};
					_Ajax(wxUrl, wxParams, wxTemplate, "post", function(result) {
						if(result) {
							wx.config({
								debug: false,
								appId: result.appId,
								timestamp: result.timestamp,
								nonceStr: result.noncestr,
								signature: result.signature,
								jsApiList: [
									'previewImage',
								]
						    });
						}
					});

					// 售后状态
					if(!isNorU(order.retOrderState)) {
						var retState = order.retOrderState;
						// retState = "CL";
						if("N" == retState) {
							// 解放提交申请页面
							$(".apply_area").removeClass("hide");

							// handle
							_doFillandSubmit(res);
						}
						else if(retState == "Y" || retState == "L" || retState == "S" || retState == "E" || retState == "F" || retState == "T") {
							// TODO: 是否跳转退货界面？
							if(retState == "L") {
								var changeState = _getProid("changeState");
								if(!isNorU(changeState) && changeState=="C") {
									// 解放提交申请页面
									$(".apply_area").removeClass("hide");

									// handle
									_doFillandSubmit(res);
								}
								else {
									window.location.href = '/yich/wapservice/dist/html/customerservice_r.html?orderId=' + orderId;
								}
							}
							else {
								window.location.href = '/yich/wapservice/dist/html/customerservice_r.html?orderId=' + orderId;
							}
						}
						else if(retState == "H" || retState == "A" || retState == "D" || retState == "CP" || retState == "CL") {
							// 解放售后状态页面
							$(".status_area").removeClass("hide");
							switch(retState) {
								case "H": {  // 申请换货
									_setStatus($(".wait_d"));
									_apply4ReturnGoods(res);
									break;
								}
								case "D": {  // 拒绝申请
									var changeState = _getProid("changeState");
									if(!isNorU(changeState) && changeState=="C") {
										// 解放提交申请页面
										$(".apply_area").removeClass("hide");

										// handle
										_doFillandSubmit(res);
									}
									else {
										_setStatus($(".refuse_d"));
										_refuseApply(res);
									}
									
									break;
								}
								case "A": {  // 同意换货
									_setStatus($(".agree_d"));
									_agreeReturnG(res);
									break;
								}
								case "CP": {  // 换货完成
									_setStatus($(".ok_d"));
									// _returnOk(res);
									break;
								}
								case "CL": {  // 关闭换货
									_setStatus($(".close_d"));
									// _returnClose(res);
									break;
								}
								default: {
									break;
								}
							}

							// goods_info
							if(res.order) {
								var order = res.order;

								var title = !isNorU(order.title)?order.title:"";
								$(".status_area .goods_name>p")[0].innerHTML = title;  // 商品名

								var sku = !isNorU(order.sku_properties_name)?order.sku_properties_name:"";
								$(".status_area .goods_name>span")[0].innerHTML = sku;  // sku

								var price = !isNorU(order.price)?order.price:"0.00";
								var traAmount = !isNaN(parseInt(order.traAmount))?order.traAmount:"0";
								$(".status_area .goods_price>p")[0].innerHTML = "￥" + price;  // 商品单价
								$(".status_area .goods_price>span")[0].innerHTML = "×" + traAmount;  // 购买数量
							}
							if(res.cg) {
								var cg = res.cg;

								changeId = !isNorU(cg.changeId)?cg.changeId:"";

								var reason = !isNorU(cg.reason)?cg.reason:"无";
								$(".reason_s")[0].innerHTML = reason;  // 申请原因

								var explain = !isNorU(cg.explain)?cg.explain:"无";
								$(".instruct_s")[0].innerHTML = explain;  // 申请说明

								var startTime = !isNaN(parseInt(cg.startTime))?_date('Y-m-d H:i:s', parseInt(cg.startTime/1000)):"";
								$(".time_s")[0].innerHTML = startTime;  // 申请时间

								// TODO: 凭证
								var reg = /,$/gi; 
								var evisrc = !isNorU(cg.evisrc)?cg.evisrc.replace(reg,""):"";
								var arrSrc = evisrc.split(",");
								if(!isNorU(evisrc) && arrSrc && arrSrc.length > 0) {
									var wh={
										w:parseInt(parseFloat(_getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
										h:parseInt(parseFloat(_getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
									};
									var whe="@"+wh.w+"w_"+wh.h+"h";
									var arrWheSrc = [];
									arrSrc.forEach(function(iurl, index) {
										arrWheSrc.push(_imgsize(iurl, whe));
									});

									if(arrWheSrc.length > 0) {
										$(".info_proof").removeClass("hide");
										$(".voucher_s")[0].innerHTML = "";
										$(".voucher_s").append('<ul><li></li></ul>');
										var k = 0;
										for(var i = 0; i < arrWheSrc.length; i++) {
											with({b: i}) {
												if((b-k*4) >= 4) {
													k++;
													$(".voucher_s>ul").append('<li></li>');
												}

												$(".voucher_s>ul>li").eq(k).append('<span><img name="voucher_img_' + b + '" src=' + arrWheSrc[b] + ' alt=""></span>');

												$("img[name=voucher_img_" + b + "]").on("click", function() {
													// alert("voucher_img_" + b);
													wx.ready(function() {
												    	// 预览图片
														wx.previewImage({
															current: arrWheSrc[b], // 当前显示图片的http链接  
															urls: arrWheSrc // 需要预览的图片http链接列表 
														});
													});

												    wx.error(function(res){
											    	 	// alert("shibai");
											    	});
												});
											}
										}
									}
								}
							}
							
							var wh={
								w:parseInt(parseFloat(_getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
								h:parseInt(parseFloat(_getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
							};
							var whe="@"+wh.w+"w_"+wh.h+"h";
							var iconSrc = !isNorU(res.src)?_imgsize(res.src, whe):"./../images/icon_0.jpg";
							$(".status_area .goods_icon>img")[0].src = iconSrc;  // 商品图片

							// supShop
							if(res.order && res.order.supShop) {
								var supShop = res.order.supShop;

								var shop_name = !isNorU(supShop.supshop_name)?supShop.supshop_name:"";
								$(".name_s")[0].innerHTML = shop_name;  // 仓储名称

								var tel = !isNorU(supShop.shopTel)?supShop.shopTel:!isNorU(supShop.tel)?supShop.tel:"无";
								$(".mobile_s")[0].innerHTML = tel;  // 联系手机

								var mobile = !isNorU(supShop.landline_tel)?supShop.landline_tel:"无";
								$(".tel_s")[0].innerHTML = mobile;  // 联系座机
							}

							// returnRecord
							$(".records_d").on("click", function() {
								$(".returnRecord").removeClass("hide");
								_htmlScrollPok();
								_post4ReturnRecord();
							})
							$(".goback").on("click", function() {
								$(".returnRecord").addClass("hide");
								_htmlScrollOk();
							})

							// 查看已下单商品
							$("button[value=soldout]").on("click", function() {
								window.location.href = '/yich/wapservice/dist/html/orderAllGoods.html';
							});
						}
						else {
							// TODO: 是否跳转404？
							return;
						}
					}
				}
			} 
		};

		// 显示换货记录
		var _post4ReturnRecord = function() {
			var url = "/yich/CurrentChangeRecord";  // ServiceRecord
			var params = {
				// orderId: orderId,
				// type: 2,
				changeId: changeId,
			};
			var template = {};
			_Ajax(url, params, template, "post", function(res) {
				if(res) {
					// 换货记录
					_handleReturnRecord(res);
				}
			});
		};
		var _handleReturnRecord = function(res) {
			if(res.list && res.list.length > 0) {
				var list = res.list;
				$(".returnRecord>ul")[0].innerHTML = "";
				list.forEach(function(item, index) {
					var head = !isNorU(item.head)?item.head:"./../images/icon_0.jpg";
					var userName = !isNorU(item.nickName)?item.nickName:"";
					var sendTime = !isNorU(item.operTime)?item.operTime:"";
					var message = !isNorU(item.message)?item.message:"";
					var reason = !isNorU(item.reason)?item.reason:"";

					var strHtml = '\
						<li>\
							<div class="re_name clearfix"><span><img src=' + head + ' alt="0"></span><div><p>' + userName +'</p><span>' + sendTime +'</span><span>' + reason +'</span></div></div>\
							<div class="re_message"><p>' + message + '</p></div>\
							<div class="re_voucher hide"><label>上传凭证：</label><br><div class="clearfix"></div></div>\
						</li>';
					$(".returnRecord>ul").append(strHtml);

					// TODO: 凭证
					var reg = /,$/gi; 
					var evisrc = !isNorU(item.src)?item.src.replace(reg,""):"";
					var arrSrc = evisrc.split(",");
					if(!isNorU(evisrc) && arrSrc && arrSrc.length > 0) {
						var wh={
							w:parseInt(parseFloat(_getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
							h:parseInt(parseFloat(_getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
						};
						var whe="@"+wh.w+"w_"+wh.h+"h";
						var arrWheSrc = [];
						arrSrc.forEach(function(iurl, index) {
							arrWheSrc.push(_imgsize(iurl, whe));
						});

						$(".returnRecord>ul>li").eq(index).find(".re_voucher").removeClass("hide");
						var k = 0;
						$(".returnRecord>ul>li").eq(index).find(".re_voucher").find("div")[0].innerHTML = "";
						$(".returnRecord>ul>li").eq(index).find(".re_voucher").find("div").append('<ul><li></li></ul>');

						for(var i = 0; i < arrWheSrc.length; i++) {
							with({b: i}) {
								if((b-k*4) >= 4) {
									k++;
									$(".returnRecord>ul>li").eq(index).find(".re_voucher").find("div").find("ul").append('<li></li>');
								}

								$(".returnRecord>ul>li").eq(index).find(".re_voucher").find("div").find("ul").find("li").eq(k).append('<span><img name="re_voucher_img_' + index + "_" + b + '" src=' + arrWheSrc[b] + ' alt=""></span>');

								$("img[name=re_voucher_img_" + index + "_" + b + "]").on("click", function() {
									// alert("voucher_img_" + b);
									wx.ready(function() {
								    	// 预览图片
										wx.previewImage({
											current: arrWheSrc[b], // 当前显示图片的http链接  
											urls: arrWheSrc // 需要预览的图片http链接列表 
										});
									});

								    wx.error(function(res){
							    	 	// alert("shibai");
							    	});
								});
							}
						}

						// for(var i = 0; i < arrSrc.length; i++) {
						// 	if((i-k*4) >= 4) {
						// 		k++;
						// 		$(".returnRecord>ul>li").eq(index).find(".re_voucher").find("div").find("ul").append('<li></li>');
						// 	}

						// 	$(".returnRecord>ul>li").eq(index).find(".re_voucher").find("div").find("ul").find("li").eq(k).append('<span><img src=' + _imgsize(arrSrc[i], whe) + ' alt=""></span>');
						// }
					}
				});
			}
		};

		var _setStatus = function(el) {
			var radList = document.querySelectorAll(".rad_d");
			radList.forEach(function(item, index) {
				$(".rad_d").eq(index).addClass("hide");
			});
			el.removeClass("hide");
		};

		var _doFillandSubmit = function(res) {
			/**
			 * 添加凭证
			 * @param  {[type]} ) {				addPicBox("uploadPicBox");			} [description]
			 * @return {[type]}   [description]
			 */
			$("#uploadPicBox").on("ready", function() {
				addPicBox("uploadPicBox");
			});
			// 外部方法，控制 picbox 显示和数量
			function addPicBox(parentId) {
				// 随机ID
				var uploadPicId = "uploadPic_" + Math.round(Math.random()*8999+1000);

				// 添加 picbox 
				$("#" + parentId).append('<div id="' + uploadPicId + '" class="uploadPic"></div>');

				// picbox ready
				$("#" + uploadPicId).on("ready", function() {
					ready2UploadPic(uploadPicId, maxSize, function(file) {
						// 上传逻辑
						files.push(file);

						_imgToAliyun(file);


						index++;
						if(index < maxNum) {
							addPicBox(parentId);
						}
					}, function(file) {
						// 删除逻辑
						files.forEach(function(item, num) {
							if(item == file) {
								files.splice(num, 1);
								return;
							}
						});

						imgList.forEach(function(item, num) {
							var name = item.name.substring(item.name.split("_")[0].length+1, item.name.length);
							if(name == file.name) {
								imgList.splice(num, 1);
								return;
							}
						});

						if(index == maxNum) {
							$("#" + uploadPicId).remove();
							index>0 ? index-- : index=0;
							addPicBox(parentId);
						}
						else {
							$("#" + uploadPicId).remove();
							index>0 ? index-- : index=0;
						}
					});
				});
			};
			// 主要方法，调用上传图片的插件
			function ready2UploadPic(parentId, maxSize, afterGetFileCallback, afterClickDelCallback) {
				var parentId = parentId;
				var maxSize = maxSize;  // Mb
				var uploadPicObj = new UploadPic();
			    uploadPicObj.init(parentId, maxSize, function(file) {
			    	// after click ok callback
			    	afterGetFileCallback(file);
			    }, function(file) {
			    	// after click del callback
			    	afterClickDelCallback(file);
			    });
			}
			// submit
			function click2Submit() {
				console.log(files);
			}

			/**
			 * 申请原因
			 * @return {[type]} [description]
			 */
			function click2ShowPop() {
		        var popChooseObj = new PopChoose();
		        var items = [
		        	"大小尺寸与商品描述不符",
		        	"材料/面料与商品描述不符",
		        	"颜色/款式/图案与描述不符",
		        	"质量问题",
		        	"仓储发错货",
		        	"收到商品少件/破损污渍",
		        	"个人原因",
		        ];
		        popChooseObj.init(items, function(item) {
		        	console.log(item);

		        	$(".reason").find("input")[0].value = item;

		        	if(item == "个人原因") {
		        		if(objCache && objCache.ApplicationNote) {
		        			var payment = !isNaN(parseFloat(objCache.ApplicationNote.payment))?parseFloat(objCache.ApplicationNote.payment).toFixed(2):"0.00";
		        			$("input[name=refund]")[0].value = payment;
		        		}
		        	}
		        	else {
		        		if(objCache && objCache.ApplicationNote) {
		        			var total_Amount = !isNaN(parseFloat(objCache.ApplicationNote.total_Amount))?parseFloat(objCache.ApplicationNote.total_Amount).toFixed(2):"0.00";
		        			$("input[name=refund]")[0].value = total_Amount;
		        		}
		        	}

		        	popChooseObj.close();
		        });
			};
			$(".reason").on("click", click2ShowPop);

			/**
			 * goods_info
			 * @param  {[type]} res.ApplicationNote [description]
			 * @return {[type]}                     [description]
			 */
			if(res.order) {
				var order = res.order;

				var title = !isNorU(order.title)?order.title:"";
				$(".goods_name>p")[0].innerHTML = title;  // 商品名

				var sku = !isNorU(order.skuPropertiesName)?order.skuPropertiesName:"";
				$(".goods_name>span")[0].innerHTML = sku;  // sku

				var price = !isNorU(order.price)?order.price:"0.00";
				var traAmount = !isNaN(parseInt(order.traAmount))?order.traAmount:"0";
				$(".goods_price>p")[0].innerHTML = "￥" + price;  // 商品单价
				$(".goods_price>span")[0].innerHTML = "×" + traAmount;  // 购买数量
			}
			var wh={
				w:parseInt(parseFloat(_getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
				h:parseInt(parseFloat(_getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
			};
			var whe="@"+wh.w+"w_"+wh.h+"h";
			var iconSrc = !isNorU(res.src)?_imgsize(res.src, whe):"./../images/icon_0.jpg";
			$(".goods_icon>img")[0].src = iconSrc;  // 商品图片

			/**
			 * [description]
			 * @param  {[type]} e) {				var     retExplain [description]
			 * @return {[type]}    [description]
			 */
			$(".explain_input").on("paste", function(e) {
				var retExplain = $(".explain_input")[0].innerHTML.replace(/<[^>]+>/g,"");
				if(retExplain && retExplain.length > 200) {
					retExplain = retExplain.substring(0, 200);
				}

				$(".explain_input")[0].innerHTML = retExplain;
				$(".explain_num")[0].innerHTML = retExplain.length;
			});

			$(".explain_input").on("input", function(e) {
				var retExplain = $(".explain_input")[0].innerHTML;
				if(retExplain && retExplain.length > 200) {
					retExplain = retExplain.substring(0, 200);
					$(".explain_input")[0].innerHTML = retExplain;
				}

				$(".explain_num")[0].innerHTML = retExplain.length;
			});

			/**
			 * submit
			 * @param  {[type]} ) {				console.log("aftermarketdetails");				var retRea [description]
			 * @return {[type]}   [description]
			 */
			$("button[value=submit]").on("click", function() {
				console.log("aftermarketdetails");

				var retRea = $(".reason").find("input")[0].value;
				retRea = !isNorU(retRea)&&"请选择"!=retRea?retRea:"";
				var retExplain = $(".explain_input")[0].innerHTML;
				var srcImage = "";
				var src = !isNorU(res.src)?res.src:"";
				imgList.forEach(function(item, index) {
					srcImage += (item.src) + ",";
				});
				if(!isNorU(retRea)) {
					var url = "/yich/PhoneApplyChange";
					var params = {
						reason: retRea,
						sm: retExplain,
						pzsrc: srcImage,
						src: src,
						orderId: orderId,
						changeId: res.cg && !isNorU(res.cg.changeId) ? res.cg.changeId : "",
					};
					var template = {};
					_Ajax(url, params, template, "post", function(res) {
						console.log(res);
						if(res) {
							if(!isNaN(parseInt(res.result)) && parseInt(res.result) > 0) {
								window.location.href = '/yich/wapservice/dist/html/customerservice_c.html?orderId=' + orderId;
							}
							else {
								alert("提交失败！");
							}
						}
						else {
							alert("提交失败！");
						}
					});
				}
				else {
					alert("请选择申请原因！");
				}
			});

			/**
			 * 仅退款、退换货规则
			 */
			$(".rule>p>a").on("click", function() {
				$('.as_ruleBox').show();
				$('.as_ruleBox').css({"z-index": 99, "position": "relative"});
			});
		};
		var _imgToAliyun = function(file) {
			// aliyun
			var re='oss-cn-hangzhou';
			var KeyId='LTAIuio3BmR3xlxV';
			var KeySecret='SaNNLqkclS0UbU0HzqtR9m0r8tyx47';
			var bu='ngsimage';
			var client = new OSS.Wrapper({
			    region: re,
			    accessKeyId: KeyId,
			    accessKeySecret: KeySecret,
			    bucket: bu
			});

			function showTime(){
				var date = new Date();
				var year = date.getFullYear();
				var month = date.getMonth()+1;
				var day = date.getDate();
				var hour = date.getHours();
				var minute = date.getMinutes();
				var second = date.getSeconds();
				var str=(year+''+month+''+day+''+hour+''+minute+''+second);
				return str;
			};

			loading.show();
			client.multipartUpload(showTime()+"_"+file.name, file).then(function (result) {
				if(result.url) {
					var imgurl = result.url;
				}
				else {
					var imgurl = "http://ngsimage.oss-cn-hangzhou.aliyuncs.com/" + result.name;
				}

				imgList.push({name: result.name, src: imgurl});
				loading.hide();
			}).catch(function (err) {
				console.log(err);
				loading.hide();
			});
		};

		var _apply4ReturnGoods = function(res) {
			if(!isNaN(parseInt(res.day))) {
				_countDown($(".wait_d>.timer_d>span")[0], parseInt(res.day), function() {
					// 倒计时结束？
				});
			}

			$("button[value=withdrawn]").on("click", function() {
				_withDrawn(res);
			});
		};
		var _withDrawn = function(res) {
			var parentId = "app";
			var tips = "撤销后，申请将自动关闭，确定吗？"
		    var popConfirmObj = new PopConfirm();
		    popConfirmObj.init(parentId, tips, function() {
		    	// after click ok callback
		    	var url = "/yich/PhoneCancelChange";
				var params = {
					orderId: orderId,
					changeId: res.cg && !isNorU(res.cg.changeId) ? res.cg.changeId : "",
				};
				var template = {};
				_Ajax(url, params, template, "post", function(res) {
					console.log(res);
					if(res) {
						if(!isNaN(parseInt(res.result))) {
							if(parseInt(res.result) > 0) {
								// 撤销申请成功
								_setStatus($(".close_d"));
							}
							else {
								// 撤销申请失败
								alert("撤销申请失败");
							}
						}
					}
				});
		    });
		};
		
		var _refuseApply = function(res) {
			if(!isNaN(parseInt(res.day))) {
				_countDown($(".refuse_d>.timer_d>span")[0], parseInt(res.day), function() {
					// 倒计时结束？
				});
			}
			var refuseInfo = !isNorU(res.cg.refuse)?res.cg.refuse:"";
			$(".refuse_d>.tips_d>ul>li")[0].innerHTML = "拒绝理由：" + refuseInfo;

			$("button[value=exchangeG]").on("click", function() {
				console.log("退货");
				
				var url = "/yich/PhoneUReturningChange";
				var params = {
					orderId: orderId,
				};
				var template = {};
				_Ajax(url, params, template, "post", function(res) {
					if(res) {
						window.location.href = '/yich/wapservice/dist/html/customerservice_r.html?orderId=' + orderId + '&changeState=R';
					}
				});
			});

			$(".logistics button[value=arbitrate]").on("click", function() {
				console.log("仲裁介入");
				var parentId = "app";
				var tips = "仲裁暂未开放，请前往电脑端操作！"
		        var ArbitratePopObj = new PopConfirm();
		        ArbitratePopObj.init(parentId, tips, function() {
		        	// after click ok callback
		        	// alert(888);
		        });
			});

			$("button[value=closeApplic]").on("click", function() {
				console.log("关闭申请");
				var parentId = "app";
				var tips = "确定关闭退货申请吗？";
			    var popConfirmObj = new PopConfirm();
			    popConfirmObj.init(parentId, tips, function() {
			    	// after click ok callback
			    	var url = "/yich/PhoneCancelChange";
					var params = {
						orderId: orderId,
						changeId: res.cg && !isNorU(res.cg.changeId) ? res.cg.changeId : "",
					};
					var template = {};
					_Ajax(url, params, template, "post", function(res) {
						console.log(res);
						if(res) {
							if(!isNaN(parseInt(res.result))) {
								if(parseInt(res.result) > 0) {
									// 撤销申请成功
									_setStatus($(".close_d"));
								}
								else {
									// 撤销申请失败
									alert("撤销申请失败");
								}
							}
						}
					});
			    });
			});

			$("button[value=modifyRestart]").on("click", function() {
				console.log("修改并重新发起");
				var url = "/yich/PhoneChangeLink";
				var params = {
					orderId: orderId,
					changeId: res.cg && !isNorU(res.cg.changeId) ? res.cg.changeId : "",
				};
				var template = {};
				_Ajax(url, params, template, "post", function(res) {
					// _drawPage(res);
					console.log(res);
					window.location.href = '/yich/wapservice/dist/html/customerservice_c.html?orderId=' + orderId + '&changeState=C';
				});
			});
		};

		var _agreeReturnG = function(res) {
			// cg
			if(res.cg) {
				var note = res.cg;
				var ret_add = !isNorU(note.supAddress)?note.supAddress:",";
				var strAddress = !isNorU(ret_add.split(",")[0])?ret_add.split(",")[0]:"";
				var explain = ret_add.split(",").splice(1, ret_add.split(",").length).join(" ");
				$(".recipients>p").eq(1).find("span")[0].innerHTML = strAddress;  // 退货地址
				$(".recipients>p").eq(2).find("span")[0].innerHTML = explain;  // 说明
			}

			// countdown
			if(!isNaN(parseInt(res.day))) {
				_countDown($(".agree_d>.timer_d>span")[0], parseInt(res.day), function() {
					// 倒计时结束？
				});
			}

			// 仲裁介入
			$(".agree_btn button[value=arbitrate]").on("click", function() {
				console.log("仲裁介入");
				var parentId = "app";
				var tips = "仲裁暂未开放，请前往电脑端操作！"
		        var ArbitratePopObj = new PopConfirm();
		        ArbitratePopObj.init(parentId, tips, function() {
		        	// after click ok callback
		        	// alert(888);
		        });
			});

			// 确认完成换货
			$(".agree_btn button[value=confirmOk]").on("click", function() {
				console.log("确认完成换货");
				var url = "/yich/PhoneComfireChange";
				var params = {
					orderId: orderId,
					changeId: res.cg && !isNorU(res.cg.changeId) ? res.cg.changeId : "",
				};
				var template = {};
				_Ajax(url, params, template, "post", function(res) {
					console.log(res);
					if(res) {
						if(res.result == 1) {
							window.location.href = '/yich/wapservice/dist/html/customerservice_c.html?orderId=' + orderId;
						}
						else {
							alert("完成换货失败！");
						}
					}
				});
			})
		};

		var _waitReceipt = function(res) {
			if(!isNaN(parseInt(res.initTimeOfTimeOut))) {
				_countDown($(".wait_receipt>.timer_d>span")[0], parseInt(res.initTimeOfTimeOut), function() {
					// 倒计时结束？
				});
			}

			// TODO: 物流信息
			var logname = !isNorU(res.logname)?res.logname:"";
			var lognum = !isNorU(res.lognum)?res.lognum:"";
			$(".wait_receipt>.express_d>span")[0].innerHTML = logname;
			$(".wait_receipt>.logistics>span")[0].innerHTML = lognum;
			

			$("button[value=changeLogistics]").on("click", function() {
				$(".popInputLogistics").removeClass("hide");
				_htmlScrollPok();

				if(logiListener) {
					clearInterval(logiListener);
				}
				var logiListener = setInterval(function() {
					var logiComp = $("input[name=logiComp]")[0].value;
					var logiNum = $("input[name=logiNum]")[0].value;

					if(!isNorU(logiComp) && !isNorU(logiNum)) {
						$("button[value=logisticsNum]").addClass("active_btn");
					}
					else {
						$("button[value=logisticsNum]").removeClass("active_btn");
					}
				}, 500);

				// 物流信息提交
				$("button[value=logisticsNum]").on("click", function() {
					var logiComp = $("input[name=logiComp]")[0].value;
					var logiNum = $("input[name=logiNum]")[0].value;
					_post4logistics(logiComp, logiNum, function() {
						clearInterval(logiListener);
					})
				});
			})
			// TODO: 快递插件
			var postArr = [
				{
					child: postChildren,
					id: 0,
					name: ""
				}
			];
			_postcar("post",postArr,"#logisticsComp","#demo"); 
		};

		var _notReceipt = function(res) {
			if(!isNaN(parseInt(res.initTimeOfTimeOut))) {
				_countDown($(".not_receipt>.timer_d>span")[0], parseInt(res.initTimeOfTimeOut), function() {
					// 倒计时结束？
				});
			}

			// TODO: 物流信息
			var logname = !isNorU(res.logname)?res.logname:"";
			var lognum = !isNorU(res.lognum)?res.lognum:"";
			$(".wait_receipt>.express_d>span")[0].innerHTML = logname;
			$(".wait_receipt>.logistics>span")[0].innerHTML = lognum;
			

			$("button[value=changeLogistics]").on("click", function() {
				$(".popInputLogistics").removeClass("hide");
				_htmlScrollPok();

				if(logiListener) {
					clearInterval(logiListener);
				}
				var logiListener = setInterval(function() {
					var logiComp = $("input[name=logiComp]")[0].value;
					var logiNum = $("input[name=logiNum]")[0].value;

					if(!isNorU(logiComp) && !isNorU(logiNum)) {
						$("button[value=logisticsNum]").addClass("active_btn");
					}
					else {
						$("button[value=logisticsNum]").removeClass("active_btn");
					}
				}, 500);

				// 物流信息提交
				$("button[value=logisticsNum]").on("click", function() {
					var logiComp = $("input[name=logiComp]")[0].value;
					var logiNum = $("input[name=logiNum]")[0].value;
					_post4logistics(logiComp, logiNum, function() {
						clearInterval(logiListener);
					})
				});
			})
			// TODO: 快递插件
			var postArr = [
				{
					child: postChildren,
					id: 0,
					name: ""
				}
			];
			_postcar("post",postArr,"#logisticsComp","#demo"); 
		};

		// public function
		var _htmlScrollOk = function() {
			var htmlTop = parseFloat($('html').css("top"));
			$('html').css({overflow: "auto", position: "absolute", top: "0px"});
			$('body').scrollTop(Math.abs(htmlTop));
		};
		var _htmlScrollPok = function() {
			var scrollTop = document.body.scrollTop;
			$('html').css({overflow: "hidden", position: "fixed", top: -scrollTop+"px"});
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
					// console.log(res);
					
					if(typeof (res.userId)!='undefined') {
						func.fwh_authorize(res.userId);
					}
					
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
		var _getProid = function(name) {
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r!=null) {
				return unescape(r[2]);
			}else {
				return null;
			};
		};
		var isNorU = function(str){
			if(str == undefined || str == null || str == ""){
				return true;
			}else{
				return false;
			}
		};
		var loading = {
			show: function(key) {
				var boxEl = document.createElement('div');
				var imgEl = document.createElement('img');
				boxEl.appendChild(imgEl);
				boxEl.id = 'loading_' + key;
				boxEl.className = 'loading';
				imgEl.src = './../images/loading_0.gif';
				document.body.appendChild(boxEl);
			},
			hide: function(key) {
				var boxEl = document.getElementById('loading_' + key);
				if(boxEl) {
					document.body.removeChild(boxEl);
				}
			},
		};
		var _countDown = function(el, time, cb) {
			if(timer) {
				clearInterval(timer);
			}
			var timer = setInterval(function() {
				var dTime = parseInt(time/24/3600000);
				var hTime = parseInt((time-dTime*24*3600000)/3600000);
				var mTime = parseInt((time-dTime*24*3600000-hTime*3600000)/60000);
				var sTime = parseInt((time-dTime*24*3600000-hTime*3600000-mTime*60000+1000)/1000);

				var strD = dTime<10?("0"+dTime):dTime;
				var strH = hTime<10?("0"+hTime):hTime;
				var strM = mTime<10?("0"+mTime):mTime;
				var strS = sTime<10?("0"+sTime):sTime;

				el.innerHTML = "还剩 " + strD + "天" + strH + "时" + strM + "分" + strS + "秒";

				time-=1000;
				if(time < 0) {
					clearInterval(timer);
					el.innerHTML = "还剩 " + "00天" + "00时" + "00分" + "00秒";
					cb();
				}
			}, 1000);
		};
		var _date = function (format, timestamp) {
			/** 
			* 和PHP一样的时间戳格式化函数 
			* @param {string} format 格式 
			* @param {int} timestamp 要格式化的时间 默认为当前时间 
			* @return {string}   格式化的时间字符串 
			*/
		    var a, jsdate = ((timestamp) ? new Date(timestamp * 1000) : new Date());
		    var pad = function(n, c) {
		        if ((n = n + "").length < c) {
		            return new Array(++c - n.length).join("0") + n;
		        } else {
		            return n;
		        }
		    };
		    var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		    var txt_ordin = {
		        1 : "st",
		        2 : "nd",
		        3 : "rd",
		        21 : "st",
		        22 : "nd",
		        23 : "rd",
		        31 : "st"
		    };
		    var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		    var f = {
		        // Day 
		        d: function() {
		            return pad(f.j(), 2)
		        },
		        D: function() {
		            return f.l().substr(0, 3)
		        },
		        j: function() {
		            return jsdate.getDate()
		        },
		        l: function() {
		            return txt_weekdays[f.w()]
		        },
		        N: function() {
		            return f.w() + 1
		        },
		        S: function() {
		            return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'
		        },
		        w: function() {
		            return jsdate.getDay()
		        },
		        z: function() {
		            return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0
		        },

		        // Week 
		        W: function() {
		            var a = f.z(),
		            b = 364 + f.L() - a;
		            var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
		            if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
		                return 1;
		            } else {
		                if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
		                    nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
		                    return date("W", Math.round(nd2.getTime() / 1000));
		                } else {
		                    return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
		                }
		            }
		        },

		        // Month 
		        F: function() {
		            return txt_months[f.n()]
		        },
		        m: function() {
		            return pad(f.n(), 2)
		        },
		        M: function() {
		            return f.F().substr(0, 3)
		        },
		        n: function() {
		            return jsdate.getMonth() + 1
		        },
		        t: function() {
		            var n;
		            if ((n = jsdate.getMonth() + 1) == 2) {
		                return 28 + f.L();
		            } else {
		                if (n & 1 && n < 8 || !(n & 1) && n > 7) {
		                    return 31;
		                } else {
		                    return 30;
		                }
		            }
		        },

		        // Year 
		        L: function() {
		            var y = f.Y();
		            return (! (y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0
		        },
		        //o not supported yet 
		        Y: function() {
		            return jsdate.getFullYear()
		        },
		        y: function() {
		            return (jsdate.getFullYear() + "").slice(2)
		        },

		        // Time 
		        a: function() {
		            return jsdate.getHours() > 11 ? "pm": "am"
		        },
		        A: function() {
		            return f.a().toUpperCase()
		        },
		        B: function() {
		            // peter paul koch: 
		            var off = (jsdate.getTimezoneOffset() + 60) * 60;
		            var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
		            var beat = Math.floor(theSeconds / 86.4);
		            if (beat > 1000) beat -= 1000;
		            if (beat < 0) beat += 1000;
		            if ((String(beat)).length == 1) beat = "00" + beat;
		            if ((String(beat)).length == 2) beat = "0" + beat;
		            return beat;
		        },
		        g: function() {
		            return jsdate.getHours() % 12 || 12
		        },
		        G: function() {
		            return jsdate.getHours()
		        },
		        h: function() {
		            return pad(f.g(), 2)
		        },
		        H: function() {
		            return pad(jsdate.getHours(), 2)
		        },
		        i: function() {
		            return pad(jsdate.getMinutes(), 2)
		        },
		        s: function() {
		            return pad(jsdate.getSeconds(), 2)
		        },
		        //u not supported yet 
		        // Timezone 
		        //e not supported yet 
		        //I not supported yet 
		        O: function() {
		            var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
		            if (jsdate.getTimezoneOffset() > 0) t = "-" + t;
		            else t = "+" + t;
		            return t;
		        },
		        P: function() {
		            var O = f.O();
		            return (O.substr(0, 3) + ":" + O.substr(3, 2))
		        },
		        //T not supported yet 
		        //Z not supported yet 
		        // Full Date/Time 
		        c: function() {
		            return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()
		        },
		        //r not supported yet 
		        U: function() {
		            return Math.round(jsdate.getTime() / 1000)
		        }
		    };

		    var forReg = /([\])?([a-zA-Z])/g;
		    return format.replace(forReg, function(t, s) {
		        if( t!=s ){ 
				    // escaped 
				    ret = s; 
				} else if (f[s]) {
		            // a date function exists 
		            ret = f[s]();
		        } else {
		            // nothing special 
		            ret = s;
		        }
		        return ret;
		    });
		};
		var _imgsize = function(src,size){
			if((src).indexOf('ngsimage')==-1){
				var imgsrc=(src);
				return imgsrc;
			}else{
				var oss_img='';
				var src_oss=(src).split(".");
				src_oss.splice(src_oss.length-1,1);
				var left_ossimg=src_oss.join('.');
				var srclast_oss=src.split('.');
				srclast_oss=srclast_oss[srclast_oss.length-1];
				var a_oss=srclast_oss.split("jpg").length
				var c_oss=srclast_oss.split("png").length
				var e_oss=srclast_oss.split("jpeg").length
				var g_oss=srclast_oss.split("JPG").length
				var i_oss=srclast_oss.split("PNG").length
				var k_oss=srclast_oss.split("JPEG").length
				var o_oss=srclast_oss.split("gif").length
				var m_oss=srclast_oss.split("GIF").length
				if(a_oss>1){
					oss_img=left_ossimg+'.jpg'
				}else if(c_oss>1){
					oss_img=left_ossimg+'.png'
				}else if(e_oss>1){
					oss_img=left_ossimg+'.jpeg'
				}else if(g_oss>1){
					oss_img=left_ossimg+'.JPG'
				}else if(i_oss>1){
					oss_img=left_ossimg+'.PNG'
				}else if(k_oss>1){
					oss_img=left_ossimg+'.JPEG'
				}else if(o_oss>1){
					oss_img=left_ossimg+'.gif'
				}else if(m_oss>1){
					oss_img=left_ossimg+'.GIF'
				}else{
					oss_img=(src);
				}
				var imgsrc=oss_img.replace("oss-","img-");
				imgsrc=imgsrc+size;
			    return imgsrc;
			}
		};
		var _getStyle = function(obj, attr){
		    if(obj.currentStyle) {
		        return obj.currentStyle[attr];
		    }
		    else
		    {
		        return getComputedStyle(obj, false)[attr];
		    }
		};
		var func = {
			fwh_authorize: function(userId) {
				if((typeof userId=='undefined') || (!userId)){
				    window.location.href = "/yich/PhoneClickWechatButton";
				}
			},
		};

		return self;
	};
})(Zepto);