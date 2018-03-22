(function($) {
	$.fn.CustomerServiceR = function() {
		var self = this.CustomerServiceR;

		// cache
		var objCache = {};
		var orderId = "";
		var state = "";

		// 
		var maxNum = 4;
		var index = 0;
		var files = [];
		var maxSize = 5;
		var imgList = [];

		// maxRefund
		this.maxRefund;

		// postTypes
		var postChildren = [
			{
				id: 0,
				name: "顺丰快递",
			},
			{
				id: 1,
				name: "天天快递",
			},
			{
				id: 2,
				name: "申通快递",
			},
			{
				id: 3,
				name: "韵达快递",
			},
			{
				id: 4,
				name: "圆通快递",
			},
			{
				id: 5,
				name: "汇通快递",
			},
			{
				id: 6,
				name: "EMS邮政快递",
			},
			{
				id: 7,
				name: "中通快递",
			},
			{
				id: 8,
				name: "宅急送",
			},
			{
				id: 9,
				name: "国通快递",
			},
			{
				id: 10,
				name: "快捷快递",
			},
			{
				id: 11,
				name: "龙邦快递",
			},
			{
				id: 12,
				name: "其他快递",
			}
		];

		self.init = function(obj) {
			console.log("CustomerServiceR");

			// 获取 orderId，（即子单编号）
			orderId = _getProid("orderId");

			// haha,初始状态判断
			_post4Status();
		};

		var _post4Status = function() {
			var url = "/yich/PhoneApplyRefundServlet";
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
				if(!isNorU(res.ret_order_state)) {
					var retState = res.ret_order_state;
					// retState = "L";
					if("N" == retState) {
						// 解放提交申请页面
						$(".apply_area").removeClass("hide");

						// handle
						_doFillandSubmit(res);
					}
					else if(retState == "Y" || retState == "L" || retState == "S" || retState == "E" || retState == "F" || retState == "T" || retState == "CP") {
						// 解放售后状态页面
						$(".status_area").removeClass("hide");
						switch(retState) {
							case "Y": {  // 申请退货
								_setStatus($(".wait_d"));
								_apply4ReturnGoods(res);
								break;
							}
							case "L": {  // 拒绝申请
								var changeState = _getProid("changeState");
								if(!isNorU(changeState) && changeState=="R") {
									// 解放提交申请页面
									$(".apply_area").removeClass("hide");
									
									// 关闭售后状态页面
									$(".status_area").addClass("hide");

									// handle
									_doFillandSubmit(res);
								}
								else {
									_setStatus($(".refuse_d"));
									_refuseApply(res);
								}
								break;
							}
							case "S": {  // 退单物流单号已经填写
								_setStatus($(".wait_receipt"));
								_waitReceipt(res);

								// TODO: 快递插件
								var postArr = [
									{
										child: postChildren,
										id: 0,
										name: ""
									}
								];
								_postcar("post",postArr,"#logisticsComp","#demo"); 
								break;
							}
							case "E": {  // 物流单号填错了
								_setStatus($(".not_receipt"));
								_notReceipt(res);

								// TODO: 快递插件
								var postArr = [
									{
										child: postChildren,
										id: 0,
										name: ""
									}
								];
								_postcar("post",postArr,"#logisticsComp","#demo"); 
								break;
							}
							case "F": {  // 申请成功，退货中
								_setStatus($(".agree_d"));
								_agreeReturnG(res);

								// TODO: 快递插件
								var postArr = [
									{
										child: postChildren,
										id: 0,
										name: ""
									}
								];
								_postcar("post",postArr,"#logisticsComp","#demo"); 
								break;
							}
							case "T": {  // 退货完成
								_setStatus($(".ok_d"));
								_returnOk(res);
								break;
							}
							case "CP": {  // 换货完成，申请退货
								// 解放提交申请页面
								$(".apply_area").removeClass("hide");

								// handle
								_doFillandSubmit(res);
								break;
							}
							default: {
								break;
							}
						}

						// goods_info
						if(res.ApplicationNote) {
							var note = res.ApplicationNote;
							
							var wh={
								w:parseInt(parseFloat(_getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
								h:parseInt(parseFloat(_getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
							};
							var whe="@"+wh.w+"w_"+wh.h+"h";
							var iconSrc = !isNorU(note.picture)?_imgsize(note.picture, whe):"./../images/icon_0.jpg";
							$(".status_area .goods_icon>img")[0].src = iconSrc;  // 商品图片

							var title = !isNorU(note.title)?note.title:"";
							$(".status_area .goods_name>p")[0].innerHTML = title;  // 商品名

							var sku = !isNorU(note.sku_properties_name)?note.sku_properties_name:"";
							$(".status_area .goods_name>span")[0].innerHTML = sku;  // sku

							var price = !isNorU(note.price)?note.price:"0.00";
							var tra_amount = !isNaN(parseInt(note.tra_amount))?note.tra_amount:"0";
							$(".status_area .goods_price>p")[0].innerHTML = "￥" + price;  // 商品单价
							$(".status_area .goods_price>span")[0].innerHTML = "×" + tra_amount;  // 购买数量

							var ret_rea = !isNorU(note.ret_rea)?note.ret_rea:"无";
							$(".reason_s")[0].innerHTML = ret_rea;  // 申请原因

							var ref_total_price = !isNorU(note.ref_total_price)?note.ref_total_price:"0.00";
							$(".refund_s")[0].innerHTML = "￥" + ref_total_price;  // 退款金额

							var ret_explain = !isNorU(note.ret_explain)?note.ret_explain:"无";
							$(".instruct_s")[0].innerHTML = ret_explain;  // 申请说明

							var oper_time = !isNorU(note.oper_time)?note.oper_time.split(".")[0]:"";
							$(".time_s")[0].innerHTML = oper_time;  // 申请时间

							// TODO: 凭证
							_handleMap(res.listMaps, res.mapProof);
						}

						// supplierShops
						if(res.ApplicationNote) {
							var ApplicationNote = res.ApplicationNote;

							var name = !isNorU(ApplicationNote.supshop_name)?ApplicationNote.supshop_name:"";
							$(".name_s")[0].innerHTML = name;  // 仓储名称

							var tel = !isNorU(ApplicationNote.mobile)?ApplicationNote.mobile:!isNorU(ApplicationNote.tel)?ApplicationNote.tel:"无";
							$(".tel_s")[0].innerHTML = tel;  // 联系手机

							var landline_tel = !isNorU(ApplicationNote.landline_tel)?ApplicationNote.landline_tel:"无";
							$(".mobile_s")[0].innerHTML = landline_tel;  // 联系座机
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
					else if(retState == "H" || retState == "A" || retState == "D" || retState == "CP" || retState == "CL") {
						// TODO: 是否跳转换货界面？
						if(retState == "D") {
							var changeState = _getProid("changeState");
							if(!isNorU(changeState) && changeState=="R") {
								// 解放提交申请页面
								$(".apply_area").removeClass("hide");

								// handle
								_doFillandSubmit(res);
							}
							else {
								window.location.href = '/yich/wapservice/dist/html/customerservice_c.html?orderId=' + orderId;
							}
						}
						else {
							window.location.href = '/yich/wapservice/dist/html/customerservice_c.html?orderId=' + orderId;
						}
					}
					else {
						// TODO: 是否跳转404？
						return;
					}
				}
			} 
		};

		// 显示退货记录
		var _post4ReturnRecord = function() {
			var url = "/yich/PhoneAfterSalesRecord";
			var params = {
				orderId: orderId,
			};
			var template = {};
			_Ajax(url, params, template, "post", function(res) {
				if(res) {
					// 退货记录
					_handleReturnRecord(res.listMaps, res.mapProof);
				}
			});
		};
		var _handleReturnRecord = function(listMaps, mapProof) {
			var arrMap = [];
			if(listMaps && listMaps.length>0 && mapProof && mapProof.length>0) {
				listMaps.forEach(function(item, index) {
					arrMap.push($.extend(true, item, mapProof[index]));
				});

				if(arrMap.length > 0) {
					$(".returnRecord>ul")[0].innerHTML = "";
					arrMap.forEach(function(item, index) {
						var head = !isNorU(item.head)?item.head:"./../images/icon_0.jpg";
						var userName = !isNorU(item.userName)?item.userName:"";
						var sendTime = !isNorU(item.sendTime)?item.sendTime:"";
						var message = !isNorU(item.message)?item.message:"";
						var retExplain = !isNorU(item.retExplain)?item.retExplain:"";

						var strHtml = '\
							<li>\
								<div class="re_name clearfix"><span><img src=' + head + ' alt="0"></span><div><p>' + userName +'</p><span>' + sendTime +'</span></div></div>\
								<div class="re_message"><p>' + message + '<br>' + retExplain + '</p></div>\
								<div class="re_voucher hide"><label>上传凭证：</label><br><div class="clearfix"></div></div>\
							</li>';
						$(".returnRecord>ul").append(strHtml);

						var srcs = item.proofSrcs?item.proofSrcs[0].split(","):[];
						if(srcs && srcs.length > 0) {
							var wh={
								w:parseInt(parseFloat(_getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
								h:parseInt(parseFloat(_getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
							};
							var whe="@"+wh.w+"w_"+wh.h+"h";
							var arrWheSrc = [];
							srcs.forEach(function(iurl, index) {
								var reg = /\w(\.gif|\.jpeg|\.png|\.jpg|\.bmp)/i;
								if(reg.test(iurl)) {
									arrWheSrc.push(_imgsize(iurl, whe));
								}
							});

							if(arrWheSrc.length > 0) {
								$(".returnRecord>ul>li").eq(index).find(".re_voucher").removeClass("hide");
								
								var k = 0;
								$(".returnRecord>ul>li").eq(index).find(".re_voucher").find("div")[0].innerHTML = "";
								$(".returnRecord>ul>li").eq(index).find(".re_voucher").find("div").append('<ul><li class="clearfix"></li></ul>');
								for(var i = 0; i < arrWheSrc.length; i++) {
									with({b: i}) {
										if((b-k*4) >= 4) {
											k++;
											$(".returnRecord>ul>li").eq(index).find(".re_voucher").find("div").find("ul").append('<li class="clearfix"></li>');
										}

										$(".returnRecord>ul>li").eq(index).find(".re_voucher").find("div").find("ul").find("li").eq(k).append('<span><img name="voucher_img_' + index + "_" + b + '" src=' + arrWheSrc[b] + ' alt=""></span>');
										$("img[name=voucher_img_" + index + "_" + b + "]").on("click", function() {
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


								// for(var i = 0; i < srcs.length; i++) {
								// 	if((i-k*4) >= 4) {
								// 		k++;
								// 		$(".returnRecord>ul>li").eq(index).find(".re_voucher").find("div").find("ul").append('<li></li>');
								// 	}

								// 	$(".returnRecord>ul>li").eq(index).find(".re_voucher").find("div").find("ul").find("li").eq(k).append('<span><img src=' + _imgsize(srcs[i].split(",")[0], whe) + ' alt=""></span>');
								// }
							}
						}
					});
				}
			}
		};

		// 显示凭证
		var _handleMap = function(listMaps, mapProof) {
			var arrMap = [];
			if(listMaps && listMaps.length>0 && mapProof && mapProof.length>0) {
				listMaps.forEach(function(item, index) {
					if("采购商" == item.userShop) {  // TODO:感觉凭证这儿这样做还是有问题，遗留
						arrMap.push($.extend(true, item, mapProof[index]));
					}
				});

				if(arrMap.length > 0) {
					var lastMap = arrMap;
					lastMap.splice(arrMap.length, 1);
					console.log(lastMap);

					var srcs = lastMap[0].proofSrcs?lastMap[0].proofSrcs[0].split(","):[];
					if(srcs && srcs.length > 0) {
						var wh={
							w:parseInt(parseFloat(_getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
							h:parseInt(parseFloat(_getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
						};
						var whe="@"+wh.w+"w_"+wh.h+"h";
						var arrWheSrc = [];
						srcs.forEach(function(iurl, index) {
							var reg = /\w(\.gif|\.jpeg|\.png|\.jpg|\.bmp)/i;
							if(reg.test(iurl)) {
								arrWheSrc.push(_imgsize(iurl, whe));
							}
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
		        			var total_Amount = !isNaN(parseFloat(objCache.ApplicationNote.total_Amount))?parseFloat(objCache.ApplicationNote.total_Amount).toFixed(2):"0.00";  // 不包含运费
		        			$("input[name=refund]")[0].value = total_Amount;
		        			self.maxRefund = total_Amount;
		        		}
		        	}
		        	else {
		        		if(objCache && objCache.ApplicationNote) {
		        			var payment = !isNaN(parseFloat(objCache.ApplicationNote.payment))?parseFloat(objCache.ApplicationNote.payment).toFixed(2):"0.00";  // 包含运费
		        			$("input[name=refund]")[0].value = payment;
		        			self.maxRefund = payment;
		        		}
		        	}

		        	popChooseObj.close();
		        });
			};
			$(".reason").on("click", click2ShowPop);
			self.maxRefund = !isNaN(parseFloat(objCache.ApplicationNote.payment))?parseFloat(objCache.ApplicationNote.payment).toFixed(2):"0.00";

			/**
			 * goods_info
			 * @param  {[type]} res.ApplicationNote [description]
			 * @return {[type]}                     [description]
			 */
			if(res.ApplicationNote) {
				var note = res.ApplicationNote;

				var wh={
					w:parseInt(parseFloat(_getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
					h:parseInt(parseFloat(_getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
				};
				var whe="@"+wh.w+"w_"+wh.h+"h";
				var iconSrc = !isNorU(note.picture)?_imgsize(note.picture, whe):"./../images/icon_0.jpg";
				$(".goods_icon>img")[0].src = iconSrc;  // 商品图片

				var title = !isNorU(note.title)?note.title:"";
				$(".goods_name>p")[0].innerHTML = title;  // 商品名

				var sku = !isNorU(note.sku_properties_name)?note.sku_properties_name:"";
				$(".goods_name>span")[0].innerHTML = sku;  // sku

				var price = !isNorU(note.price)?note.price:"0.00";
				var tra_amount = !isNaN(parseInt(note.tra_amount))?note.tra_amount:"0";
				$(".goods_price>p")[0].innerHTML = "￥" + price;  // 商品单价
				$(".goods_price>span")[0].innerHTML = "×" + tra_amount;  // 购买数量

				var payment = !isNaN(parseFloat(note.payment))?parseFloat(note.payment).toFixed(2):"0.00";
				var total_Amount = !isNaN(parseFloat(note.total_Amount))?parseFloat(note.total_Amount).toFixed(2):"0.00";
				$(".maxRefund")[0].innerHTML = payment;  // 最多金额
				$(".freight")[0].innerHTML = parseFloat(payment-total_Amount).toFixed(2);  // 含运费
			}

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
			 * [description]
			 * @param  {[type]} e) {             				var maxRefund [description]
			 * @return {[type]}    [description]
			 */
			$(".refund_input>input").on("paste", function(e) {  // 退款金额：限制只能输入数字和小数点
				var maxRefund = self.maxRefund;
				if(e.data) {
					var value = e.currentTarget.value;
					var strValue = value.substring(0,value.length-1) + e.data.replace(/[^\d.]/g,'');
					if(isNaN(strValue)) {
						strValue = value.substring(0,value.length-1);
					}
					else if(parseFloat(strValue) >= parseFloat(maxRefund)) {
						strValue = maxRefund;
					}
					e.currentTarget.value = strValue;
				}
				else {
					// do nothing
				}
			});
			$('.refund_input>input').bind('input propertychange',function(){
				var maxRefund = self.maxRefund;
				if(parseFloat($(this).val())>parseFloat(maxRefund)){
					$(this).val(maxRefund);
				}
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
				var returnMoney = $(".refund_input>input")[0].value;
				var srcImage = "";
				imgList.forEach(function(item, index) {
					srcImage += (item.src) + ",";
				});
				if(!isNorU(retRea)) {
					var url = "/yich/PhonePendingExamine";
					var params = {
						s_text: retRea,
						t_text: retExplain,
						return_money: returnMoney,
						src: srcImage,
						orderId: orderId,
					};
					var template = {};
					_Ajax(url, params, template, "post", function(res) {
						if(res) {
							if(!isNaN(parseInt(res.result)) && parseInt(res.result) >= 0) {
								window.location.href = '/yich/wapservice/dist/html/customerservice_r.html?orderId=' + orderId;
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
			if(!isNaN(parseInt(res.initTimeOfTimeOut))) {
				_countDown($(".wait_d>.timer_d>span")[0], parseInt(res.initTimeOfTimeOut), function() {
					// 倒计时结束？
				});
			}

			$("button[value=withdrawn]").on("click", function() {
				_withDrawn();
			});
		};
		var _withDrawn = function() {
			var parentId = "app";
			var tips = "撤销后，申请将自动关闭，确定吗？"
		    var popConfirmObj = new PopConfirm();
		    popConfirmObj.init(parentId, tips, function() {
		    	// after click ok callback
		    	var url = "/yich/PhoneRetuenGoodsClose";
				var params = {
					orderId: orderId,
					cancelOrClose: "cancel",
					enter: "N",
				};
				var template = {};
				_Ajax(url, params, template, "post", function(res) {
					// _drawPage(res);
					console.log(res);
					if(res) {
						if(!isNaN(parseInt(res.result))) {
							if(parseInt(res.result) >= 7) {
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
			if(!isNaN(parseInt(res.initTimeOfTimeOut))) {
				_countDown($(".refuse_d>.timer_d>span")[0], parseInt(res.initTimeOfTimeOut), function() {
					// 倒计时结束？
				});
			}

			var refuseInfo = !isNorU(res.refRea)?res.refRea:"";
			$(".refuse_d>.tips_d>ul>li")[0].innerHTML = "拒绝理由：" + refuseInfo;

			$("button[value=exchangeG]").on("click", function() {
				console.log("换货");
				
				var url = "/yich/PhoneUReturningChange";
				var params = {
					orderId: orderId,
				};
				var template = {};
				_Ajax(url, params, template, "post", function(res) {
					if(res) {
						window.location.href = '/yich/wapservice/dist/html/customerservice_c.html?orderId=' + orderId + '&changeState=C';
					}
				});
			});

			$("button[value=arbitrate]").on("click", function() {
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
			    	var url = "/yich/PhoneRetuenGoodsClose";
					var params = {
						orderId: orderId,
						cancelOrClose: "cancel",
						enter: "N",
					};
					var template = {};
					_Ajax(url, params, template, "post", function(res) {
						// _drawPage(res);
						console.log(res);
						if(res) {
							if(!isNaN(parseInt(res.result))) {
								if(parseInt(res.result) >= 7) {
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
				var url = "/yich/PhoneRefusedReturnModifyClickAgree";
				var params = {
					orderId: orderId,
					enter: "N",
				};
				var template = {};
				_Ajax(url, params, template, "post", function(res) {
					// _drawPage(res);
					console.log(res);
					window.location.href = '/yich/wapservice/dist/html/customerservice_r.html?orderId=' + orderId + '&changeState=R';
				});
			});
		};

		var _agreeReturnG = function(res) {
			// address
			// if(res.address) {
			// 	var address = res.address;

			// 	var name = !isNorU(address.name)?address.name:"";
			// 	$(".recipients>p").eq(0).find("strong")[0].innerHTML = name;  // 仓储名称

			// 	var tel = !isNorU(address.tel)?address.tel:"";
			// 	$(".recipients>p").eq(0).find("b")[0].innerHTML = tel;  // 联系座机

			// 	var strAddress = !isNorU(address.address)?address.address:"";
			// 	$(".recipients>p").eq(1).find("span")[0].innerHTML = strAddress;  // 退货地址
			// }
			
			// ApplicationNote
			if(res.ApplicationNote) {
				var note = res.ApplicationNote;
				var ret_add = !isNorU(note.ret_add)?note.ret_add:",";
				var strAddress = !isNorU(ret_add.split(",")[0])?ret_add.split(",")[0]:"";
				var explain = ret_add.split(",").splice(1, ret_add.split(",").length).join(" ");
				$(".recipients>p").eq(1).find("span")[0].innerHTML = strAddress;  // 退货地址
				$(".recipients>p").eq(2).find("span")[0].innerHTML = explain;  // 说明
			}

			// countdown
			if(!isNaN(parseInt(res.initTimeOfTimeOut))) {
				_countDown($(".agree_d>.timer_d>span")[0], parseInt(res.initTimeOfTimeOut), function() {
					// 倒计时结束？
				});
			}

			// 填写物流信息
			$("button[value=inputLogistics]").on("click", function() {
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
			});
		};
		var _postcar = function(post,arr,clickId,valueId,index){
			post = new LArea();
			post.init({
			        'trigger': clickId, //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
			        'cityName': valueId,
			        'keys': {
			            id: 'id',
			            name: 'name'
			        }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
			        'type': 1, //数据源类型
			        'data': arr //数据源
			    });
			post.value=[0,0,0];//控制初始位置，注意：该方法并不会影响到input的value
		}
		var _post4logistics = function(logiComp, logiNum, afterSubmitCallback) {
			var url = "/yich/PhoneCommitLogInf";
			var params = {
				orderId: orderId,
				enter: "N",
				lognum: logiNum,
				logname: logiComp,
			};
			var template = {};
			_Ajax(url, params, template, "post", function(res) {
				if(res) {
					$(".popInputLogistics").addClass("hide");
					_htmlScrollOk();
					afterSubmitCallback();
					_setStatus($(".wait_receipt"));
					_waitReceipt(res);
				}
			});
		};
		var _post4ChangeLogistics = function(logiComp, logiNum, afterSubmitCallback) {
			var url = "/yich/PhoneModifyLogisticsServlet";
			var params = {
				ret_id: objCache.ret_id,
				lognum: logiNum,
				logname: logiComp,
			};
			var template = {};
			_Ajax(url, params, template, "post", function(res) {
				if(res) {
					if("YES" == res.message) {
						$(".popInputLogistics").addClass("hide");
						_htmlScrollOk();
						afterSubmitCallback();
						_setStatus($(".wait_receipt"));
						_waitReceipt(res);
					}
					else {
						alert("修改失败！");
					}
				}
			});
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
					_post4ChangeLogistics(logiComp, logiNum, function() {
						clearInterval(logiListener);
					})
				});
			})
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
					_post4ChangeLogistics(logiComp, logiNum, function() {
						clearInterval(logiListener);
					})
				});
			})
		};

		var _returnOk = function(res) {
			// 填退货完成信息
			var ref_total_price = !isNorU(res.ApplicationNote.ref_total_price)?res.ApplicationNote.ref_total_price:"0.00";
			$(".ok_d>.timer_d>span")[0].innerHTML = "退款金额：" + ref_total_price + "元";
			
			// TODO: 物流信息
			var logname = !isNorU(res.logname)?res.logname:"";
			var lognum = !isNorU(res.lognum)?res.lognum:"";
			$(".ok_d>.express_d>span")[0].innerHTML = logname;
			$(".ok_d>.logistics>span")[0].innerHTML = lognum;
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