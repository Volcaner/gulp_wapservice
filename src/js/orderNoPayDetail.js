var state = {
		traId:_getReg('traId'),
		traState:_getReg('traState'),
		retState:_getReg('retState'),
		truePayMoney:0,
		payNum:'',
		istime:'', //倒计时
		timer:999, //倒计时时间
		isPaysta:true,//是否可以点击支付
};

$(function(){
	getOrdersDetailData();
	//倒计时
	$(document).on('click','.orderDetailCancelBtn',function(){
		var title1 = "确定作废订单吗?";
		var title2 = "该订单已创建支付号<br>请前往支付管理关闭或支付";
		if(state.payNum == 'N'){
			chekMTfunc(title1,cancelDelete)
		}else{
			konwsMTfunc(title2);
		}
	})
	$('.orderDetailPayMoneyBtn').click(function(){
		var strid = state.traId;
		if(strid && state.isPaysta){
			payMoneyAjax(strid);
		}
	})
})

function setOrdersDetailData(data){
	var trasport='',adstr='',liuy='',fstr = '',cstr = '',trueMoney = 0,totalMoney = 0,favMoney = 0,goodsMony = 0;
	if(data.logcp_name != "统一运费" && data.logcp_name != ""){
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
	if(data.alipay_num && data.alipay_num == "N" && data.tra_state == "120"){
		state.isPaysta = false;
		$('.orderDetailPayMoneyBtn').removeClass('button-active');
	}else{
		state.isPaysta = true;
		$('.orderDetailPayMoneyBtn').addClass('button-active');
	}
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
	var moneyBefore = trueMoney.split('.')[0]?trueMoney.split('.')[0]+'.':'0.';
	var moneyAfter = trueMoney.split('.')[1]?trueMoney.split('.')[1]:"00";
	$('.od_nopayPrice').html(' <span>应付金额</span>（含运费）:&nbsp;&nbsp;<span><i>￥</i>'+moneyBefore+'<i>'+moneyAfter+'</i></span>');
	if(!state.isPaysta && state.traState == "120"){
		$('.timebox').html('该商品库存不足，交易关闭!');
	}else{
		state.istime = setInterval(runtime,1000);
	}
}
function getOrdersDetailData(){
	if(state.traState == "120"){
		$('header>.od_title').text('买家已付款,我未付款');
	}else{
		$('header>.od_title').text('未付款');
	}
	$.ajax({
			type:"post",
			url:"/yich/PhoneOrderDetailServlet",
			dataType:"json",
			data:{traid:state.traId,state:state.traState,returnState:state.retState},
			success:function(data){
				if(data.trade){
					setOrdersDetailData(data.trade);
				}
				if(data.lasttime){
					state.timer = data.lasttime;
				}
			},error:function(err){},
		})
}
/*作废订单ajax*/
function cancelDelete(){
	$.ajax({
		 type:"post",
         url:"/yich/PhoneMerchantdeleteorder",
         dataType:"json",
         data:{
             "option":"0",
             "trade_flag":"norecly",
             "tra_id":state.traId,
         },
         success:function(data){
        	 //404
        	 checkErrorAjax(data);
        	 var tisp = new promptFunc();
        	 if(data.result == "1"){
        		 window.location.replace("/yich/wapservice/dist/html/orderNoPay.html");
        	 }else{
    			 tisp.init({
 					text:"作废订单失败!",
 				})
        	 }
         },error:function(err){
        	 alert("服务器开小差啦~");
         },
	})
}

function runtime(){
	if(state.timer<999){
		clearInterval(state.istime);
		state.istime=null;
		if(state.payNum == 'N'){
			$.ajax({
				type:"post",
				url:"/yich/PhoneDeleteOrderServlet",
				dataType:"json",
				data:"{\"option\":\"0\",\"trade_flag\":\"norecly\",\"tra_id\":\""+state.traId+"\"}",
				success:function(data){
					//404
					checkErrorAjax(data);
					if(data.result == "1"){
						state.orderSta = false;//订单关闭
						$('.timebox').html('时间到期该订单已关闭！');
					}
				},error:function(err){},
			})
		}else{
			$('.timebox').html('时间到期,请前往支付管理关闭或支付！');
		}
		
	}else{
		var mm=parseInt(state.timer/60000);
		var ss=parseInt(state.timer/1000%60);
		mm=String(mm);
		ss=String(ss);
		mm=mm.length<2?('0'+mm):mm;
		ss=ss.length<2?('0'+ss):ss;	
		$('.timebox').html('剩余付款时间：'+mm+'分'+ss+'秒')
		state.timer-=1000;	
	}
	
}
//付款ajax
function payMoneyAjax(tradId){
	$.ajax({
		type:'post',
		url:'/yich/PhonepaymentServlet',
		data:{WIDout_trade_no:tradId,option:"first"},
		dataType:'json',
		success:function(data){
			//404
			checkErrorAjax(data);
			if(data.flag == "true"){
				/*window.location.href="/yich/wap/src/html/checkoutCounter.html?supId="+state.supId+"&payNum="+data.payNum;*/
			}else if(data.flag == "false"){
				var str = "包含已创建支付号的订单<br>请前往支付管理关闭或支付";
				chekMTfunc(str,function(){
					window.location.href='/yich/wapservice/dist/html/PaymentManagement.html';
				},"去支付管理")
			}
		},
		error:function(err){},
	})
}
