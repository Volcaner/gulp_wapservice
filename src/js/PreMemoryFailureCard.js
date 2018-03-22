//加载数据
var strdom = function(data,flag){
	var str='';
    flag = arguments[1]?arguments[1]:false;
	if(typeof data.prestoreCardSoldList!='undefined'){
		var list=data.prestoreCardSoldList;
		if(list.length>0){
		  for(var i=0;i<list.length;i++){
			  var ye='0.00';
			  if(typeof(list[i].prestoreCard.face_value)!='undefined'){
				  ye=(list[i].prestoreCard.face_value*1).toFixed(2);
			  }
			  var name='';
			  if(typeof (list[i].prestoreCard.prestore_card_name)!='undefined'){
				  name=list[i].prestoreCard.prestore_card_name;
			  }
			  var supname='';
			  if(typeof (list[i].prestoreCard.supplierShop.supshop_name)!='undefined'){
				  supname=list[i].prestoreCard.supplierShop.supshop_name;
			  }
			  var jine=0;
			  if(typeof (list[i].card_balance)!='undefined'){
				  jine=(list[i].card_balance*1);
			  }
			  var xfstr='';
			  if(jine*1>0){
				  xfstr='<span class="n">退款成功</span><p class="price">￥<span>'+jine+'</span></p>';
			  }else{
				  xfstr='<span class="n">已消费完</span><p class="price hidden">￥<span>'+jine+'</span></p>';
			  }
			  var href='/yich/wapservice/dist/html/cardDetails.html?prestoreCardsoldId='+list[i].prestore_card_sold_id+"&is_invalid=0";
			  str+=[
					'<li>',
					'<img src="../images/bg6.png"/>',
					'<a href="'+href+'" class="alink"></a>',
					'<div class="m">',
						'<div class="m_left">',
							'<div class="mleft_top">',
								'<p class="mltop_left hui"><span>'+list[i].prestoreCard.discount+'</span>折</p>',
								'<p class="mltop_right hui">￥<span>'+ye+'</span></p>',
							'</div>',
							'<p class="ysk_name">'+name+'</p>',
							'<p class="ysk_text">'+supname+'</p>',
						'</div>',
						'<div class="m_right">',
						    xfstr,
							'<input type="button" value="删除" class="remove"/>',
							'<input type="hidden" value="'+list[i].prestore_card_sold_id+'" class="removehidden"/>',
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
		$(".listcard").css("display","none");
		$(".nodata2").css("display","block");
	}else{
		$(".listcard").css("display","block");
		$(".nodata2").css("display","none");
	}
//	cz();
};
var kaid='';
//$(".remove").click(function(){
$(document).on("click",".remove",function(){
	kaid=$(this).siblings(".removehidden").val();
	var _this=this;
	$.ajax({
        type:"POST",
        url:"/yich/PrestoreCardRefundServlet",
        dataType:"json",
        data:{
        	 "prestoreCardSoldId":kaid,
             "state":'delete',
        },
        success: function(json){
        	if(typeof (json.userId)!='undefined'){
        	    func.fwh_authorize(json.userId);
        	}
         if(json.flag!=1){
        	 alert("删除失败！");
         }else{
        	 $(_this).closest("li").remove();
         }
        },
        error: function(){
            console.log('Ajax error!');
        }
    });	
});
/*function cz(){
	var kaid='';
	$(".remove").click(function(){
		kaid=$(this).siblings(".removehidden").val();
		var _this=this;
		$.ajax({
            type:"POST",
            url:"/yich/PrestoreCardRefundServlet",
            dataType:"json",
            data:{
            	 "prestoreCardSoldId":kaid,
                 "state":'delete',
            },
            success: function(json){
            	if(typeof (json.userId)!='undefined'){
            	    func.fwh_authorize(json.userId);
            	}
             if(json.flag!=1){
            	 alert("删除失败！");
             }else{
            	 $(_this).closest("li").remove();
             }
            },
            error: function(){
                console.log('Ajax error!');
            }
        });	
	});
};*/