var state = {
		traId:_getReg('traId'),
		traState:_getReg('traState'),
		retState:_getReg('retState'),
		truePayMoney:0,
		payNum:'',
};

$(function(){
	getOrdersDetailData();
	//申请售后
	$(document).on('click','.af_applyBtn',function(){
		var orderId = $(this).closest('section').attr('orderId');
		window.location.href='/yich/wapservice/dist/html/returnPriceApply.html?orderId='+orderId;
	})
	//仅退款中&仅退款完成
	$(document).on('click','.af_retPriceBtn',function(){
		var orderId = $(this).closest('section').attr('orderId');
		window.location.href='/yich/wapservice/dist/html/afterSalseDetail.html?orderId='+orderId;
	})
	
})

function setOrdersDetailData(data){
	var trasport='',adstr='',liuy='',fstr = '',cstr = '',trueMoney = 0,totalMoney = 0,favMoney = 0,goodsMony = 0;
	if(data.logcp_name && data.logcp_name != "统一运费" && data.logcp_name != ""){
		trasport = '<p><i class="icon-post"></i>'+data.logcp_name+'</p>';
	}
	adstr=[
			''+trasport+'',
			'<dl class="adress">',
				'<dt><i class="icon-adress-outline"></i><span>'+data.receiver+'</span><span>'+data.receiver_tel+'</span></dt>',
				'<dd>'+data.tra_add+'</dd>',
			'</dl>',
	       ].join("");
	$('.transport').html(adstr);
	
	if(data.seller_memo){
		liuy =[
				'<p>',
					'<i class="icon-message"></i>',
					'<span><span>留言:&nbsp;</span>'+data.seller_memo+'</span>',
				'</p>',
		      ].join("");
	}
	if(data.name){
		liuy +=[
				'<p>',
					'<i class="icon-wangwang"></i>',
					'<span><span>旺旺ID:&nbsp;</span>'+data.name+'</span>',
				'</p>',
		        ].join("");
	}
	$('.connection').html(liuy);
	//子单
	var list = data.tradeOrderList?data.tradeOrderList:[];
	for(var i in list){
		var orginPrice  = '';
		if(list[i].orginPrice && list[i].orginPrice != 0){
			orginPrice = '<del>￥'+list[i].orginPrice.toFixed(2)+'</del>';
			totalMoney += (list[i].orginPrice*list[i].traAmount);
			//if(list[i].pricetemplateId && list[i].pricetemplateId !="N"){
				favMoney += ((list[i].orginPrice-list[i].price)*list[i].traAmount);
			//}
		}else{
			totalMoney += (list[i].price*list[i].traAmount);
		}
		var sku = '';
		if(list[i].skuPropertiesName != "默认规格"){
			var sku1 = list[i].skuPropertiesName.split(';')[0]?list[i].skuPropertiesName.split(';')[0].split(':')[1]:'';
			var sku2 = list[i].skuPropertiesName.split(';')[1]?list[i].skuPropertiesName.split(';')[1].split(':')[1]:'';
			sku = (sku1 && sku2)?sku1+"/"+sku2:(sku1?sku1:(sku2?sku2:''));
		}else{
			sku = "默认规格";
		}
		goodsMony += (list[i].price*list[i].traAmount);
		var wh={
				w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
				h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
		};
		var whe="@"+wh.w+"w_"+wh.h+"h";
		var _src=func.imgsize(list[i].shopInv.product.proImage.src,whe);
		var hzpricesmodel = (list[i].pricetemplateId && list[i].pricetemplateId !="N")?'<span class="btn-display-pink">合作商价格</span>':'';
		hzpricesmodel += (list[i].shopInv.price && list[i].shopInv.price !="0")?'<span class="btn-display-orange">一件代发</span>':'';
		hzpricesmodel += (list[i].isModify && list[i].isModify !="0")?'<span class="btn-display-nomal">已改价</span>':'';
		var traAmount = parseInt(list[i].traAmount)>999?"999<sup>+</sup>":list[i].traAmount;
		var retOrderState = "";
		var noafterSalse = '';
		if(list[i].customer_service == "N"){
			noafterSalse = '<span class="noafterSalse">暂不支持售后</span>';
		}else{
			if(list[i].retOrderState == "N"){
				retOrderState = '<P class="goodsSHbtn">'+
									'<input class="click-btn af_applyBtn" type="button" value="申请售后">'+
								'</P>';
			}else if(list[i].retOrderState == "T"){
				retOrderState = '<P class="goodsSHbtn">'+
									'<input class="click-btn af_retPriceBtn" type="button" value="仅退款完成">'+
								'</P>';
			}else{
				retOrderState = '<P class="goodsSHbtn">'+
									'<input class="click-btn-redcolor af_retPriceBtn" type="button" value="仅退款中">'+
								'</P>';
			}
		}
		cstr +=[
				'<section orderId="'+list[i].orderId+'">',
				'<div class="goodsContent">',
					'<a href="/yich/wapservice/dist/html/goods_detail_page.html?proId='+list[i].shopInv.pro_id+'"><img src="'+_src+'">'+noafterSalse+'</a>',
					'<p>',
						'<a href="javascript:;">'+list[i].title+'</a>',
						'<span>'+sku+'</span>',
						'<span>'+hzpricesmodel+'</span>',
					'</p>',
					'<p>',
						'<span>￥'+list[i].price.toFixed(2)+'</span>',
						''+orginPrice+'',
						'<span>x'+traAmount+'件</span>',
					'</p>',
				'</div>',
				''+retOrderState+'',
				'</section>',
		      ].join("");
	}
	//trueMoney  = (goodsMony+parseFloat(data.log_money?data.log_money:0)).toFixed(2);
	trueMoney = (data.payment).toFixed(2);
	var log_money =  data.log_money?data.log_money.toFixed(2):'0.00';
	fstr = [
			'<p class="od_title">',
			'<span>'+data.supplierShop.supshop_name+'</span>',
			'</p>',
			''+cstr+'',
			'<p class="od_price">商品金额:<span>￥'+totalMoney.toFixed(2)+'</span></p>',
			'<p class="od_price">运费:<span>￥'+log_money+'</span></p>',
			'<p class="od_price">合作商价格优惠:<span>￥'+favMoney.toFixed(2)+'</span></p>',
			'<p class="od_price">实付金额:<span>￥'+trueMoney+'</span></p>',
	       ].join("");
	$('.goodslist').html(fstr);
	
	state.traId = data.tra_id ? data.tra_id:'';
	state.payNum = data.alipay_num ? data.alipay_num:'';
	//订单编号
	$('.od_others>li').eq(0).find('span').html(data.tra_id);
	$('.od_others>li').eq(1).find('span').html(data.tra_created);
	$('.od_others>li').eq(2).find('span').html(data.tra_pay_time);
	var moneyBefore = trueMoney.split('.')[0]?trueMoney.split('.')[0]+'.':'0.';
	var moneyAfter = trueMoney.split('.')[1]?trueMoney.split('.')[1]:"00";
	$('.od_nopayPrice').html(' <span>应付金额</span>（含运费）:&nbsp;&nbsp;<span><i>￥</i>'+moneyBefore+'<i>'+moneyAfter+'</i></span>');
	
}
function getOrdersDetailData(){
	$.ajax({
			type:"post",
			url:"/yich/PhoneOrderDetailServlet",
			dataType:"json",
			data:{traid:state.traId,state:state.traState,returnState:state.retState},
			success:function(data){
				if(data.trade){
					setOrdersDetailData(data.trade);
				}
			},error:function(err){},
		})
}
