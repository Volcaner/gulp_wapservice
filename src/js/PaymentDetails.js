var aliPayNum='';
var zsstate='';
$(function(){
	var href=(window.location.href).split("?");
	/*if(href.length>1){
		var search=href[1];
		
		aliPayNum=(search.split("="))[1];
	}*/
	if(href.length>1){
		var sarr=href[1].split("&");
		for(var v=0;v<sarr.length;v++){
			var k=sarr[v].split("=");
			if(k[0]=='aliPayNum'){
				aliPayNum=k[1];
			}else if(k[0]=='payType'){
				if(k[1]==5){
					zsstate="转售-"
				}
			}
		}
	}
	   $.ajax({
           type:"POST",
           url:"/yich/PhonePaymentDetails",
           dataType:"json",
           data:{
               "aliPayNum":aliPayNum,
           },
           success: function(data){
        	   if(typeof (data.userId)!='undefined'){
        		    func.fwh_authorize(data.userId);
        		}
            //   authorize(json);
             //  checkErrorAjax(json);
           dom(data);
           },
           error: function(){
               console.log('Ajax error!');
           }
       });
})

function dom(data){
	var str='';
	if(typeof data.list!='undefined'){
	  var list=data.list;
	  if(list.length>0){
		  for(var i=0;i<list.length;i++){
			  var title='';
			  if(typeof list[i].supplierShop!='undefined' && typeof list[i].supplierShop.supshop_name!='undefined'){
				  title=list[i].supplierShop.supshop_name;
			  }
			  var je='0.00';//金额
			  if(typeof list[i].payment!='undefined'){
				  je=(list[i].payment).toFixed(2);
			  }
			  var str2='';
			  if(typeof list[i].tradeOrderList!='undefined' && list[i].tradeOrderList.length>0){
				 for(var j=0;j<list[i].tradeOrderList.length;j++){
					 var src='';//图片路径
					 if(typeof (list[i].tradeOrderList)[j].shopInv!='undefined' && typeof (list[i].tradeOrderList)[j].shopInv.product!='undefined' && typeof (list[i].tradeOrderList)[j].shopInv.product.proImage!='undefined' && typeof (list[i].tradeOrderList)[j].shopInv.product.proImage.src!='undefined'){
						 src=(list[i].tradeOrderList)[j].shopInv.product.proImage.src;
					 }
					 var wh={
								w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
								h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
						};
						var whe="@"+wh.w+"w_"+wh.h+"h";
						src=func.imgsize(src,whe);//图片
					 var wb='';//文本
					 if(typeof (list[i].tradeOrderList)[j].title!='undefined'){
						 wb=(list[i].tradeOrderList)[j].title;
					 }
					 var sku='';
					 if(typeof (list[i].tradeOrderList)[j].skuPropertiesName!='undefined'){
						 sku=(list[i].tradeOrderList)[j].skuPropertiesName;
					 }
					 var sl=0;//数量
					 if(typeof (list[i].tradeOrderList)[j].traAmount!='undefined'){
						 sl=(list[i].tradeOrderList)[j].traAmount;
					 }
					  str2+=[
								'<div class="spdiv">',
								'<a href="" class="l_img"><img src="'+src+'"/></a>',
								'<div class="r_div">',
									'<div class="rl_wb">',
										'<p>'+zsstate+wb+'</p>',
										'<span>'+sku+'</span>',
									'</div>',
									'<span class="rr_num">×'+sl+'</span>',
								'</div>',
								'</div>',
						         ].join('');
				 }
			  }
			  str+=[
					'<li>',
					'<div class="t">',
						'<span class="t_l">'+title+'</span>',
						'<p class="t_r">订单金额：<span>￥'+je+'</span></p>',
					'</div>',
					str2,
					'</li>',
			        ].join('');
		  }
	  }
	}
	$(".listlb").html(str);
	var t=0;
	var type='';
	if(typeof data.Pay!='undefined' && typeof data.Pay.time!='undefined'){
		t=data.Pay.time;
		$(".hiddenval").text(t);
	}
    if(typeof data.Pay!='undefined' && typeof data.Pay.payStatus!='undefined'){
    	type=data.Pay.payStatus;
 	   if(data.Pay.payStatus=='NEW'){
 		   $(".listlb").removeClass("nodjs");
 		   $(".topdjs,.bottomzfbtn").css("display","block");
 		   change_djs(t,type);
 	   }else if(data.Pay.payStatus=='SUCCESS'){
 		  $(".topdjs,.bottomzfbtn").remove();
 		  $("body").addClass("yizhifu");
 	   }else{
 		   $(".listlb").addClass("nodjs");
 		   $(".topdjs,.bottomzfbtn").css("display","none");
 	   }
    }else{
 	   $(".listlb").addClass("nodjs");
		   $(".topdjs,.bottomzfbtn").css("display","none");
    }
    $('body').css("display","block");
    if($(".listlb").children("li").length==0){
    	$(".topdjs,.listlb,.bottomzfbtn").css("display","none");
    	$(".nodata").css("display","block");
    }else{
    	$(".topdjs,.listlb,.bottomzfbtn").css("display","block");
    	$(".nodata").css("display","none");
    }
}

//关闭支付
var gbzfbtn='';
$(".gbzf").click(function(){
	$("#yingying,.alertmodel").css("display","block");
	$(".alertmodel").css("marginTop",(-$(".alertmodel").height()/2)+"px");
	gbzfbtn=$(this);
});
//隐藏框
$(".alertmodel_cancal").click(function(){
	$("#yingying,.alertmodel").css("display","none");
});
//确定
$(".alertmodel_sure").click(function(){
   sure();
});
function sure(){
	var j={
			 payNum:aliPayNum,
	 };
	$.ajax({
		type:"POST",
		url:"/yich/PayOff",
		 data:JSON.stringify(j),
		success:function(data){
			if(typeof (data.userId)!='undefined'){
			    func.fwh_authorize(data.userId);
			}
			console.log(data);
			var o=data;
			if(o.flag==0){
				alert('关闭失败');
			}else{
				$("#yingying,.alertmodel").css("display","none");
			};
		}
	})
};

function change_djs(t,type){
	//console.log(t);
	if(type=='NEW' && t<=0){
		sure();
		
	}else{
		var timer=null;
		timer=setInterval(function(){
			d(); 
		},1000);
		d();
		function d(){
			var m=parseInt(+$(".hiddenval").text());
			var tt=m-1;
			var days = Math.floor(tt / 1440 / 60);
			var hours = Math.floor((tt - days * 1440 * 60) / 3600);
			var minutes = Math.floor((tt - days * 1440 * 60 - hours * 3600) / 60);
			var seconds = (tt - days * 1440 * 60 - hours * 3600 - minutes *60);
			$(".hiddenval").text(tt);
			$(".minutes").text(tozero(minutes));
			$(".secods").text(tozero(seconds));
			if(tt<=0){
				clearInterval(timer);
				sure();
			}
		};
	}
};
//支付
$(document).on("click",".zf",function(){
	window.location.href='/yich/wapservice/dist/html/checkoutCounter.html?payNum='+aliPayNum;
});
function tozero(t){
    return (t<10)?'0'+t:t;
}