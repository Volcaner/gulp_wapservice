var publicState={
	url:window.location.href.split("html/")[1]?window.location.href.split("html/")[1].split(".html")[0]:'',
	orderState:"0",//页面状态(所有订单0,未付款1,未发货2,已发货3,仅退款中4,退货中5,换货中6,交易成功9,交易关闭10,买家已付款，我未付款16)
	traId:'',
	tradeFlag:'',
	listIndex:null,//删除&取消订单时,订单的index
}
var dropload_obj = null;

/*头部切换*/
switch(publicState.url){
	case "orderAllGoodsResale":
		publicState.orderState = "0";
		$('.nav_list>a').eq(0).addClass('active').siblings().removeClass('active');
		$('.nav_cell>a').eq(0).addClass('active').siblings().removeClass('active');
	break;
	case "orderNoPayResale":
		publicState.orderState = "16";
		$('.nav_list>a').eq(1).addClass('active').siblings().removeClass('active');
		$('.nav_cell>a').eq(1).addClass('active').siblings().removeClass('active');
	break;
	case "orderNoSendResale":
		publicState.orderState = "2";
		$('.nav_list>a').eq(2).addClass('active').siblings().removeClass('active');
		$('.nav_cell>a').eq(2).addClass('active').siblings().removeClass('active');
	break;
	case "orderHadSendResale":
		publicState.orderState = "3";
		$('.nav_list>a').eq(3).addClass('active').siblings().removeClass('active');
		$('.nav_cell>a').eq(3).addClass('active').siblings().removeClass('active');
	break;
	case "orderReturnningResale":
		publicState.orderState = "5";
		$('.nav_list>a').eq(4).addClass('active').siblings().removeClass('active');
		$('.nav_cell>a').eq(4).addClass('active').siblings().removeClass('active');
	break;
	case "orderChangingResale":
		publicState.orderState = "6";
		$('.nav_list>a').eq(5).addClass('active').siblings().removeClass('active');
		$('.nav_cell>a').eq(5).addClass('active').siblings().removeClass('active');
	break;
	case "orderReturnPriceResale":
		publicState.orderState = "4";
		$('.nav_list>a').eq(6).addClass('active').siblings().removeClass('active');
		$('.nav_cell>a').eq(6).addClass('active').siblings().removeClass('active');
	break;
	case "orderSuccessResale":
		publicState.orderState = "9";
		$('.nav_list>a').eq(7).addClass('active').siblings().removeClass('active');
		$('.nav_cell>a').eq(7).addClass('active').siblings().removeClass('active');
	break;
	case "orderCloseResale":
		publicState.orderState = "10";
		$('.nav_list>a').eq(8).addClass('active').siblings().removeClass('active');
		$('.nav_cell>a').eq(8).addClass('active').siblings().removeClass('active');
	break;
	case "orderInvalidResale":
		publicState.orderState = "-2";
		$('.nav_list>a').eq(9).addClass('active').siblings().removeClass('active');
		$('.nav_cell>a').eq(9).addClass('active').siblings().removeClass('active');
	break;
}


