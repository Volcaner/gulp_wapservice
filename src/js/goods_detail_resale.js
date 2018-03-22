(function ($) {
	$.fn.GoodsDetailPage = function() {
		var self = this.GoodsDetailPage;

		var proid = null;
		var count = 0;
		var libCount = 0;
		var supid = '';
		var salePrice  = {};
		var userid = '';
		var wechatUrl = '';

		self.init = function(obj){
			// console.log(obj);

			// obligate for judge
			// if show?
			// if clear?
			// if dispose?
			// if update?
			// if active?

			// data cache
			var goodsDataCache = null;

			// proid
			proid = func.getReg("proId");

			// userid
			userid = func.getReg("userId");

			// dispose
			_dispose();

			// get supid
			supid =  func.getReg('supId');

			// post for data by ajax,and init
			_post4GoodsData(function(res){
				_afterPostOk(res, function(res) {
					_drawPage(res);
				});
			}, function(res) {
				_afterPostPok(res, function() {
					// do nothing
				});
			});

			// place order 下单
			// $('.recordok_btn>input[name="place-btn"]')[0].addEventListener('click', _clickPlaceOrder, false);
			$('.place_btn')[0].addEventListener('click', function() {
				$('.place_order').removeClass('hide');
				_htmlScrollPok();
			});

			// hide place order
			$('.place_order')[0].addEventListener('click', function(e) {
				if($('.place_order')[0] == e.target){
					$('.place_order').addClass('hide');
					_htmlScrollOk();
				}
			});
			$(".pHeader i")[0].addEventListener('click', function(e) {
				$('.place_order').addClass('hide');
				_htmlScrollOk();
			});

			// show choose type: detail-info 查看规格和价格
			$('.detail-info')[0].addEventListener('click', function() {
				$('.place_order').removeClass('hide');
				_htmlScrollPok();
			}, false);

			// show specification 产品参数
			$('.specification')[0].addEventListener('click', function() {
				$('div.product_params').removeClass('hide');
				_htmlScrollPok();
			}, false);

			// hide specification 
			$('div.product_params')[0].addEventListener('click', function(e) {
				if($('div.product_params')[0] == e.target) {
					$('div.product_params').addClass('hide');
					_htmlScrollOk();
				}
			}, false);

			// 查看规格和价格  产品参数 返回
			// $('input[name="choFooter-btn"]')[0].addEventListener('click', function() {
			// 	$('div.chooseType').addClass('hide');
			// 	_htmlScrollOk();
			// }, false);
			$('input[name="paFooter-btn"]')[0].addEventListener('click', function() {
				$('div.product_params').addClass('hide');
				_htmlScrollOk();
			}, false);

			// to top
			window.addEventListener("scroll", _scrollEvent, false);

			// 监听window.resize
			window.addEventListener("resize", function() {
				 window.location.reload();
			}, false);
		};

		var _htmlScrollOk = function() {
			var htmlTop = parseFloat($('html').css("top"));
			$('html').css({overflow: "auto", position: "absolute", top: "0px"});
			$('body').scrollTop(Math.abs(htmlTop));
		};
		var _htmlScrollPok = function() {
			var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
			$('html').css({overflow: "hidden", position: "fixed", top: -scrollTop+"px"});
		};

		var _scrollEvent = function(e) {
			var WindowHeight = document.body.offsetHeight;
			var scrollTop = document.body.scrollTop;
			if(scrollTop >= WindowHeight*2) {
				$('.return_top').removeClass('hide');
			}
			else {
				$('.return_top').addClass('hide');
			}
		};

		var _post4GoodsData = function(oAfterPostOkCallback) {
			$.ajax({
				type: 'get',
				url: '/yich/PhoneResaleGoodInfoServlet',
				dataType: 'json',
				data: {
					"proid": proid,
					"userId": userid,
				},
				success: function(res) {
					if(typeof (res.userId)!='undefined') {
						func.fwh_authorize(res.userId);
					}

					oAfterPostOkCallback(res);
				},
				error: function(res) {
					console.log(res);
				}
			});
		};
		var _afterPostOk = function(res, oNextEventCallback) {
			oNextEventCallback(res);
		};
		var _afterPostPok = function(res, oNextEventCallback) {
			console.log(res);
		};
		var _drawPage = function(res) {
			if(res) {
				if(typeof(res.product) === "object"){  // 商品是否移除？
					// cache
					goodsDataCache = res;

					// wechatUrl
					wechatUrl = res.url;

					// update layout
					if(goodsDataCache.product){
						// supid
						supid = goodsDataCache.product.supshop_id;

						var pro_name = goodsDataCache.product.pro_name;
						if(!isNullorUndefined(pro_name)){
							$('#details>div.theme>span')[0].innerHTML = pro_name;  // theme

							// $('#chooseType>div.choHeader>div.goodsInfo>h5')[0].innerHTML = pro_name;  // theme
						}

						// 商品参数
						var _getAttribute = function(afterGetAttributeCallback) {
							var lstAttribute = [];
							var brand = goodsDataCache.product.brand;
							if(!isNullorUndefined(brand)) {
								lstAttribute.push({key: "品牌", value: brand});
							}
							var weight = goodsDataCache.product.weight;
							if(!isNullorUndefined(weight) && parseFloat(weight)!=0) {
								lstAttribute.push({key: "毛重", value: weight + "克"});
							}
							var volume = goodsDataCache.product.volume;
							if(!isNullorUndefined(volume)) {
								lstAttribute.push({key: "体积", value: volume + "m³"});
							}
							var sell_code = goodsDataCache.product.sell_code;
							if(!isNullorUndefined(sell_code)) {
								lstAttribute.push({key: "货号", value: sell_code});
							}
							var attribute = goodsDataCache.product.attribute;
							if(!isNullorUndefined(attribute)) {
								var array = attribute.split(";")
								array.splice(array.length-1, 1);
								array.forEach(function(val, index) {
									var item = val.split(":");
									lstAttribute.push({key: item[0], value: item[1]});
								});
							}
							var addAttribute = goodsDataCache.product.add_attribute;
							if(!isNullorUndefined(addAttribute)) {
								var addArray = addAttribute.split(";")
								addArray.splice(addArray.length-1, 1);
								addArray.forEach(function(val, index) {
									var addItem = val.split(":");
									lstAttribute.push({key: addItem[0], value: addItem[1]});
								});
							}
							afterGetAttributeCallback(lstAttribute);
						}

						_getAttribute(function(lstAttribute) {
							if(lstAttribute && lstAttribute.length > 0) {
								lstAttribute.forEach(function(item, index) {
									$('#product_params>div>ul').append('<li class="clearfix"><p>' + item.key + '</p><b>' + item.value + '</b></li>');
								});
							}
						});

						// 是否支持售后
					/*	if("Y" == goodsDataCache.product.customer_service) {
							// do nothing
						}
						else {
							$("body").append('<div class="customer_service"><p>暂不支持售后</p></div>');
						}*/
					}

					var qjj = goodsDataCache.price;
					if(!isNullorUndefined(qjj)){
						qjj = qjj.toString();
						var strQjj = "<b class='priceB'>￥</b>";
						var arr = qjj.split("-");

						arr.forEach(function(val, index) {
							if(isNaN(parseFloat(val))) {
								val = 0;
							}

							var arrItem = parseFloat(val).toFixed(2).split(".");

							if(index == 1) {
								strQjj += "-";
							}

							strQjj += arrItem[0] + ".<b class='priceB'>" + arrItem[1] + '</b>';
						});
						$('#details>div.price>span')[0].innerHTML = strQjj;  // price
						$('.place_order>div.pPrice>.price_show>ul>p')[0].innerHTML = strQjj;  // price
					}
					
					// var srcs = [];
					var srcs = goodsDataCache.srcs;
					if(srcs && srcs.length > 0){  // srcs
						var wh={
							w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
							h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(750)),
						};
						var whe="@"+wh.w+"w_"+wh.h+"h";
						srcs.forEach(function(val, index){
							$('div.swiper-wrapper').append('<div id=' + index + ' class="swiper-slide"><img src="../images/ant_0.png" /></div>');
							var _src=func.imgsize(val,whe);

							var img = new Image();
							img.src = _src;
							img.onload = function(){
								document.querySelector('div.swiper-wrapper').children[index].lastChild.src = img.src;
							}
						});

						// Initialize Swiper
						setTimeout(function(){
							var swiper = new Swiper('.swiper-container', {
							    pagination: '.swiper-pagination',
							    paginationClickable: true,
							    spaceBetween: 30,
							});
						}, 100);
					}

					// update place an order
					if(goodsDataCache.product) {
						var pro_name = goodsDataCache.product.pro_name;
						if(!isNullorUndefined(pro_name)){
							$('.place_order>div.pHeader>div.goodsInfo>h5')[0].innerHTML = pro_name;  // theme
						}

						var good_no = goodsDataCache.product.good_no;
						if(!isNullorUndefined(good_no)){
							$('.place_order>div.pHeader>div.goodsInfo>p.goodnum')[0].innerHTML = good_no;  // good_no
						}

						var shopInvtory = goodsDataCache.product.shopInvtory;
						var salesAll = 0;
						var priceAll = 0;
						var skuPlaceList = {};
						if(shopInvtory && shopInvtory.length > 0){
							// 清空ul
							$(".price_choose>ul").html("");

							shopInvtory.forEach(function(item, index){
								// 价格
								var skuObj = {};
								skuObj.sku_properties = item.sku_properties;
								skuObj.pro_num = item.pro_num;
								skuObj.price = item.price + (item.delegation&&item.delegation.addMoney?item.delegation.addMoney:0);
								skuObj.invId = item.inv_id;

								$(".price_choose>ul").append('<li class="clearfix" pkey=' + index +'>\
									<label class="">' + skuObj.sku_properties + '</label>\
									<div class="num_input">\
										<i class="icon iconfont minus">&#xe61e;</i>\
										<input type="text" name="numSale" placeholder="0" value="0">\
										<i class="icon iconfont plus">&#xe643;</i>\
									</div>\
									<div class="price_count hide">\
										<span>￥<b>0.00</b></span>\
										<span>x<b>0</b></span>\
									</div>\
								</li>');

								// 当前点击的sku
								$(".price_choose>ul>li").eq(index).on("click", function() {
									$(".label_active").removeClass("label_active");
									$(this).find("label").addClass("label_active");
									console.log(skuObj);

									$(".price_show>span").html(skuObj.sku_properties);
									$(".price_show>ul").html("");
									$(".price_show>ul").append('\
										<li>\
											<span>￥' + parseFloat(skuObj.price).toFixed(2) + '</span>\
										</li>');
								});

								if(skuObj.pro_num && item.pro_num > 0) {  // 有库存
									// 控制输入框只能输入数字
									$(".price_choose>ul>li").eq(index).find("input").on("input", function(e) {
										var reg = /[^\d]/g;
										var value = e.currentTarget.value;
										value = value.replace(reg, "");
										value = value&&value!=""?parseInt(value):0;
										value = value>skuObj.pro_num?skuObj.pro_num:value;
										e.currentTarget.value = value;

										_getSkuPrice(value, skuObj.price);
										_setSkuPlaceList(value, skuObj);
									});

									// 数量加减
									$(".price_choose>ul>li").eq(index).find("i.plus").on("click", function() {
										var value = $(".price_choose>ul>li").eq(index).find("input")[0].value;
										value = value&&value!=""?parseInt(value):0;
										value++;
										value = value>skuObj.pro_num?skuObj.pro_num:value;
										$(".price_choose>ul>li").eq(index).find("input")[0].value = value;

										_getSkuPrice(value, skuObj.price);
										_setSkuPlaceList(value, skuObj);
									});
									$(".price_choose>ul>li").eq(index).find("i.minus").on("click", function() {
										var value = $(".price_choose>ul>li").eq(index).find("input")[0].value;
										value = value&&value!=""?parseInt(value):0;
										value--;
										value = value<=0?0:value;
										$(".price_choose>ul>li").eq(index).find("input")[0].value = value;

										_getSkuPrice(value, skuObj.price);
										_setSkuPlaceList(value, skuObj);
									});  
								}
								else {  // 没库存
									$(".price_choose>ul>li").eq(index).find("label").each(function(lindex, el) {
										$(el).addClass("disabled");
									});

									$(".price_choose>ul>li").eq(index).find("i").each(function(lindex, el) {
										$(el).addClass("disabled");
									});

									$(".price_choose>ul>li").eq(index).find("input").each(function(lindex, el) {
										$(el).addClass("disabled");
										$(el).attr("disabled", "disabled");
									});

									$(".price_choose>ul>li").eq(index).find("span").each(function(lindex, el) {
										$(el).addClass("disabled");
									});

									$(".price_choose>ul>li").eq(index).find("b").each(function(lindex, el) {
										$(el).addClass("disabled");
									});
								}
								
								// 计算 sku 价格 和 数量
								function _getSkuPrice(sNum, sPrice) {
									if(sNum && sNum > 0) {
										$($(".price_choose>ul>li").eq(index).find("div.price_count")).removeClass("hide");
										$($(".price_choose>ul>li").eq(index).find("div.price_count span b")[0]).html(sPrice);
										$($(".price_choose>ul>li").eq(index).find("div.price_count span b")[1]).html(sNum);
									}
									else {
										$($(".price_choose>ul>li").eq(index).find("div.price_count")).addClass("hide");
										$($(".price_choose>ul>li").eq(index).find("div.price_count span b")[0]).html("0");
										$($(".price_choose>ul>li").eq(index).find("div.price_count span b")[1]).html("0");
									}

									// get salesAll
									salesAll = 0;
									$(".price_choose").find("input").each(function(iinput, el) {
										salesAll += $(el).val()&&$(el).val()!=""?parseInt($(el).val()):0;
									});

									// get priceAll
									priceAll = 0;
									$(".price_choose").find("li").each(function(liinput, el) {
										var nNum = $($(el).find("input")).val();
										if(nNum && nNum != "" && parseInt(nNum) > 0) {
											var sSkuPrice = $(el).find(".price_count>span>b").eq(0).html();
											priceAll += parseInt(nNum)*parseFloat(sSkuPrice);
										}
									});

									if(salesAll > 0) {
										$(".pFooter>.choosed_num>p>b").html(salesAll);
										$(".pFooter>.choosed_num>p>b").removeClass("disabled");
										$(".pFooter>.count_price>p>span").html(priceAll.toFixed(2));
										$(".pFooter>.count_price>p>span").removeClass("disabled");
										$(".pFooter>.place_button>input").removeClass("bgdisabled");
									}
									else {
										$(".pFooter>.choosed_num>p>b").html(salesAll);
										$(".pFooter>.choosed_num>p>b").addClass("disabled");
										$(".pFooter>.count_price>p>span").html(priceAll.toFixed(2));
										$(".pFooter>.count_price>p>span").addClass("disabled");
										$(".pFooter>.place_button>input").addClass("bgdisabled");
									}
								};

								// 塞 数量 sku 价格
								function _setSkuPlaceList(sNum, skuObj) {
									if(sNum && sNum > 0) {
										skuPlaceList[skuObj.invId] = sNum;
									}
									else {
										for(strInvId in skuPlaceList) {
											if(strInvId == skuObj.invId) {
												delete skuPlaceList[strInvId];
											}
										}
									}
								};
							});

							// post for place
							$("input[name=place_button]").on("click", function() {
								_post4Place();
							});
							function _post4Place() {
								if(_ifMapNull(skuPlaceList)) {
									console.log(skuPlaceList);
									var strSku = "";
									for(key in skuPlaceList) {
										strSku += (key + ":" + skuPlaceList[key] + ";")
									}

									/*
										$.ajax({
											type: 'post',
											url: '/yich/DelegationGetOpenId',
											dataType: 'json',
											data: {
												"proId": proid,
												"userId": userid,
												"str": str,
											},
											success: function(res) {
												console.log(res);
											},
											error: function(res) {
												console.log(res);
											}
										});
									*/
									var str = wechatUrl;
									// str = str.match(/&redirect_uri=(\S*)&response_type=/)[1];  
									
									var regMatch = /&redirect_uri=(\S*)&response_type=/;
									str = str.replace(regMatch, function(match, strUrl) {
										var urlParams = escape("?proId=" + proid + "&userId=" + userid + "&str=" + strSku);
										return "&redirect_uri=" + strUrl + urlParams + "&response_type=";
									});
									console.log(str);

									window.location.href = str;
								}
							};
							function _ifMapNull(map) {
								for(key in map) {
									return true;
								}
								return false;
							};
						}
					}

					var chooseSrcs = goodsDataCache.srcs;
					if(chooseSrcs && chooseSrcs.length > 0){  // chooseSrcs
						var wh = {
							w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(255)),
							h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(255)),
						};
						var whe = "@"+wh.w+"w_"+wh.h+"h";
						var _src = func.imgsize(chooseSrcs[0], whe);

						var img = new Image();
						img.src = _src;
						img.onload = function(){
							// $('#chooseType>div.choHeader>div.goodsPic>img')[0].src = img.src;
							$('.place_order>div.pHeader>div.goodsPic>img')[0].src = img.src;
						}
					}

					// update details_page
					var strHtml = goodsDataCache.html;
					if(!isNullorUndefined(strHtml)){
						$('#details>div.details_page>div.deta_pics').append(strHtml);
					}else{
						$('#details>div.details_page').hide();
					}

					// go share 分享
					$.ajax({
						type:"POST",
					    url:"/yich/WechatShareSevlert",
					    dataType:"json",
						data: JSON.stringify({
							"proId": proid,
            				"thisdata": window.location.href.split('#')[0],
						}),
						success: function(res) {
							if(typeof (res.userId)!='undefined') {
								func.fwh_authorize(res.userId);
							}
							
							if(res) {
								wx.config({
									debug: false,
									appId: res.appId,
									timestamp: res.timestamp,
									nonceStr: res.noncestr,
									signature: res.signature,
									jsApiList: [
										'onMenuShareTimeline',
										'onMenuShareAppMessage'
									]
							    });

								var wh = {
									w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(255)),
									h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(255)),
								};
								var whe = "@"+wh.w+"w_"+wh.h+"h";
							    wx.ready(function() {
							    	// 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口 
							    	wx.onMenuShareAppMessage({
							    		title: !isNullorUndefined(goodsDataCache.product.pro_name)?goodsDataCache.product.pro_name:'',
							    		desc: !isNullorUndefined(goodsDataCache.product.pro_name)?goodsDataCache.product.pro_name:'',
							    		link: window.location.href,
							    		imgUrl: goodsDataCache.srcs && goodsDataCache.srcs.length > 0 ? func.imgsize(goodsDataCache.srcs[0], whe) : '',
							    		trigger: function (res) {
											// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
											// alert('用户点击发送给朋友');
										},
										success: function (res) {
											// alert('已分享');
										},
										cancel: function (res) {
											// alert('已取消');
										},
										fail: function (res) {
											// alert(JSON.stringify(res));
										}
							    	});

							    	// 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
							    	wx.onMenuShareTimeline({
							    		title: !isNullorUndefined(goodsDataCache.product.pro_name)?goodsDataCache.product.pro_name:'',
							    		link: window.location.href,
							    		imgUrl: goodsDataCache.srcs && goodsDataCache.srcs.length > 0 ? func.imgsize(goodsDataCache.srcs[0], whe) : '',
							    		trigger: function (res) {
											// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
											// alert('用户点击发送给朋友');
										},
										success: function (res) {
											// alert('已分享');
										},
										cancel: function (res) {
											// alert('已取消');
										},
										fail: function (res) {
											// alert(JSON.stringify(res));
										}
							    	});

							    });

							    wx.error(function(res){
						    	 	// alert("失败wuwu!");
						    	 	console.log(res)
						    	    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
						    	});
							}
						},
						error: function(res) {
							console.log(res);
						}
					});

					// pageloading
					setTimeout(function() {
				        if ($("#pageloading").length > 0) {
				            $("#pageloading").remove();
				        }
				    }, 500);
				}
				else if(res.error) {
					if("pcount" == res.error) {
						window.location.href = "/yich/wap/src/html/cuowu.html";
					}
					else if("dcount" == res.error) {
						window.location.href = "/yich/wap/src/html/cuowu.html";
					}
					else if("ccount" == res.error) {
						window.location.href = "/yich/wap/src/html/cuowu.html";
					}
					else if("gcount" == res.error) {
						window.location.href = "/yich/wap/src/html/cuowu.html";
					}
				}
			}
		};
		var isNullorUndefined = function(str){
			if(str === undefined || str === null || str === ""){
				return true;
			}else{
				return false;
			}
		};
		var _showTips = function(tips) {
			$('.recordok_tip').removeClass('hide');
			$('.recordok_tip>p')[0].innerHTML = tips;
			setTimeout(function() {
				$('.recordok_tip').addClass('hide');
			}, 1000);
		};
		var _showOtherBtn = function(res) {
			$('.record_btn').addClass('hide');
			$('.recordok_btn').removeClass('hide');
		};
		var _dispose = function(){
			$('#details>div.theme>span')[0].innerHTML = '';
			// $('#chooseType>div.choHeader>div.goodsInfo>h5')[0].innerHTML = ''; 
			// $('#details>div.otherinfo>div.shelf>span.shelf_time')[0].innerHTML = ''; 
			$('#details>div.price>span')[0].innerHTML = ''; 
			// $('#details>div.breif-info>div.store>span')[1].innerHTML = ''; 
			// $('#details>div.breif-info>div.departureport>span')[1].innerHTML = ''; 
			// $('#details>div.breif-info>div.sales>span')[1].innerHTML = ''; 
			// $('#details>div.otherinfo>div.twisting>span.twist_price')[0].innerHTML = '';
			$('div.swiper-wrapper').empty();
			// $('#chooseType>div.choHeader>div.goodsInfo>h5')[0].innerHTML = '';
			// $('#chooseType>div.choHeader>div.goodsInfo>p.goodnum')[0].innerHTML = '';
			// $('#chooseType>div.choPrice>ul').empty();

			// $('#chooseType>div.choHeader>div.goodsPic>img')[0].src = './../images/ant_0.png';
			$('#details>div.details_page>div.deta_pics').empty();
		};

		var func = {
			// localStorage
			localadd: function(o,str){
			  if(window.localStorage && (window.localStorage)[o]){
			    var obj = localStorage.getItem(o);
			    var arr=JSON.parse(obj);
			    var arrsz=[];
			    var arrconcat=[];
			    for(var j=0;j<arr.length;j++){
			      arrconcat.push(JSON.stringify(arr[j]));
			      arrsz.push(arr[j].pro_id);
			    }
			    var obj=eval("("+str+")");
			    if(arrsz.indexOf(obj.pro_id)==-1){
			      arrconcat.push(str);
			         }
			    
			    localStorage.setItem(o,'['+arrconcat+']');
			  }else{
			    var sz=[];
			    sz.push(str);
			    localStorage.setItem(o,'['+sz+']');
			  };
			},
			localremove: function(o,str){
			  if(window.localStorage && (window.localStorage)[o]){
			    var obj = localStorage.getItem(o);
			    var arr=JSON.parse(obj);
			    var arrsz=[];
			    var obj=eval("("+str+")");
			    for(var j=0;j<arr.length;j++){
			      if(arr[j].pro_id==obj.pro_id){
			        arr.splice(j,1);
			        break
			      }
			    }
			    for(var k=0;k<arr.length;k++){
			      arrsz.push(JSON.stringify(arr[k]));
			    }
			    localStorage.setItem(o,'['+arrsz+']');
			  }
			},
			getLocal: function(o){
				if(window.localStorage && (window.localStorage)[o]){
					var obj = localStorage.getItem(o);
					var arr = JSON.parse(obj);
					return arr;
				}
				else{
					return [];
				}
			},
			imgsize:function(src,size){
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
			},
			getReg: function(name) {
				var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
				var r = window.location.search.substr(1).match(reg);
				if(r!=null) return  unescape(r[2]); return null;
			},
			getStyle: function(obj, attr){
			    if(obj.currentStyle) {
			        return obj.currentStyle[attr];
			    }
			    else
			    {
			        return getComputedStyle(obj, false)[attr];
			    }
			},
			fwh_authorize:function(userId){
				if((typeof userId=='undefined') || (!userId)){
					  window.location.href= "/yich/PhoneClickWechatButton";
				  }
			},
		};

		return self;
	}
})(Zepto);