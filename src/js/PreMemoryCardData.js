var kkname=[];
var ccname=[];
$(function(){
$('.btn1').click(function(){
	//_htmlScrollPok();
var picker3 = new huiPicker('#btn1', function(){
	 $(".ycktxt").text(picker3.getText(0));
	// _htmlScrollOk();
	 $(".yingying").css("display","block");
	 $(".yingying").css("z-index",10);
});
picker3.level = 1;
//预存卡
/*var kname = [{
	text: '卡1',
},{
	text: '卡2',
},{
	text: '卡2',
},{
	text: '卡2',
},{
	text: '卡2',
}]*/
picker3.bindRelevanceData(kkname);
})

$('.btn3').click(function(){
	//_htmlScrollPok();
var picker2 = new huiPicker('#btn3', function(){
   $(".yckname").text(picker2.getText(0));
  // _htmlScrollOk();
   $(".yingying").css("display","block");
   $(".yingying").css("z-index",10);
});
picker2.level = 1;
//仓储名称
/*var ccname = [{
	text: '仓储名称1',
},{
	text: '仓储名称2',
}]*/
picker2.bindRelevanceData(ccname);
})
//刷选按钮
$(".p_txt").click(function(){
	_htmlScrollPok();
	$(".divselectlist,.yingying").css("display","block");
});
//时间段
$(".btn2").click(function(){
	$(".sytimeduan,.yingying").css("display","block");
	$(".yingying").css("z-index",13);
});
$(".timeqx").click(function(){
	$(".sytimeduan").css("display","none");
	$(".yingying").css("z-index",10);
});
$(".timelist").children("li").click(function(){
	var v=$.trim($(this).text());
	$(".ycktime").text(v);
	$(".sytimeduan").css("display","none");
	$(".yingying").css("z-index",10);
	
});
//重置
$(".resest").click(function(){
	$(".rightspan").text('');
	page = 0;
	cardIdOrcardName='';
	time=0;
	supshopName='';
	$(".dllist").html('');
	$(".yingying,.divselectlist").css("display","none");
	dropload_obj.opts.loadDownFn(dropload_obj);
	$(".yingying").css("z-index",10);
	_htmlScrollOk();
});
$(".yingying").click(function(){
	$(".sytimeduan,.yingying,.divselectlist").css("display","none");
	$(".yingying").css("z-index",10);
	_htmlScrollOk();
});
//确定
$(".sure").click(function(){
	page=0;
	var ycktxt=$.trim($(".ycktxt").text());
	var yckarr=ycktxt.split("卡号:");
	var t=yckarr[yckarr.length-1];
	var tt=t.split(")");
	cardIdOrcardName=tt[0];//卡号
	var times=$.trim($(".ycktime").text());
	if(times=='全部'){
		time=0;
	}else if(times=='近一周'){
		time=1;
	}else if(times=='近一个月'){
		time=2;
	}else if(times=='近三个月'){
		time=3;
	}else if(times=='近半年'){
		time=4;
	}else if(times=='近一年'){
		time=5;
	}
	supshopName=$.trim($(".yckname").text());
	$(".dllist").html('');
	$(".yingying,.divselectlist").css("display","none");
	dropload_obj.opts.loadDownFn(dropload_obj);
	$(".yingying").css("z-index",10);
	_htmlScrollOk();
});
})

//加载数据
var strdom = function(data,flag){
if(typeof (data.Use_value)!='undefined'){
	var ysy=(data.Use_value*1).toFixed(2);
	$(".ysy").text(ysy);
}else{
	$(".ysy").text('0.00');
}
if(typeof (data.card_balance)!='undefined'){
	var wsy=(data.card_balance*1).toFixed(2);
	$(".wsy").text(wsy);
}else{
	$(".wsy").text('0.00');
}
ccname.length=0;
kkname.length=0;
for(var x=0;x<data.shopNameList.length;x++){
	var j={};
	j.text=(data.shopNameList)[x];
	ccname.push(j);
}
for(var u=0;u<data.PrestoreCardSoldlist.length;u++){
	var yy={};
	var strkh=(data.PrestoreCardSoldlist)[u].prestoreCard.prestore_card_name+"(卡号:"+(data.PrestoreCardSoldlist)[u].prestore_card_sold_id+")";
	yy.text=strkh;
	kkname.push(yy);
}
	var str='';
    flag = arguments[1]?arguments[1]:false;
	if(typeof data.list!='undefined'){
		var list=data.list;
		if(list.length>0){
			for(var i=0;i<list.length;i++){
				var usertime='';//消费时间
				if(typeof (list[i].use_time)!='undefined'){
					usertime=list[i].use_time;
				}
				var usermoney=0;//使用金额
				usermoney=(list[i].prestoreCard.face_value-list[i].card_balance).toFixed(2);//总金额减余额
				var supname=list[i].prestoreCard.supplierShop.supshop_name;//仓储名称
				var kh=list[i].prestore_card_sold_id;//卡号
				var kname=list[i].prestoreCard.prestore_card_name;
				var href='/yich/wapservice/dist/html/PreMemoryCardDetails.html?prestoreCardsoldId='+list[i].prestore_card_sold_id;
				var img=func.imgsize(list[i].prestoreCard.supplierShop.shop_logo,'@100w_100h');
				str+=[
					'<li>',
					'<div class="dd_left">',
						'<a class="span_toux" href="'+href+'"><img src="'+img+'"/></a>',
						'<div class="divxx">',
							'<p class="cc_name">'+supname+'</p>',
							'<span class="yck_more">'+kname+'</span>',
							'<span class="kh">卡号:'+kh+'</span>',
						'</div>',
					'</div>',
					'<div class="dd_right">',
						'<span class="span_price">'+usermoney+'</span>',
						'<span class="span_date">'+usertime+'</span>',
					'</div>',
					'<input type="hidden" value="'+list[i].prestore_card_sold_id+'"/>',
					'</li>',
				      ].join('');
			}
			if(flag){
				$(".dllist").html(str);
			}else{
				$(".dllist").append(str);
			}
		}else{
			$(".list").html(str);
		}
  		
	}
	 if($(".dllist").children("li").length==0){
  		$(".nodata").css("display","block");
  		$(".card_main").css("display","none");
  	}else{
  		$(".nodata").css("display","none");
  		$(".card_main").css("display","block");
  	}
};
