var prestoreCardSoldId2='';
var is_invalid=1;
$(function(){
	var prestoreCardsoldId='';
	var search=((window.location.href).split("?"))[1];
	var searcharr=search.split("&");
	for(var i=0;i<searcharr.length;i++){
		var s=searcharr[i].split("=");
		if(s[0]=='prestoreCardsoldId'){
			prestoreCardsoldId=s[1];
		}else if(s[0]=='is_invalid'){
			is_invalid=s[1];
		}
	}
	 if(is_invalid==0){//失效卡
		 $(".topk_hui").css("display","block");
		 $(".sqtuik").css("display","none");
	}else{
		$(".topk_hong").css("display","block");
	}
	 $.ajax({
         type:"POST",
         url:"/yich/PrestorecardUseOfServlet",
         dataType:"json",
         data:{
         	 "prestoreCardsoldId":prestoreCardsoldId,
         },
         success: function(data){
        	 if(typeof (data.userId)!='undefined'){
        		    func.fwh_authorize(data.userId);
        		}
        	 if(data.list.length>0){
        		 dom(data);
        	 }
         },
         error: function(){
             console.log('Ajax error!');
         }
     });	
})
function dom(data){
	console.log(data);
	var list=(data.list)[0];
    var yckname=list.prestoreCard.prestore_card_name;//预存卡名称
    var kahao=list.prestore_card_sold_id;//卡号
    var miane='￥'+(list.prestoreCard.face_value).toFixed(2);//面额
    var zhekou=list.prestoreCard.discount+'折';
    var usermoney='￥'+(data.Use_value).toFixed(2);//累计使用金额
    var wsymoney='￥'+(data.card_balance).toFixed(2);//未使用金额
    var buytime=list.buy_time;//购买时间
    var cc=list.prestoreCard.supplierShop.supshop_name;//仓储
    var pstate=list.state//退款
    var tkmoney=(list.refund_money).toFixed(2);
    if(is_invalid==1){
    	if(pstate=='P'){
        	$(".hongtk").css("display","block");
        	$(".sqtuik").css("display","none");
        }else{
        	if((data.card_balance).toFixed(2)*1<=0){
        		$(".sqtuik").css("display","none");
            	$(".hongtk").css("display","none");
        	}else{
        		$(".sqtuik").css("display","block");
            	$(".hongtk").css("display","none");
        	}
        	
        }
    }
    
    $(".yckname").text(yckname);
    $(".kahao").text(kahao);
    $(".miane").text(miane);
    $(".zhekou").text(zhekou);
    $(".usermoney").text(usermoney);
    $(".wsymoney").text(wsymoney);
    $(".wsymoney").attr("money",(data.card_balance).toFixed(2));
    $(".buytime").text(buytime);
    $(".cc").text(cc);
    $(".tkmoney").text(tkmoney);
    //是否为失效卡
    if(is_invalid==0){//失效卡
    	$(".topk_hui").css("display","block");
    	$(".topk_hui").find(".topk_hong").css("display","block");
    	$(".topk_hui").find(".khongprice").children("span").text(list.prestoreCard.discount);
    	$(".topk_hui").find(".spankh").text(kahao);
    	$(".topk_hui").find(".prightjg").text(miane);
    	$(".topk_hui").find(".spanName").text(yckname);
    	$(".topk_hui").find(".bot_txt").text(cc);
    	$(".topk_hui").find(".bot_tx").html('<img src="'+func.imgsize(list.prestoreCard.supplierShop.shop_logo,'@100w_100h')+'"/>');
    }else{
    	$(".topk_hong").css("display","block");
    	$(".topk_hong").find(".khongprice").children("span").text(list.prestoreCard.discount);
    	$(".topk_hong").find(".spankh").text(kahao);
    	$(".topk_hong").find(".prightjg").text(miane);
    	$(".topk_hong").find(".spanName").text(yckname);
    	$(".topk_hong").find(".bot_txt").text(cc);
    	$(".topk_hong").find(".bot_tx").html('<img src="'+func.imgsize(list.prestoreCard.supplierShop.shop_logo,'@100w_100h')+'"/>');
    }
    prestoreCardSoldId2=list.prestore_card_sold_id;
} 
$(".btn_sqtk").click(function(){
	$(".divalert,.yingying").css("display","block");
});
$(".qx_canle").click(function(){
	$(".divalert,.yingying").css("display","none");
});
$(".qd_sure").click(function(){
	$.ajax({
        type:"POST",
        url:"/yich/PrestoreCardRefundServlet",
        dataType:"json",
        data:{
        	 "prestoreCardSoldId":prestoreCardSoldId2,
        	 "state":"refund",
        },
        success: function(data){
        	if(typeof (data.userId)!='undefined'){
        	    func.fwh_authorize(data.userId);
        	}
         console.log(data);
         $(".divalert,.yingying").css("display","none");
         if(data.flag==1){
        	 $(".hongtk").css("display","block");
        	 $(".sqtuik").css("display","none");
         }else{
        	 alert("退款失败");
         }
        },
        error: function(){
            console.log('Ajax error!');
        }
    });	
});