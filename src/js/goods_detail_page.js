(function ($) {
	$.fn.GoodsDetailPage = function() {
		var self = this.GoodsDetailPage;

		var proid = null;
		var count = 0;
		var libCount = 0;
		var supid = '';
		var salePrice  = {};

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

			// click record event 采录
			$('.record_btn')[0].addEventListener('click', _clickRecord, false);
			
			// cooperate 合作
			$('.cooperate')[0].addEventListener('click', _clickToCoop, false);
			
			// click join record order btn event 加入采购单
			$('.recordok_btn>input[name="recordok-btn"]')[0].addEventListener('click', _clickAddRecordOrder, false);

			// place order 下单
			$('.recordok_btn>input[name="place-btn"]')[0].addEventListener('click', _clickPlaceOrder, false);

			// show choose type: detail-info 查看规格和价格
			$('.detail-info')[0].addEventListener('click', function() {
				$('div.chooseType').removeClass('hide');
				_htmlScrollPok();
			}, false);

			// hide choose type 
			$('div.chooseType')[0].addEventListener('click', function(e) {
				if($('div.chooseType')[0] == e.target){
					$('div.chooseType').addClass('hide');
					_htmlScrollOk();
				}
			}, false);
			
			$('.tkClose')[0].addEventListener('click', function(e) {
				$('div.chooseType').addClass('hide');
				_htmlScrollOk();
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
			$('input[name="choFooter-btn"]')[0].addEventListener('click', function() {
				$('div.chooseType').addClass('hide');
				_htmlScrollOk();
			}, false);
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

			// 分享
			$(".share")[0].addEventListener("click", function() {
				window.location.href='/yich/wap/src/html/share.html?proId='+proid+'&supId='+supid;
			}, false);
			
			$(".toStorageIndex")[0].addEventListener("click", function() {
				window.location.href='/yich/wapservice/dist/html/WarehouseHome.html?supId='+supid;
			}, false);

			// 如何计算价格
			$('.countPrice').click(function(){
				$('#js_mtTips').show();
			})
			$('#js_mtcancel>i').click(function(){
				$('#js_mtTips').hide();
			})
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

		var _getProid = function(name) {
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r!=null) {
				return unescape(r[2]);
			}else {
				return null;
			};
		};
		var _post4GoodsData = function(oAfterPostOkCallback) {
			$.ajax({
				type: 'get',
				url: '/yich/PhoneGoodInfoServlet',
				dataType: 'json',
				data: {
					"proid": proid,
				},
				success: function(res) {
					if(typeof (res.userId)!='undefined') {
						func.fwh_authorize(res.userId);
					}
					if(res.flag&&res.flag==2){
						var supId = (res.product && res.product.supshop_id)?res.product.supshop_id:'';
						window.location.href="/yich/wapservice/dist/html/unauthorized.html?supId="+supId;
					}else{
						oAfterPostOkCallback(res);
					}
//					console.log(res);
				},
				error: function(res) {
					console.log(res);
				}
			});
		};
		var _afterPostOk = function(res, oNextEventCallback) {
//			console.log(res);
			oNextEventCallback(res);
		};
		var _afterPostPok = function(res, oNextEventCallback) {
			console.log(res);
		};
		// var _drawPage = function() {
		var _drawPage = function(res) {
			if(res) {
				if(typeof(res.product) === "object"){  // 商品是否移除？
					// cache
					goodsDataCache = res;

					// update layout
					if(goodsDataCache.product){
						// 是否支持售后
						if("Y" == goodsDataCache.product.customer_service) {
							// do nothing
						}
						else {
							$("body").append('<div class="customer_service"><p>暂不支持售后</p></div>');
						}
						
						// supid
						supid = goodsDataCache.product.supshop_id;

						var pro_name = goodsDataCache.product.pro_name;
						if(!isNullorUndefined(pro_name)){
							$('#details>div.theme>span')[0].innerHTML = pro_name;  // theme

							$('#chooseType>div.choHeader>div.goodsInfo>h5')[0].innerHTML = pro_name;  // theme
						}

						var put_time = goodsDataCache.product.put_time;
						if(!isNullorUndefined(put_time)){
							$('#details>div.otherinfo>div.shelf>span.shelf_time')[0].innerHTML = put_time;  // put_time
						}

						var departureport = goodsDataCache.product.suppliershopaddress;
						if(!isNullorUndefined(departureport)){
							var arrDepart = departureport.split(';');
							if(arrDepart && arrDepart.length > 2) {
								arrDepart.splice(2, arrDepart.length);
							}
							departureport = arrDepart.join(' ');
							$('#details>div.breif-info>div.departureport>span')[1].innerHTML = departureport;  // departureport
							$('#details>div.breif-info>div.departureport>span')[1].title = departureport;  // departureport
						}
						
						var sales = goodsDataCache.product.sale_times;
						if(!isNaN(sales)){
							$('#details>div.breif-info>div.sales>span')[1].innerHTML = sales + "件";  // sales
						}
						else {
							$('#details>div.breif-info>div.sales>span')[1].innerHTML = 0 + "件";  // sales
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

						// 是否已加入采录库
						var bIsCollect = goodsDataCache.product.isCollect;
						if(bIsCollect) {
							_showOtherBtn();
						}

						// 是否已加入采购单
						var bIsRecord = false;
						var arrLocalObj = func.getLocal("localobject_"+supid);
						if(arrLocalObj && arrLocalObj.length > 0) {
							arrLocalObj.forEach(function(obj, num) {
								if( obj.pro_id== goodsDataCache.product.pro_id) {
									bIsRecord = true;
								}
							});
						}
						if(bIsRecord) {
							// change to added
							$('.recordok_btn>input[name="recordok-btn"]').val = "已加入采购单";
							$('.recordok_btn>input[name="recordok-btn"]').removeClass('ok_btn');
							$('.recordok_btn>input[name="recordok-btn"]').addClass('join');

							// can not click again
							$('.recordok_btn>input[name="recordok-btn"]')[0].removeEventListener('click', _clickAddRecordOrder, false);
						}
					}

					var qjj = goodsDataCache.price;
					if(!isNullorUndefined(qjj)){
						// $('#details>div.price>span')[0].innerHTML = "￥" + parseFloat(qjj).toFixed(2);  // price
						// $('#details>div.price>span')[0].innerHTML = qjj;  // price
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



						// if(arr.length > 0) {
						// 	strQjj += arr[0].split(".")[0] + '.<b class="priceB">' + !isNullorUndefined(arr[0].split(".")[1])?arr[0].split(".")[1]:"00" + '</b>';

						// 	if(!isNullorUndefined(arr[1])) {
						// 		strQjj += "-" + arr[1].split(".")[0] + '.<b class="priceB">' + arr[1].split(".")[1] + '</b>';
						// 	}
						// }

						$('#details>div.price>span')[0].innerHTML = strQjj;  // price
					}
					
					var store = goodsDataCache.store;
					if(!isNullorUndefined(store)){
						$('#details>div.breif-info>div.store>span')[1].innerHTML = store + "件";  // store
					}
					
					var bod = goodsDataCache.bod;
					if(!isNullorUndefined(bod)){  // twisting
						bod = parseFloat(bod);
						$('#details>div.otherinfo>div.twisting>span.twist_price')[0].innerHTML = bod + "%";
						if(0 == bod){  
							$('#details>div.otherinfo>div.twisting>span.arrow').css({
								"transform": "rotate(0)",
								"-ms-transform": "rotate(0)", 	/* IE 9 */
								"-moz-transform": "rotate(0)", 	/* Firefox */
								"-webkit-transform": "rotate(0)", /* Safari 和 Chrome */
								"-o-transform": "rotate(0)", 	/* Opera */
								"display": "none",
							});
						}else if(0 < bod){
							$('#details>div.otherinfo>div.twisting>span.arrow').css({
								"transform": "rotate(180deg)",
								"-ms-transform": "rotate(180deg)", 	/* IE 9 */
								"-moz-transform": "rotate(180deg)", 	/* Firefox */
								"-webkit-transform": "rotate(180deg)", /* Safari 和 Chrome */
								"-o-transform": "rotate(180deg)", 	/* Opera */
								"display": "inline-block",
							});
						}else{
							$('#details>div.otherinfo>div.twisting>span.arrow').css({
								"transform": "rotate(0)",
								"-ms-transform": "rotate(0)", 	/* IE 9 */
								"-moz-transform": "rotate(0)", 	/* Firefox */
								"-webkit-transform": "rotate(0)",  /* Safari 和 Chrome */
								"-o-transform": "rotate(0)", 	/* Opera */
								"display": "inline-block",
							});
						}
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

					var pmcList = goodsDataCache.PrestoreCardList;
					if(pmcList && pmcList.length > 0) {
						$(".pmc").removeClass("hide");
						$(".pmc").on("click", function() {
							window.location.href = "/yich/wapservice/dist/html/buyCard.html?supid=" + supid;
						});
					}

					// update chooseType
					if(goodsDataCache.product){
						var pro_name = goodsDataCache.product.pro_name;
						if(!isNullorUndefined(pro_name)){
							$('#chooseType>div.choHeader>div.goodsInfo>h5')[0].innerHTML = pro_name;  // theme
						}

						var good_no = goodsDataCache.product.good_no;
						if(!isNullorUndefined(good_no)){
							$('#chooseType>div.choHeader>div.goodsInfo>p.goodnum')[0].innerHTML = good_no;  // good_no
						}

						var shopInvtory = goodsDataCache.product.shopInvtory;
						if(shopInvtory && shopInvtory.length > 0){
							shopInvtory.forEach(function(item, index){
								// 是否商品已下架？
								if("WAIT_PUT_AWAY" == item.wait_sell.toUpperCase()) {
									$('.hasLaidOff').removeClass('hide');
								}
								else if("PUT_AWAY" == item.wait_sell.toUpperCase()) {
									$('div#footer>.to_index').removeClass('hide');
									$('div#footer>.record').removeClass('hide');
								}
								// else {
								$('#chooseType>div.choPrice>ul').append('<li key=' + index +'>\
									<span>' + item.sku_properties + '</span>\
									<b>(库存：' + item.pro_num + '件)</b>\
									<ul></ul>\
								</li>');

								// if 合作商价格
								if(item.wholesalePrice){
									if(goodsDataCache.product.template && goodsDataCache.product.template.length > 0) {  // 有合作商价格
										$('.price>p.partnerPrice').removeClass("hide");
										// $('#chooseType>div.choHeader>div.goodsInfo>p.partnerPrice').removeClass("hide");

										var arrWholeSale = [];

										if(!isNullorUndefined(item.wholesalePrice.orginPrice) && !isNullorUndefined(item.wholesalePrice.templaeOrginPrice)){
											arrWholeSale.push({
												templatePrice: item.wholesalePrice.templaeOrginPrice,
												wholesalePrice: item.wholesalePrice.orginPrice,
												standard: "1",
											});
										}
										if(!isNullorUndefined(item.wholesalePrice.standard0) && !isNullorUndefined(item.wholesalePrice.wholesalePrice0) && !isNullorUndefined(item.wholesalePrice.templatePrice0)){
											arrWholeSale.push({
												templatePrice: item.wholesalePrice.templatePrice0,
												wholesalePrice: item.wholesalePrice.wholesalePrice0,
												standard: item.wholesalePrice.standard0,
											});
										}
										if(!isNullorUndefined(item.wholesalePrice.standard1) && !isNullorUndefined(item.wholesalePrice.wholesalePrice1) && !isNullorUndefined(item.wholesalePrice.templatePrice1)){
											arrWholeSale.push({
												templatePrice: item.wholesalePrice.templatePrice1,
												wholesalePrice: item.wholesalePrice.wholesalePrice1,
												standard: item.wholesalePrice.standard1,
											});
										}
										if(!isNullorUndefined(item.wholesalePrice.standard2) && !isNullorUndefined(item.wholesalePrice.wholesalePrice2) && !isNullorUndefined(item.wholesalePrice.templatePrice2)){
											arrWholeSale.push({
												templatePrice: item.wholesalePrice.templatePrice2,
												wholesalePrice: item.wholesalePrice.wholesalePrice2,
												standard: item.wholesalePrice.standard2,
											});
										}
										if(!isNullorUndefined(item.wholesalePrice.standard3) && !isNullorUndefined(item.wholesalePrice.wholesalePrice3) && !isNullorUndefined(item.wholesalePrice.templatePrice3)){
											arrWholeSale.push({
												templatePrice: item.wholesalePrice.templatePrice3,
												wholesalePrice: item.wholesalePrice.wholesalePrice3,
												standard: item.wholesalePrice.standard3,
											});
										}

										if(arrWholeSale.length > 0) {
											arrWholeSale.forEach(function(sale, num) {
												if(num != arrWholeSale.length-1) {
													sale.standard = sale.standard + "-" + (arrWholeSale[num+1].standard - 1);
												}
												else if(num == arrWholeSale.length-1){
													sale.standard = "≥" + sale.standard;
												}

												$('#chooseType>div.choPrice>ul>li').eq(index).children('ul').append('\
													<li>\
														<span>￥' + parseFloat(sale.templatePrice).toFixed(2) + '</span>\
														<p>￥' + parseFloat(sale.wholesalePrice).toFixed(2) + '</p>\
														<b>' + sale.standard + '件</b>\
													</li>');
											});
										}

										// if(arrWholeSale.length > 0) {
										// 	var standard0 = arrWholeSale[0].standard;
										// 	if(arrWholeSale.length > 1 && parseInt(standard0) == 1) {
										// 		arrWholeSale[0].standard = "1-1";
										// 	}

										// 	arrWholeSale.forEach(function(sale, num) {
										// 		$('#chooseType>div.choPrice>ul>li').eq(index).children('ul').append('\
										// 			<li>\
										// 				<span>￥' + parseFloat(sale.templatePrice).toFixed(2) + '</span>\
										// 				<p>￥' + parseFloat(sale.wholesalePrice).toFixed(2) + '</p>\
										// 				<b>' + sale.standard + '件</b>\
										// 			</li>');

										// 		if(num == arrWholeSale.length-1) {
										// 			var el = $('#chooseType>div.choPrice>ul>li').eq(index).children('ul').children('li').eq(num);
										// 			el.children('b').text("≥"+sale.standard);
										// 		}
										// 	});
										// }
									}
									else {  // 无合作商价格
										var arrWholeSale = [];

										if(!isNullorUndefined(item.wholesalePrice.orginPrice)){
											arrWholeSale.push({
												wholesalePrice: item.wholesalePrice.orginPrice,
												standard: "1",
											});
										}
										if(!isNullorUndefined(item.wholesalePrice.standard0) && !isNullorUndefined(item.wholesalePrice.wholesalePrice0)){
											arrWholeSale.push({
												wholesalePrice: item.wholesalePrice.wholesalePrice0,
												standard: item.wholesalePrice.standard0,
											});
										}
										if(!isNullorUndefined(item.wholesalePrice.standard1) && !isNullorUndefined(item.wholesalePrice.wholesalePrice1)){
											arrWholeSale.push({
												wholesalePrice: item.wholesalePrice.wholesalePrice1,
												standard: item.wholesalePrice.standard1,
											});
										}
										if(!isNullorUndefined(item.wholesalePrice.standard2) && !isNullorUndefined(item.wholesalePrice.wholesalePrice2)){
											arrWholeSale.push({
												wholesalePrice: item.wholesalePrice.wholesalePrice2,
												standard: item.wholesalePrice.standard2,
											});
										}
										if(!isNullorUndefined(item.wholesalePrice.standard3) && !isNullorUndefined(item.wholesalePrice.wholesalePrice3)){
											arrWholeSale.push({
												wholesalePrice: item.wholesalePrice.wholesalePrice3,
												standard: item.wholesalePrice.standard3,
											});
										}

										if(arrWholeSale.length > 0) {
											arrWholeSale.forEach(function(sale, num) {
												if(num != arrWholeSale.length-1) {
													sale.standard = sale.standard + "-" + (arrWholeSale[num+1].standard - 1);
												}
												else if(num == arrWholeSale.length-1){
													sale.standard = "≥" + sale.standard;
												}

												$('#chooseType>div.choPrice>ul>li').eq(index).children('ul').append('\
													<li>\
														<span>￥' + parseFloat(sale.wholesalePrice).toFixed(2) + '</span>\
														<b>' + sale.standard + '件</b>\
													</li>');
											});
										}
									}
								}
									// else{

									// }
								// }
								
							});

							// 显示一件代发
							var onePiece = shopInvtory[0].price;
							if(!isNaN(parseInt(onePiece)) && parseInt(onePiece)!=0) {
								$(".onePiece").removeClass("hide");
							}
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
							$('#chooseType>div.choHeader>div.goodsPic>img')[0].src = img.src;
						}
					}

					// update product params


					// update details_page
					var strHtml = goodsDataCache.html;
					if(!isNullorUndefined(strHtml)){
						$('#details>div.details_page>div.deta_pics').append(strHtml);
					}else{
						$('#details>div.details_page').hide();
					}

					// record_order -- count
					//获取采购单数量
					cgdcount(function(count) {
						count = count;
						var strCount = count;
						if((count*1) > 99) {
							strCount = 99 + "+";
							$("#count").removeClass("hide");
						}else if((count*1) <= 99 && (count*1) > 0) {
							strCount = count;
							$("#count").removeClass("hide");
						}
						$("#count")[0].innerHTML = strCount;
					});

					// 获取采录库数量
					getLibCount(function(num) {
						libCount = num;
						var strLibCount = num;
						if((libCount*1) > 99) {
							strLibCount = 99 + "+";
							$("#lib_count").removeClass("hide");
						}
						else if((libCount*1) <= 99 && (libCount*1) > 0) {
							strLibCount = num;
							$("#lib_count").removeClass("hide");
						}
						$("#lib_count")[0].innerHTML = strLibCount;
					});

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
				}
				else {
					$('#details').addClass("hide");
					$('#similarGoods').removeClass("hide");

					if(res.list && res.list.length > 0) {
						$('div.similarGoodsRecommend').removeClass("hide");

						res.list.forEach(function(item, index) {
							var strHtml = '\
								<li class="clearfix">\
									<img src="./../images/headPortrait.png" alt="pic">\
									<div class="canRecord">\
										<div class="rTitle">\
											<p></p>\
										</div>\
										<div class="rGoodNo">\
											<p></p>\
										</div>\
										<div class="onePrice clearfix">\
											<span class="rPrice">￥ ' + "00" + '</span>\
											<span class="partner hide">合作商价格</span>\
											<span class="oneAct">一件代发</span>\
										</div>\
										<div class="morePrice clearfix">\
											<ul></ul>\
										</div>\
									</div>\
								</li>\
							';

							$('div.similarGoodsRecommend>ul').append(strHtml);

							if(item.shopinvtory) {
								if(!isNullorUndefined(item.shopinvtory.price)) {
									$('div.similarGoodsRecommend>ul>li').eq(index).find('span.rPrice')[0].innerHTML = "￥" + item.shopinvtory.price.toFixed(2);
								}

								if(!isNullorUndefined(item.shopinvtory.good_no)) {
									$('div.similarGoodsRecommend>ul>li').eq(index).find('div.rGoodNo>p')[0].innerHTML = item.shopinvtory.good_no;
								}

								if(!isNullorUndefined(item.shopinvtory.pro_name)) {
									$('div.similarGoodsRecommend>ul>li').eq(index).find('div.rTitle>p')[0].innerHTML = item.shopinvtory.pro_name;
								}
							}

							if(item.template && item.template.length > 0) {
								$('div.similarGoodsRecommend>ul>li').eq(index).find('span.partner').removeClass("hide");
							}

							if(item.proImage) {
								if(!isNullorUndefined(item.proImage.src)) {
									var similarImg = new Image();
									similarImg.src = item.proImage.src;
									var wh={
											w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(220)),
											h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(220)),
										};
									var whe="@"+wh.w+"w_"+wh.h+"h";
									similarImg.src = func.imgsize(similarImg.src,whe);
									similarImg.onload = function() {
										$('div.similarGoodsRecommend>ul>li').eq(index).find('img')[0].src = similarImg.src;
									};
								}
							}

							$('div.similarGoodsRecommend>ul>li')[index].querySelector('img').addEventListener('click', function() {
								// console.log(item.pro_id);
								window.location.href = '/yich/wapservice/dist/html/goods_detail_page.html?proId=' + item.pro_id;
							}, false);
						});
					}
				}

				// pageloading
				setTimeout(function() {
			        if ($("#pageloading").length > 0) {
			            $("#pageloading").remove();
			        }
			    }, 500);
			}
		};
		var getLibCount = function(callback) {
			if(window.localStorage) {
				if(localStorage.getItem("clcount_"+supid)) {
					var num = JSON.parse(localStorage.getItem("clcount_"+supid));
					callback(num);
				}
				else {
					callback(0);
				}
			}
		};
		var cgdcount = function(oAfterPostOkCallback) {
			if(window.localStorage){
				var localCount = 0;
				for(localkey in window.localStorage) {
					if(localkey.indexOf("localobject_") == 0) {
						localCount += JSON.parse(window.localStorage[localkey]).length;
					}
				}
				oAfterPostOkCallback(localCount);
            }else {
            	alert("浏览暂不支持localStorage")
            } 
		};
		var isNullorUndefined = function(str){
			if(str === undefined || str === null || str === ""){
				return true;
			}else{
				return false;
			}
		};
		var _clickRecord = function() {
			// post
			_post4Record(function(res){
				_afterPostOk(res, function(res) {
					// show place order btn
					_showPlaceOrder(res);
				});
			}, function(res) {
				_afterPostPok(res, function() {
					// do nothing
				});
			});
		};
		var _clickToCoop = function() {
			window.location.href = '/yich/card_wap/src/html/cooperation.html?supshopId=' + supid;
		};
		var _post4Record = function(oAfterPostOkCallback) {
			$.ajax({
				type: 'get',
				url: '/yich/PhoneCollectServlet',
				dataType: 'json',
				data: {
					"flag": 1,
					"status": "R",
					"proId_shopid": proid,
					"supshopId": supid
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
		var _showPlaceOrder = function(res) {
			// record btn hide

			// place order, record library, record order btn show
			_showOtherBtn(res);

			// show 成功采集 tips
			// _showTips("成功采录");

			// clcount++
			_add2Clcount("clcount_"+supid, function(num) {
				libCount = num;
				var strLibCount = num;
				if((libCount*1) > 99) {
					strLibCount = 99 + "+";
					$("#lib_count").removeClass("hide");
				}
				else if((libCount*1) <= 99 && (libCount*1) > 0) {
					strLibCount = num;
					$("#lib_count").removeClass("hide");
				}
				$("#lib_count")[0].innerHTML = strLibCount;
			});
		};
		var _add2Clcount = function(o, callback) {
			if(window.localStorage) {
				if((window.localStorage)[o]) {
					var count = JSON.parse(localStorage.getItem(o));
					count++;
					localStorage.setItem(o, count);
					callback(count);
				}
				else {
					localStorage.setItem(o, 1);
					callback(1);
				}
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
		var _clickAddRecordOrder = function() {
			// post 
			//获取采购单数量
			cgdcount(function(count) {
				var arrLocalObj = func.getLocal("localobject_"+supid);
				if(arrLocalObj && arrLocalObj.length > 0) {
					arrLocalObj.forEach(function(item, index) {
						if(item.pro_id && item.pro_id == goodsDataCache.product.pro_id) {
							// do nothing;
						}
						else {
							if(index == arrLocalObj.length-1) {
								add2Local();
								count = count+1;
							}
						}
					});
				}
				else {
					add2Local();
					count = count+1;
				}

				function add2Local() {
					// add to localStorage
					if(goodsDataCache) {
						if(goodsDataCache.product) {
							var objGoodsData = {
								pro_id: !isNullorUndefined(goodsDataCache.product.pro_id)?goodsDataCache.product.pro_id:"",
								pro_name: !isNullorUndefined(goodsDataCache.product.pro_name)?goodsDataCache.product.pro_name:"",
								supshop_id: !isNullorUndefined(goodsDataCache.product.supshop_id)?goodsDataCache.product.supshop_id:"",
								proImage: {
									src: !isNullorUndefined(goodsDataCache.srcs[0])?goodsDataCache.srcs[0]:"",
								},
								salePrice: !isNullorUndefined(goodsDataCache.product.salePrice)?goodsDataCache.product.salePrice:"",
								shopInvtory: !isNullorUndefined(goodsDataCache.product.shopInvtory)?goodsDataCache.product.shopInvtory:"",
								good_no: !isNullorUndefined(goodsDataCache.product.good_no)?goodsDataCache.product.good_no:"",
								fixed_price: !isNullorUndefined(goodsDataCache.product.fixed_price)?goodsDataCache.product.fixed_price:"",
								template: goodsDataCache.product.template,
								region: !isNullorUndefined(goodsDataCache.region)?goodsDataCache.region:"",
								supplierShop: {
									supshop_name: !isNullorUndefined(goodsDataCache.supshop_name)?goodsDataCache.supshop_name:"",
									supshop_id: supid,
								},
							};
							func.localadd("localobject_"+supid, JSON.stringify(objGoodsData));
						}
					}
				};

				

				var strCount = count;
				if((count*1) > 99) {
					strCount = 99 + "+";
					$("#count").removeClass("hide");
				}else if((count*1) <= 99 && (count*1) > 0) {
					strCount = count;
					$("#count").removeClass("hide");
				}
				$("#count")[0].innerHTML = strCount;

				// change to added
				$('.recordok_btn>input[name="recordok-btn"]').val = "已加入采购单";
				$('.recordok_btn>input[name="recordok-btn"]').removeClass('ok_btn');
				$('.recordok_btn>input[name="recordok-btn"]').addClass('join');

				// tips: 成功加入采购单
				// _showTips("成功加入采购单");

				// can not click again
				$('.recordok_btn>input[name="recordok-btn"]')[0].removeEventListener('click', _clickAddRecordOrder, false);
			});


			// _post4RecordOrder(function(res){
			// 	_afterPostOk(res, function(res) {
			// 		_addRecordOk(res);
			// 	});
			// }, function(res) {
			// 	_afterPostPok(res, function() {
			// 		// do nothing
			// 	});
			// });
		};
		var _post4RecordOrder = function(oAfterPostOkCallback) {
			$.ajax({
				type: 'POST',
				url: './../data/1.php',
				data: JSON.stringify({name: 'Zepto.js'}),
				contentType: 'application/json',
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
		}
		var _addRecordOk = function(res) {
			// change to added
			$('.recordok_btn>input[name="recordok-btn"]').val = "已加入采购单";
			$('.recordok_btn>input[name="recordok-btn"]').removeClass('ok_btn');
			$('.recordok_btn>input[name="recordok-btn"]').addClass('join');

			// tips: 成功加入采购单
			// _showTips("成功加入采购单");

			// can not click again
			$('.recordok_btn>input[name="recordok-btn"]')[0].removeEventListener('click', _clickAddRecordOrder, false);
		};
		var _clickPlaceOrder = function() {
			console.log("place order");
			window.location.href = '/yich/wapservice/dist/html/goodsOrder.html?supId=' + supid + '&goodsNo=' + escape(goodsDataCache.product.good_no);
		};
		var _dispose = function(){
			$('#details>div.theme>span')[0].innerHTML = '';
			$('#chooseType>div.choHeader>div.goodsInfo>h5')[0].innerHTML = ''; 
			$('#details>div.otherinfo>div.shelf>span.shelf_time')[0].innerHTML = ''; 
			$('#details>div.price>span')[0].innerHTML = ''; 
			$('#details>div.breif-info>div.store>span')[1].innerHTML = ''; 
			$('#details>div.breif-info>div.departureport>span')[1].innerHTML = ''; 
			$('#details>div.breif-info>div.sales>span')[1].innerHTML = ''; 
			$('#details>div.otherinfo>div.twisting>span.twist_price')[0].innerHTML = '';
			$('div.swiper-wrapper').empty();
			$('#chooseType>div.choHeader>div.goodsInfo>h5')[0].innerHTML = '';
			$('#chooseType>div.choHeader>div.goodsInfo>p.goodnum')[0].innerHTML = '';
			$('#chooseType>div.choPrice>ul').empty();

			$('#chooseType>div.choHeader>div.goodsPic>img')[0].src = './../images/ant_0.png';
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