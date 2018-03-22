var search=(window.location.href).split("?");
if(search.length>1){
	var arr=search[1].split("&");
	for(var i=0;i<arr.length;i++){
		 var k=arr[i].split('=');
		 if(k[0]=='supid'){
			 supshopId=k[1];
			 break;
		 }
	}
}
$(function(){
	//帅选
	$(".align").click(function(){
		var val=$(this).children("span").text();
		if(val=='按销量'){
			page=0;
			sort=1;
			$(".list").html('');
			dropload_obj.opts.loadDownFn(dropload_obj);
		}else if(val=='按折扣'){
			$(".pxlist").css("display","none");
			$(".yingying").css("z-index",8);
			$(".tophead").css("z-index",9);
			$(".zhekou,.yingying").css("display","block");
		}else if(val=='按面额'){
			$(".pxlist").css("display","none");
			$(".yingying").css("z-index",8);
			$(".tophead").css("z-index",9);
			$(".miane,.yingying").css("display","block");
		}
	});
$(".pxlist").children("li").click(function(){
	var type=$(this).attr("n");
	$(".pxlist,.yingying").css("display","none");
	page=0;
	sort=type;
	$(".list").html('');
	dropload_obj.opts.loadDownFn(dropload_obj);
});
//什么是预存卡
$(".rightmore").click(function(){
	$(".tophead").css("z-index",5);
	$(".awhatka,.yingying").css("display","block");
});
$(".divclose").children("i").click(function(){
	$(".yingying,.pxlist,.awhatka,.gmxy").css("display","none");
});
$(".yingying").click(function(){
	$(".yingying,.pxlist,.awhatka,.gmxy").css("display","none");
});
var toph=parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(108));
var topb=parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(176));
var mianh=$("body").height()*0.8-toph-topb;
$(".miantxt").css("height",mianh+"px");
})
//加载数据
var strdom = function(data,flag){
	var str='';
    flag = arguments[1]?arguments[1]:false;
	if(typeof data.prestoreCardList!='undefined'){
		var list=data.prestoreCardList;
		if(list.length>0){
		   for(var i=0;i<list.length;i++){
			   var money=(list[i].face_value).toFixed(2);
			   var name='';
			   var n=0;
			   var kc=0;
			   if(typeof (list[i].prestore_card_name)!='undefined'){
				   name=list[i].prestore_card_name;
			   }
			   if(typeof (list[i].sold_num)!='undefined'){
				   n=list[i].sold_num;
			   }
			   if(typeof (list[i].stock_num)!='undefined'){
				   kc=list[i].stock_num;
			   }
			   str+=[
					'<li>',
					'<img src="../images/bg8.png"/>',
					'<div class="m">',
						'<div class="m_left">',
							'<div class="mleft_top">',
								'<p class="mltop_left"><span>'+list[i].discount+'</span>折</p>',
								'<p class="mltop_right">￥<span>'+money+'</span></p>',
							'</div>',
							'<p class="ysk_name buy_yckname">'+name+'</p>',
						'</div>',
						'<div class="m_right">',
							'<span class="n">已售:'+n+'张</span>',
							'<p class="price"><span>库存:'+kc+'张</span></p>',
							'<input type="hidden" value="'+list[i].prestore_card_id+'" class="prestore_card_id"/>',
							'<input type="button" value="购买" class="ljsy"/>',
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
//	cz();
	if($(".list").children("li").length==0){
		$("#content").css("display","none");
		$(".nodata").css("display","block");
	}
};
/*function cz(){
//购买
var prestore_card_id='';
var payNum='';
var total_fee='';
$(".ljsy").click(function(){
	prestore_card_id=$(this).siblings(".prestore_card_id").val();
    $.ajax({
        type:"POST",
        url:"/yich/PrestorecardPayServlet",
        dataType:"json",
        data:{
        	 "prestoreCardId":prestore_card_id,
        },
        success: function(data){
          if(typeof (data.total_fee)!='undefined' && data.total_fee>0){
        	  $(".gmxy").css("display","block");
        	  payNum=data.payNum;
        		$(".yingying").css("z-index",10);
        		$(".yingying").css("display","block");
          }
        },
        error: function(){
            console.log('Ajax error!');
        }
    });	
});
$(".btn1").click(function(){
	window.location.href='/yich/wapservice/dist/html/checkoutCounter.html?payNum='+payNum;
});
};*/
//购买
var prestore_card_id='';
var payNum='';
var total_fee='';
$(document).on("click",".ljsy",function(){
	prestore_card_id=$(this).siblings(".prestore_card_id").val();
    $.ajax({
        type:"POST",
        url:"/yich/PrestorecardPayServlet",
        dataType:"json",
        data:{
        	 "prestoreCardId":prestore_card_id,
        },
        success: function(data){
          if(typeof (data.total_fee)!='undefined' && data.total_fee>0){
        	  $(".gmxy").css("display","block");
        	  payNum=data.payNum;
        		$(".yingying").css("z-index",10);
        		$(".yingying").css("display","block");
          }
        },
        error: function(){
            console.log('Ajax error!');
        }
    });	
});
$(document).on("click",".btn1",function(){
	window.location.href='/yich/wapservice/dist/html/checkoutCounter.html?payNum='+payNum;
});
