$(function(){
	$(".alink_sysj").click(function(){
		$(".rightmorelist,.yingying").css("display","none");
		window.location.href="/yich/wapservice/dist/html/PreMemoryCardData.html";
	});
	$(".alink_sxyck").click(function(){
		$(".rightmorelist,.yingying").css("display","none");
		window.location.href="/yich/wapservice/dist/html/PreMemoryFailureCard.html";
	});
	$(".align").click(function(){
		var val=$.trim($(this).children("span").text());
		$(".pxlist").css("display","none");
		$(".yingying").css("z-index",8);
		if(val=='按时间'){
			$(".yingying,.px_time").css("display","block");
			_htmlScrollPok();
		}else if(val=='按折扣'){
			$(".yingying,.px_zhekou").css("display","block");
			_htmlScrollPok();
		}else if(val=='按金额'){
			$(".yingying,.px_jine").css("display","block");
			_htmlScrollPok();
		}
	});
	$(".pxlist").children("li").click(function(){
		var n=$.trim($(this).attr("n"));
		page=0;
		sort=n;
		$(".list").html('');
		dropload_obj.opts.loadDownFn(dropload_obj);
		$(".yingying,.pxlist").css("display","none");
		_htmlScrollOk();
	});
$(".rightmore").click(function(){
	$(".yingying").css("z-index",10);
	$(".yingying,.rightmorelist").css("display","block");
	_htmlScrollPok();
});
$(".yingying").click(function(){
	$(".yingying,.pxlist,.rightmorelist").css("display","none");
	_htmlScrollOk();
});
})
//加载数据
var strdom = function(data,flag){
	var str='';
    flag = arguments[1]?arguments[1]:false;
	if(typeof data.prestoreCardSoldList!='undefined'){
		var list=data.prestoreCardSoldList;
		if(list.length>0){
		  for(var i=0;i<list.length;i++){
			  var money=0;
			  if(typeof (list[i].prestoreCard.face_value)!='undefined'){
				  money=(list[i].prestoreCard.face_value*1).toFixed(2);
			  }
			  var name='';//卡名
			  if(typeof (list[i].prestoreCard.prestore_card_name)!='undefined'){
				  name=list[i].prestoreCard.prestore_card_name;
			  }
			  var supname='';//仓储名称
			 if(typeof (list[i].prestoreCard.supplierShop.supshop_name)!='undefined'){
				  supname=list[i].prestoreCard.supplierShop.supshop_name;
			  }
			  var ye='';//未使用金额
			  if(typeof (list[i].card_balance)!='undefined'){
				  ye=(list[i].card_balance).toFixed(2);
			  }
			  var href='/yich/wapservice/dist/html/cardDetails.html?prestoreCardsoldId='+list[i].prestore_card_sold_id+"&is_invalid=1";
			  var ccindex='/yich/wapservice/dist/html/WarehouseHome.html?supId='+list[i].prestoreCard.supplierShop.supshop_id;
			  str+=[
					'<li>',
					'<img src="../images/bg8.png"/>',
					'<a href="'+href+'" class="bglink"></a>',
					'<div class="m">',
						'<div class="m_left">',
							'<div class="mleft_top">',
								'<p class="mltop_left"><span>'+list[i].prestoreCard.discount+'</span>折</p>',
								'<p class="mltop_right">￥<span>'+money+'</span></p>',
							'</div>',
							'<p class="ysk_name">'+name+'</p>',
							'<p class="ysk_text">'+supname+'</p>',
						'</div>',
						'<div class="m_right">',
							'<span class="n">未使用金额:</span>',
							'<p class="price">￥<span>'+ye+'</span></p>',
							//'<input type="button" value="立即使用" class="ljsy"/>',
							'<a href="'+ccindex+'" class="ljsy">立即使用</a>',
						'</div>',
					'</div>',
					'</li>',
			        ].join('');
		  }
			
			if(flag){
				$(".list").html(str);
			}else{
				$(".list").append(str);
			}
		}else{
			$(".list").html(str);
		}
  		
	}
	if($(".list").children("li").length==0){
		$(".nodata").css("display","block");
		$("#content").css("display","none");
	}else{
		$(".nodata").css("display","none");
		$("#content").css("display","block");
	}
};