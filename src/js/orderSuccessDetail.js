var state = {
		traId:_getReg('traId'),
		traState:_getReg('traState'),
		retState:_getReg('retState'),
		truePayMoney:0,
		payNum:'',
		payIsclosed:false,
		logNum:'',//快递单号
		post:'',//快递公司
		imgsrc:'',//图片
};

$(function(){
	getOrdersDetailData();
	getTransportData();
	
	/*查看快递*/
	$(document).on('click','.hadsendpost',function(){
		window.location.href=encodeURI("/yich/wapservice/dist/html/lookTransport.html?traId="+state.traId+"&logNum="+state.logNum+"&post="+state.post+"&imgsrc="+state.imgsrc);
	})
})

function setOrdersDetailData(data){
	var adstr='',liuy='',fstr = '',cstr = '',trueMoney = 0,totalMoney = 0,favMoney = 0,goodsMony = 0;
	
	adstr=[
			'<dl class="hadsendpost">',
				'<dt>',
					'<p><i class="icon-post"></i><span>暂无物流信息</span></p>',
					'<p></p>',
				'</dt>',
				'<dd><i class="icon-menu-right"></i></dd>',
			'</dl>',
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
		var noafterSalse = list[i].customer_service == "N"?'<span class="noafterSalse">暂不支持售后</span>':'';
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
	state.logNum = data.log_number ? data.log_number:'';
	state.post = data.logcp_name ? data.logcp_name:'';
	state.imgsrc = data.tradeOrderList[0]?data.tradeOrderList[0].shopInv.product.proImage.src:'';
	//订单编号
	$('.od_others>li').eq(0).find('span').html(data.tra_id);
	$('.od_others>li').eq(1).find('span').html(data.tra_created);
	$('.od_others>li').eq(2).find('span').html(data.tra_pay_time);
	$('.od_others>li').eq(3).find('span').html(data.tra_send_time);
	$('.od_others>li').eq(4).find('span').html(data.tra_finished_time);
	
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

function getTransportData(){
	$.ajax({
		type:"post",
		url:"/yich/PhoneCheckLogInfo",
		dataType:"json",
		data:{traId:state.traId},
		success:function(data){
			if(data.result && data.result.result && data.result.result.list){
				var list = data.result.result.list;
				if(list.length>0){
					$('.hadsendpost>dt').find('p').eq(0).find('span').html(list[list.length-1].remark);
					$('.hadsendpost>dt').find('p').eq(1).html(list[list.length-1].datetime);
				}
				
			}
		},error:function(err){},
	})
}