$(function(){
	
	
/*未付款-付款*/
$(document).on('click','.singelpayBtn',function(){
	var strid = $(this).closest('li').attr('traId');
	if(strid){
		payMoneyAjax(strid);
	}
});

/*未付款-取消订单*/
$(document).on('click','.cancelgoodsBtn',function(){
	var title1 = "确定作废订单吗?<br>如需恢复请前往作废订单重新下单!"; 
	var title2 = "该订单已创建支付号<br>请前往支付管理关闭或支付";
	var index = $(this).closest('li').index();
	var traId = $(this).closest('li').attr('traId');
	var payNum = $(this).closest('li').attr('payNum');
	publicState.listIndex = index;
	publicState.tradeFlag = "norecly";
	publicState.traId = traId;
	if(payNum == 'N'){
		chekMTfunc(title1,cancelDelete);
	}else{
		konwsMTfunc(title2);
	}
})
/*交易成功删除订单*/
$(document).on('click','.sucdeleteBtn',function(){
	var title1 = "确定删除订单吗?";
	var index = $(this).closest('li').index();
	var traId = $(this).closest('li').attr('traId');
	var payNum = $(this).closest('li').attr('payNum');
	publicState.listIndex = index;
	publicState.tradeFlag = "finish_recly";
	publicState.traId = traId;
	chekMTfunc(title1,cancelDelete)
	
})
/*订单作废及交易关闭删除订单*/
$(document).on('click','.closedeleteBtn',function(){
	var title1 = "确定删除订单吗?";
	var index = $(this).closest('li').index();
	var traId = $(this).closest('li').attr('traId');
	var payNum = $(this).closest('li').attr('payNum');
	publicState.listIndex = index;
	publicState.tradeFlag = "closed_recly";
	publicState.traId = traId;
	chekMTfunc(title1,cancelDelete);
	
})
/*确认收货*/
$(document).on('click','.takegoodsBtn',function(){
	var price = $(this).attr('price');
	var traId = $(this).closest('li').attr('traId');
	publicState.traId = traId;
	var takeGods = new keyBoardPay();
	takeGods.init({
	  "type":"paygood",
	  "func":secretKeyAjax,
	  "money":price,
	})
})

})


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
				window.location.href="/yich/wapservice/dist/html/checkoutCounter.html?payNum="+data.payNum;
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
/*删除订单ajax*/
function cancelDelete(){
	$.ajax({
		 type:"post",
         url:"/yich/PhoneMerchantdeleteorder",
         dataType:"json",
         data:{
             "option":"0",
             "trade_flag":publicState.tradeFlag,
             "tra_id":publicState.traId,
         },
         success:function(data){
        	 //404
        	 checkErrorAjax(data);
        	 var tisp = new promptFunc();
        	 if(data.result == "1"){
        		 if(publicState.listIndex || publicState.listIndex == 0){
        			 $('.orderlist>li').eq(publicState.listIndex).remove();
        			 publicState.listIndex = null;
        		 }
        	 }else{
        		 var str  = "";
        		 if(publicState.tradeFlag == "norecly"){
        			 str = "取消订单失败!"
        		 }else{
        			 str = "删除订单失败!"
        		 }
	    			 tisp.init({
	 					text:str,
	 				})
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
						if(publicState.payIsclosed){
							tsp.init({
								text:'今日输入已达到上限!',
							})
						}else{
							sureTakeGods();
						}
					}else if(data.flag == "0"){
						if(parseInt(data.passcount)>0){
							publicState.payIsclosed = false;
							tsp.init({
								text:'密码错误！',
							})
						}else {
							publicState.payIsclosed = true;
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
/*确认收货成功*/
function sureTakeGods(){
	$.ajax({
		type:"post",
		url:"/yich/PhoneUTradePass",
		dataType:"json",
		data:{
           "traId":publicState.traId,
	   },
       success:function(data){
    	   //404
    	   checkErrorAjax(data);
    		var tisp = new promptFunc();
    	   if(data.result>0){
    		   tisp.init({
					text:'确认收货成功!',
					func:function(){
						window.location.replace("/yich/wapservice/dist/html/orderSuccessResale.html");
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
/*下拉刷新*/
// dropload
//页数
var order_page = 0;
dropload_obj=$('#orderdroload').dropload({
	 bIsAutoLoad: true,
    scrollArea : window,
    domUp : {
        domClass   : 'dropload-up',
        domRefresh : '<div class="dropdownload-refresh"><span class="icon iconfont iconspan iconfontsize">&#xe693;</span><span class="lable">下拉刷新</span></div>',
        domUpdate  : '<div class="dropload-update"><span class="icon iconfont iconspan iconfontsize">&#xe693;</span><span class="lable">释放更新</span></div>',
        domLoad    : '<div class="dropdownload-load"><span class="loadingspan"><span class="loading"></span></span><span class="lable">加载中</span></div>'
    },
    domDown : {
        domClass   : 'dropload-down',
        domRefresh : '<div class="dropupload-refresh">上拉加载更多</div>',
        domLoad    : '<div class="dropupload-load">加载中</div>',
        domNoData  : '<div class="dropload-noData">订单已经加载完了</div>'
    },
    loadUpFn : function(me){
    	if($('#orderdroload').closest('li').css("display")=="none"){ me.noData();me.resetload();return;}
    	$.ajax({
            type:"post",
            url:"/yich/DelegationPhoneGoodsUnderOrder",
            dataType:"json",
            data:{
                "state":publicState.orderState,
                "page":1,
                "source_type":"6",
            },
            success: function(json){
            	setOrdersData(json,true);
            	if(publicState.orderState == "1"){
            		nopayCheckNum();
            	}
                // 重置页数，重新获取loadDownFn的数据
            	order_page = 1;
                // 解锁loadDownFn里锁定的情况
                me.noData(false);
                // 每次数据加载完，必须重置
                me.resetload();
                me.unlock();
            },
            error: function(){
                // 即使加载出错，也得重置
                me.resetload();
            }
        });	
    },
    loadDownFn : function(me){
    	if($('#orderdroload').closest('li').css("display")=="none"){ me.noData();me.resetload();return;}
    	order_page++;
        // 拼接HTML
        $.ajax({
            type:"post",
            url:"/yich/DelegationPhoneGoodsUnderOrder",
            dataType:"json",
            data:{
                "state":publicState.orderState,
                "page":order_page,
                "source_type":"6",
            },
            success: function(json){
                var arrLen = json.trade_list.length;
            	if(order_page==1)setOrdersData(json,true);
            	else setOrdersData(json);
            	if(publicState.orderState == "1"){
            		nopayCheckNum();
            	}
                if(arrLen <= 0){
                    // 锁定    
                    me.lock();
                    // 无数据
                    me.noData();
                }
                me.resetload();
               
            },
            error: function(){
                // 即使加载出错，也得重置
                me.resetload();
            }
        });
    }
});
