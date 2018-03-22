var state = {
		page:1,
}
$(function(){
	$(document).on('click','.or_goods',function(){
		var tempurl = window.location.href;
		var traId =$(this).closest('li').attr('traId');
		var traState =$(this).closest('li').attr('traState');
		var retState =$(this).closest('li').attr('retState');
		if(tempurl.indexOf('orderHadSendResale')!=-1){
			window.location.href="/yich/wapservice/dist/html/orderHadSendDetail.html?traId="+traId+"&traState="+traState+"&retState="+retState+'&resale=resale';
		}else{
			window.location.href="/yich/wapservice/dist/html/orderHadSendDetail.html?traId="+traId+"&traState="+traState+"&retState="+retState;
		}
	})
	/*查看快递*/
	$(document).on('click','.lookpostBtn',function(){
		var traId = $(this).closest('li').attr('traId');
		var post = $(this).attr('post');
		var logNum = $(this).attr('logNum');
		var te_imgsrc = $(this).attr('imgsrc');
		window.location.href=encodeURI("/yich/wapservice/dist/html/lookTransport.html?traId="+traId+"&logNum="+logNum+"&post="+post+"&imgsrc="+te_imgsrc);
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
				var retOrderState = "";
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
				var noafterSalse = mylist[j].customer_service == "N"?'<span class="noafterSalse">暂不支持售后</span>':'';
				cstr+=[
						'<section class="or_goods">',
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
			var postcompany = (list[i].logcp_name && list[i].logcp_name != "") ? list[i].logcp_name : '';
			var te_imgsrc = list[i].tradeOrderList[0]?list[i].tradeOrderList[0].shopInv.product.proImage.src:'';
			var buttonStr = '<span class="or_btnbox">'+
							'<input type="button" class="click-btn lookpostBtn" value="查看物流" post="'+postcompany+'" logNum="'+list[i].log_number+'" imgsrc="'+te_imgsrc+'">'+
							'<input type="button" class="click-btn-redcolor takegoodsBtn" value="确认收货" price="'+trueMoney+'">'+
						'</span>';
			var log_money =  list[i].log_money?list[i].log_money.toFixed(2):'0.00';
			fstr = [
					'<li traId="'+list[i].tra_id+'" payNum="'+list[i].alipay_num+'" traState="'+list[i].tra_state+'" retState="'+list[i].return_state+'">',
						'<p class="or_title">',
							'<span>'+list[i].supplierShop.supshop_name+'</span>',
							'<span>已发货</span>',
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