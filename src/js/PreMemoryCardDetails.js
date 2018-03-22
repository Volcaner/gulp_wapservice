$(function(){
	var prestoreCardsoldId='';
	var search=((window.location.href).split("?"))[1];
	var searcharr=search.split("&");
	for(var i=0;i<searcharr.length;i++){
		var s=searcharr[i].split("=");
		if(s[0]=='prestoreCardsoldId'){
			prestoreCardsoldId=s[1];
			break;
		}
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
          dom(data);
         },
         error: function(){
             console.log('Ajax error!');
         }
     });	
})
function dom(data){
	console.log(data);
	var usermoney="-"+(data.Use_value*1).toFixed(2);
	$(".span_price").text(usermoney);//使用的金额
	var list=(data.list)[0];
	var date=list.use_time;
	$(".span_time").text(date);//日期
	var kaname=list.prestoreCard.prestore_card_name;
	$(".kaname").text(kaname);//预存卡名称
	var kahao=list.prestore_card_sold_id;
	$(".kahao").text(kahao);//卡号
	var jine='￥'+(list.prestoreCard.face_value*1).toFixed(2);
	$(".jine").text(jine);//面额
	var zhekou=list.prestoreCard.discount+'折';
	$(".zhekou").text(zhekou);//折扣
	var wsymoney='￥'+(data.card_balance*1).toFixed(2);
	$(".wsymoney").text(wsymoney);//未使用金额
	var usertime=list.use_time;
	$(".usertime").text(usertime);//使用时间
	var shop_logo=func.imgsize(list.prestoreCard.supplierShop.shop_logo,'@100w_100h');
	$(".shop_logo").html('<img src="'+shop_logo+'"/>');
} 