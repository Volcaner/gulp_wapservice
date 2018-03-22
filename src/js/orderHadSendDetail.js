var state = {
		traId:_getReg('traId'),
		traState:_getReg('traState'),
		retState:_getReg('retState'),
		resale:_getReg('resale'),
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
	/*确认收货*/
	$(document).on('click','.takegoodsBtn',function(){
		var price = $(this).attr('price');
		var takeGods = new keyBoardPay();
		takeGods.init({
		  "type":"paygood",
		  "func":secretKeyAjax,
		  "money":price,
		})
	})
	//申请售后
	$(document).on('click','.af_applyBtn',function(){
		var orderId = $(this).closest('section').attr('orderId');
		var retOrderState = $(this).closest('section').attr('retOrderState');
		window.location.href='/yich/wapservice/dist/html/customerservice.html?orderId='+orderId+'&state='+retOrderState;
	})
	//换货中&换货完成
	$(document).on('click','.af_chageBtn',function(){
		var orderId = $(this).closest('section').attr('orderId');
		var retOrderState = $(this).closest('section').attr('retOrderState');
		window.location.href='/yich/wapservice/dist/html/customerservice_c.html?orderId='+orderId;
	})
	
	//退货中&退货完成
	$(document).on('click','.af_returnBtn',function(){
		var orderId = $(this).closest('section').attr('orderId');
		var retOrderState = $(this).closest('section').attr('retOrderState');
		window.location.href='/yich/wapservice/dist/html/customerservice_r.html?orderId='+orderId;
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
		var retOrderState = "";
		var noafterSalse = '';
		if(list[i].customer_service == "N"){
			noafterSalse = '<span class="noafterSalse">暂不支持售后</span>';
		}else{
			if(list[i].retOrderState == "Y" || list[i].retOrderState == "S" || list[i].retOrderState == "E" || list[i].retOrderState == "F" || list[i].retOrderState == "L" ){
				retOrderState = '<P class="goodsSHbtn">'+
									'<input class="click-btn-redcolor af_returnBtn" type="button" value="退货中">'+
								'</P>';
			}else if(list[i].retOrderState == "T"){
				retOrderState = '<P class="goodsSHbtn">'+
									'<input class="click-btn af_returnBtn" type="button" value="退货完成">'+
								'</P>';
			}else if(list[i].retOrderState == "H" || list[i].retOrderState == "A" || list[i].retOrderState == "D"){
				retOrderState = '<P class="goodsSHbtn">'+
									'<input class="click-btn-redcolor af_chageBtn" type="button" value="换货中">'+
								'</P>';
			}else if(list[i].retOrderState == "CP"){
				retOrderState = '<P class="goodsSHbtn">'+
									'<input class="click-btn af_chageBtn" type="button" value="换货完成">'+
									'<input class="click-btn af_applyBtn" type="button" value="申请售后">'+
								'</P>';
			}else{
				retOrderState = '<P class="goodsSHbtn">'+
									'<input class="click-btn af_applyBtn" type="button" value="申请售后">'+
								'</P>';
			}
		}
		cstr +=[
				'<section orderId="'+list[i].orderId+'" retOrderState="'+list[i].retOrderState+'">',
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
	state.logNum = data.log_number ? data.log_number:'';
	state.post = data.logcp_name ? data.logcp_name:'';
	state.imgsrc = data.tradeOrderList[0]?data.tradeOrderList[0].shopInv.product.proImage.src:'';
	//订单编号
	$('.od_others>li').eq(0).find('span').html(data.tra_id);
	$('.od_others>li').eq(1).find('span').html(data.tra_created);
	$('.od_others>li').eq(2).find('span').html(data.tra_pay_time);
	$('.od_others>li').eq(3).find('span').html(data.tra_send_time);
	$('.takegoodsBtn').attr('price',trueMoney);
	
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
/*确认收货ajax*/
function secretKeyAjax(pwd){
	$.ajax({
		type:"post",
		url:"/yich/SendKeyTrade",
		dataType:"json",
		success:function(data){
			//404
			checkErrorAjax(data);
			var firstjson=data;
			setMaxDigits(130);
			var key = new RSAKeyPair(firstjson.empoenTrade,"",firstjson.moduleTrade);
			var result= encryptedString(key,pwd);
			$.ajax({
				type:"post",
				url:"/yich/BeforeConfirmReceipt",
				dataType:"json",
				data:"{\"result\":\""+result+"\"}",
				success:function(data){
					var result=data.result;
					var tsp = new promptFunc();
					if(data.flag == "1"){
						if(state.payIsclosed){
							tsp.init({
								text:'今日输入已达到上限!',
							})
						}else{
							
							sureTakeGods();
						}
					}else if(data.flag == "0"){
						if(parseInt(data.passcount)>0){
							state.payIsclosed = false;
							tsp.init({
								text:'密码错误！',
							})
						}else {
							state.payIsclosed = true;
							tsp.init({
								text:'今日输入已达到上限!',
							})
						}
					}
				},
				error:function(err){},
			})
		},
		error:function(err){},
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
/*确认收货成功*/
function sureTakeGods(){
	$.ajax({
		type:"post",
		url:"/yich/PhoneUTradePass",
		dataType:"json",
		data:{
           "traId":state.traId,
	   },
       success:function(data){
    	   //404
    	   checkErrorAjax(data);
    		var tisp = new promptFunc();
    	   if(data.result>0){
    		   tisp.init({
					text:'确认收货成功!',
					func:function(){
						if(state.resale == 'resale'){
							window.location.replace("/yich/wapservice/dist/html/orderSuccess.html");
						}else{
							window.location.replace("/yich/wapservice/dist/html/orderSuccessResale.html");
						}
						
					},
				})
    	   }else{
    		   tisp.init({
					text:'确认收货失败!',
				})
    	   }
       },error:function(err){},
	})
}
