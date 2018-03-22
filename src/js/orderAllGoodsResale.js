var state = {
		page:1,
}
$(function(){
	$(document).on('click','.or_goods',function(){
		var traId =$(this).closest('li').attr('traId');
		var traState =$(this).closest('li').attr('traState');
		var retState =$(this).closest('li').attr('retState');
		switch(traState){
		case "000":
		case "120":
			window.location.href="/yich/wapservice/dist/html/orderNoPayDetail.html?traId="+traId+"&traState="+traState+"&retState="+retState;
			break;
		case "100":
			window.location.href="/yich/wapservice/dist/html/orderNoSendDetail.html?traId="+traId+"&traState="+traState+"&retState="+retState;
			break;
		case "101":
			window.location.href="/yich/wapservice/dist/html/orderHadSendDetail.html?traId="+traId+"&traState="+traState+"&retState="+retState;
			break;
		case "trade_completed":
			window.location.href="/yich/wapservice/dist/html/orderSuccessDetail.html?traId="+traId+"&traState="+traState+"&retState="+retState;
			break;
		case "trade_close":
			window.location.href="/yich/wapservice/dist/html/orderCloseDetail.html?traId="+traId+"&traState="+traState+"&retState="+retState;
			break;
		case "201":
			window.location.href="/yich/wapservice/dist/html/orderInvalidDetail.html?traId="+traId+"&traState="+traState+"&retState="+retState;
			break;
		}
		
		
	})
	//重新下单
	$(document).on('click','.resetBtn',function(){
		var _this = $(this);
		var str = "确定重新下单吗?"
		var goodsnoarr = [];
		chekMTfunc(str,function(){
			_this.closest('li').find('.or_goods').each(function(){
				var goodNo = $(this).attr('goodNo');
				var istemp = false;
				for(var i in goodsnoarr){
					if(goodsnoarr[i] == goodNo){
						istemp = true;
					}
				}
				if(!istemp){
					goodsnoarr.push(goodNo);
				}
			})
			window.location.href="/yich/wapservice/dist/html/goodsOrder.html?goodsNo="+goodsnoarr.join(",");
		})
	})
	/*查看快递*/
	$(document).on('click','.lookpostBtn',function(){
		var traId = $(this).closest('li').attr('traId');
		var post = $(this).attr('post');
		var logNum = $(this).attr('logNum');
		var imgsrc = $(this).attr('imgsrc');
		window.location.href=encodeURI("/yich/wapservice/dist/html/lookTransport.html?traId="+traId+"&logNum="+logNum+"&post="+post+"&imgsrc="+imgsrc);
	})
	
})
var setOrdersData=function(data,flag){
	flag = arguments[1]?arguments[1]:false;
	//func.authorize(data.userId,state.supId);
	if(flag)$('.orderlist').html('');
	if(data.trade_list && data.trade_list.length>0){
		var list = data.trade_list;
		for(var i in list){
			var fstr= '',cstr = '',trueMoney = 0,totalMoney = 0,favMoney = 0,goodsMony = 0;
			var mylist = list[i].tradeOrderList;
			for(var j in mylist){
				var orginPrice  = '';
				if(mylist[j].orginPrice && mylist[j].orginPrice != 0){
					orginPrice = '<del>￥'+mylist[j].orginPrice.toFixed(2)+'</del>';
					totalMoney += (mylist[j].orginPrice*mylist[j].traAmount);
					//if(mylist[j].pricetemplateId && mylist[j].pricetemplateId !="N"){
						favMoney += ((mylist[j].orginPrice-mylist[j].price)*mylist[j].traAmount);
					//}
				}else{
					totalMoney += (mylist[j].price*mylist[j].traAmount);
				}
				
				goodsMony += (mylist[j].price*mylist[j].traAmount);
				var wh={
						w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
						h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
				};
				var whe="@"+wh.w+"w_"+wh.h+"h";
				var _src=func.imgsize(mylist[j].shopInv.product.proImage.src,whe);
				var hzpricesmodel = (mylist[j].pricetemplateId && mylist[j].pricetemplateId !="N")?'<span class="btn-display-pink">合作商价格</span>':'';
				hzpricesmodel += (mylist[j].shopInv.price && mylist[j].shopInv.price !="0")?'<span class="btn-display-orange">一件代发</span>':'';
				hzpricesmodel += (mylist[j].isModify && mylist[j].isModify !="0")?'<span class="btn-display-nomal">已改价</span>':'';
				var traAmount = parseInt(mylist[j].traAmount)>999?"999<sup>+</sup>":mylist[j].traAmount;
				var noafterSalse = mylist[j].customer_service == "N"?'<span class="noafterSalse">暂不支持售后</span>':'';
				var retOrderState = "";
				switch(list[i].tra_state){
					case "101"://已发货
						if(mylist[j].retOrderState == "Y" || mylist[j].retOrderState == "S" || mylist[j].retOrderState == "E" || mylist[j].retOrderState == "F" || mylist[j].retOrderState == "L"){
							retOrderState = "退货中";
						}else if(mylist[j].retOrderState == "T"){
							retOrderState = "退货完成";
						}else if(mylist[j].retOrderState == "H" || mylist[j].retOrderState == "A" || mylist[j].retOrderState == "D"){
							retOrderState = "换货中";
						}else if(mylist[j].retOrderState == "CP"){
							retOrderState = "换货完成";
						}else{
							retOrderState = "";
						}
						break;
					case "100"://未发货
						if(mylist[j].retOrderState == "N"){
							retOrderState = '';
						}else if(mylist[j].retOrderState == "T"){
							retOrderState = "退款完成";
						}else{
							retOrderState = "仅退款中";
						}
						break;
				}
				cstr+=[
						'<section class="or_goods" goodNo="'+mylist[j].shopInv.good_no+'">',
							'<a href="/yich/wapservice/dist/html/goods_detail_page.html?proId='+mylist[j].shopInv.pro_id+'"><img src="'+_src+'">'+noafterSalse+'</a>',
							'<p>',
								'<a href="javascript:;">'+mylist[j].title+'</a>',
								'<span>'+mylist[j].skuPropertiesName+'</span>',
								'<span>'+hzpricesmodel+'</span>',
							'</p>',
							'<p>',
								'<span>￥'+mylist[j].price.toFixed(2)+'</span>',
								''+orginPrice+'',
								'<span>x'+traAmount+'件</span>',
								'<span class="shsm">'+retOrderState+'</span>',
							'</p>',
						'</section>',
				      ].join("");
			}
			//trueMoney  = (goodsMony+parseFloat(list[i].log_money?list[i].log_money:0)).toFixed(2);
			trueMoney = (list[i].payment).toFixed(2);
			var buttonStr = '',orderSta = '';
			switch(list[i].tra_state){
				case "000"://未付款
					orderSta = '未付款';
					buttonStr = '<span class="or_btnbox">'+
									'<input type="button" class="click-btn cancelgoodsBtn" value="作废订单">'+
									'<input type="button" class="click-btn-redcolor singelpayBtn" value="付款">'+
								'</span>';
					break;
				case "120"://买家已付款,我未付款
					orderSta = '买家已付款,我未付款';
					var te_buttonStr = '';
					if(list[i].alipay_num && list[i].alipay_num!="N"){
						te_buttonStr = '<input type="button" class="click-btn-redcolor singelpayBtn" value="付款">';
					}
					buttonStr = '<span class="or_btnbox">'+
									'<input type="button" class="click-btn cancelgoodsBtn" value="作废订单">'+
									''+te_buttonStr+'',
								'</span>';
					break;
				case "100"://未发货
					orderSta = '未发货';
					break;
				case "101"://已发货
					orderSta = '已发货';
					var postcompany = (list[i].logcp_name != "统一运费" && list[i].logcp_name != "") ? list[i].logcp_name : '';
					var imgsrc = list[i].tradeOrderList[0]?list[i].tradeOrderList[0].shopInv.product.proImage.src:'';
					buttonStr = '<span class="or_btnbox">'+
									'<input type="button" class="click-btn lookpostBtn" value="查看物流" post="'+postcompany+'" logNum="'+list[i].log_number+'" imgsrc="'+imgsrc+'">'+
									'<input type="button" class="click-btn-redcolor takegoodsBtn" value="确认收货" price="'+trueMoney+'">'+
								'</span>';
					break;
				case "201"://作废订单
					orderSta = '作废订单';
					buttonStr = '<span class="or_btnbox">'+
									'<input type="button" class="click-btn resetBtn" value="重新下单">'+
									'<input type="button" class="click-btn closedeleteBtn" value="删除">'+
								'</span>';
					
					break;
				case "trade_completed"://交易成功
					orderSta = '交易成功';
					buttonStr = '<span class="click-btn sucdeleteBtn">删除</span>';
					break;
				case "trade_close"://交易关闭
					orderSta = '交易关闭';
					buttonStr = '<span class="click-btn closedeleteBtn">删除</span>';
					break;
			}
			var log_money =  list[i].log_money?list[i].log_money.toFixed(2):'0.00';
			fstr = [
					'<li traId="'+list[i].tra_id+'" payNum="'+list[i].alipay_num+'" traState="'+list[i].tra_state+'" retState="'+list[i].return_state+'">',
						'<p class="or_title">',
							'<span>'+list[i].supplierShop.supshop_name+'</span>',
							'<span>'+orderSta+'</span>',
						'</p>',
						''+cstr+'',
						'<p class="or_price">',
							'<span>商品金额:<i>￥'+totalMoney.toFixed(2)+'</i></span>',
							'<span>运费:<i>￥'+log_money+'</i></span>',
							'<span>合作商价格优惠:<i>￥'+favMoney.toFixed(2)+'</i></span>',
						'</p>',
						'<p><span>实付金额:<i>￥'+trueMoney+'</i></span>'+buttonStr+'</p>',
					'</li>',
			       ].join("");
			$('.orderlist').append(fstr);
		}
	}
	
}
