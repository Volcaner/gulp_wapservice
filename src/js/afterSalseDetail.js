$(document).ready(function(){
	var timer = '';
	var refund = 0;
	var istime = '';
	var retId = '';
	if(window.localStorage.retId){
		retId = window.localStorage.retId;
	}
	var orderId = '';
	var qs = window.location.search.length > 0 ? window.location.search.substring(1) : '';
	var items = qs.length? qs.split('&'):'';
	if(items){
		for(var i = 0; i < items.length; i++){
			var arr = items[i].split('=');
			var key = arr[0];
			var value = arr[1];
			if(key == 'orderId'){
				orderId = value;
			}
		}
	}
	$('.moreRecord').attr('href','/yich/wapservice/dist/html/afterSalseList.html?orderId='+orderId);
	$.ajax({
		type: 'POST',
		url: '/yich/PhoneApplyRefundServlet',
		dataType: 'json',
		data: {'orderId':orderId,'retId':retId},
		//data: {'orderId':'20170823103826106626','retId':retId},
		success: function(res){
			if(typeof (res.userId)!='undefined'){
       		 func.fwh_authorize(res.userId);
       	 }
			if(res.ApplicationNote){
				if(res.ApplicationNote.picture){
					var wh={
							w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
							h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
					};
					var whe="@"+wh.w+"w_"+wh.h+"h";
					var _src=func.imgsize(res.ApplicationNote.picture,whe);
					$('.header').attr('src',_src);
				}
				if(res.ApplicationNote.title){
					$('.title').text(res.ApplicationNote.title);
				}
				if(res.ApplicationNote.sku_properties_name){
					$('.sku').text(res.ApplicationNote.sku_properties_name);
				}
				if(res.ApplicationNote.price){
					$('.price').text(res.ApplicationNote.price);
				}
				if(res.ApplicationNote.tra_amount){
					$('.count').text('x'+res.ApplicationNote.tra_amount)
				}
				if(res.ApplicationNote.ref_total_price){
					$('.refund').text(res.ApplicationNote.ref_total_price);
					refund = res.ApplicationNote.ref_total_price;
				}
				if(res.ApplicationNote.ret_rea){
					$('.reason').text(res.ApplicationNote.ret_rea);
				}
				if(res.ApplicationNote.ret_explain && res.ApplicationNote.ret_explain!='说明：'){
					$('.applicationInstruction').show();
					$('.explain').text(res.ApplicationNote.ret_explain);
				}
				if(res.ApplicationNote.oper_time){
					$('.applyTimeP').show();
					if(res.ApplicationNote.oper_time.substring(res.ApplicationNote.oper_time.length-2) == '.0'){
						$('.applyTime').text(res.ApplicationNote.oper_time.substring(0,res.ApplicationNote.oper_time.length-2));
					}else{
						$('.applyTime').text(res.ApplicationNote.oper_time);
					}					
				}
				if(res.ApplicationNote.supshop_name){
					$('.shopName').text(res.ApplicationNote.supshop_name);
				}
				if(res.ApplicationNote.tel || res.ApplicationNote.mobile){
					$('.telP').show();
					var tel = res.ApplicationNote.mobile?res.ApplicationNote.mobile:res.ApplicationNote.tel?res.ApplicationNote.tel:"无";
					$('.tel').text(tel);
				}
				if(res.ApplicationNote.landline_tel){
					$('.landlineP').show();
					var landline_tel = res.ApplicationNote.landline_tel?res.ApplicationNote.landline_tel:"无";
					$('.landline').text(landline_tel);
				}
				if(res.initTimeOfTimeOut){
					timer= res.initTimeOfTimeOut;
				}
				if(res.ret_order_state=='Y'){
					$('.asd_head').show();
					$('.asd_apply').show();
					var dd=parseInt(timer/86400000);
					var hh=parseInt(timer%86400000/3600000);
					var mm=parseInt(timer%86400000%3600000/60000);
					var ss=parseInt(timer%86400000%3600000%60000/1000);
					dd=String(dd);
					hh=String(hh);
					mm=String(mm);
					ss=String(ss);
					hh=hh.length<2?('0'+hh):hh;
					mm=mm.length<2?('0'+mm):mm;
					ss=ss.length<2?('0'+ss):ss;	
					$('.tips').text('还剩'+dd+'天'+hh+'时'+mm+'分'+ss+'秒');
					istime = setInterval(runtime,1000);
				}else if(res.ret_order_state=='T'){
					$('.asd_head').show();
					$('.asd_apply').hide();
					$('.tips').show();
					$('.comment').text('仅退款完成！');
					$('.tips').text('退款金额：'+ refund + '元');
				}else if(res.ret_order_state=='N'){
					$('.asd_head').show();
					$('.asd_apply').hide();
					$('.comment').text('仅退款关闭！');
					$('.tips').hide();
				}
				if(res.retId){
					window.localStorage.retId=res.retId;
				}
			}
		},
		error: function(res){
			
		}
	})
	
	function runtime(){
		timer-=1000;
		if(timer<999){
			clearInterval(istime);
			istime=null;
			$.ajax({
				type:"post",
				url:"/yich/TimeOutExamePassingAndPassedservlet",
				dataType:"json",
				data:{'orderId':orderId},
				//data:{'orderId':'20170823103826106626'},
				success:function(data){
					if(typeof (data.userId)!='undefined'){
		        		 func.fwh_authorize(data.userId);
		        	 }
					//404
					checkErrorAjax(data);
					if(data.result >= 1){
						$('.comment').text('仅退款完成！');
						$('.tips').show();
						$('.tips').text('退款金额：'+ refund + '元');
					}
				},
				error:function(err){
					
				},
			})
		}else{
			var dd=parseInt(timer/86400000);
			var hh=parseInt(timer%86400000/3600000);
			var mm=parseInt(timer%86400000%3600000/60000);
			var ss=parseInt(timer%86400000%3600000%60000/1000);
			dd=String(dd);
			hh=String(hh);
			mm=String(mm);
			ss=String(ss);
			hh=hh.length<2?('0'+hh):hh;
			mm=mm.length<2?('0'+mm):mm;
			ss=ss.length<2?('0'+ss):ss;	
			$('.tips').text('还剩'+dd+'天'+hh+'时'+mm+'分'+ss+'秒');
		}	
	}
	$('.revoke').click(function(){
		var message="撤销后，申请将自动关闭，确定吗?";
		function revoke(){
			$.ajax({
				type:"post",
				url:"/yich/PhoneRetuenGoodsClose",
				dataType:"json",
				data:{'orderId':orderId},
//				data:{'orderId':'20170823103826106626'},
				success:function(data){
					if(typeof (data.userId)!='undefined'){
		        		 func.fwh_authorize(data.userId);
		        	 }
					//404
					checkErrorAjax(data);
					if(data.result >= 1){
						$('.asd_head').show();
						$('.asd_apply').hide();
						$('.tips').hide();
						$('.comment').text('仅退款关闭！');
						clearInterval(istime);
					}
				},
				error:function(err){
					
				},
			})
		}
		chekMTfunc(message,revoke);	
	});
	$('.look').click(function(){
		window.location.href = '/yich/wapservice/dist/html/orderAllGoods.html';
	});
});