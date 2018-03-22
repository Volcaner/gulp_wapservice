$(document).ready(function(){
	var newRefund = 0;
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
	$.ajax({
		type: 'POST',
		url: '/yich/PhoneApplyRefundServlet',
		dataType: 'json',
		data: {'orderId':orderId},
		//data: {'orderId':'20170823103826106626'},
		success: function(res){
			if(res.ApplicationNote){
				if(res.ApplicationNote.picture){
					var wh={
							w:parseInt(parseFloat(getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
							h:parseInt(parseFloat(getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
					};
					var whe="@"+wh.w+"w_"+wh.h+"h";
					var _src=imgsize(res.ApplicationNote.picture,whe);
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
				if(res.ApplicationNote.payment){
					$('.payment').text(parseFloat(res.ApplicationNote.payment).toFixed(2));
					newRefund = res.ApplicationNote.payment;
				}
			}
			$('.logmoney').text(parseFloat(res.logmoney).toFixed(2));
			
		},
		error: function(res){
			
		}
	})
	$('.submit').click(function(){
		$.ajax({
			type: 'POST',
			url: '/yich/PhonePendingExamine',
			dataType: 'json',
			data: {'s_text':$('.reason').text(),'t_text':$('.applymes').text(),'return_money':$('.refund').val(),proName:$('.title').text(),
				   'sku':$('.sku').text(),'src':$('.header').attr('src'),'enter':'','retLogMoney':$('.logmoney').text(),orderId:orderId},
			success: function(res){
				if(res.result>=1){
					window.location.replace('/yich/wapservice/dist/html/afterSalseDetail.html?orderId='+orderId);
				}
			},
			error: function(res){
				
			}
		})
	});
	$('.refund').bind('input propertychange',function(){
		if(parseFloat($(this).val())>parseFloat(newRefund)){
			$(this).val(newRefund);
		}
		if($(this).val()&&$('.reason').text()!='请选择'){
			$('.submit').removeAttr('disabled');
			$('.submit').addClass('red');
		}else{
			$('.submit').attr('disabled',true);
			$('.submit').removeClass('red');
		}
	});
});
//img-size
function imgsize(src,size){
	if((src).indexOf('http://ngsimage')==-1){
		var imgsrc=(src);
		return imgsrc;
	}else{
		var oss_img='';
		var src_oss=(src).split(".");
		src_oss.splice(src_oss.length-1,1);
		var left_ossimg=src_oss.join('.');
		var srclast_oss=src.split('.');
		srclast_oss=srclast_oss[srclast_oss.length-1];
		var a_oss=srclast_oss.split("jpg").length
		var c_oss=srclast_oss.split("png").length
		var e_oss=srclast_oss.split("jpeg").length
		var g_oss=srclast_oss.split("JPG").length
		var i_oss=srclast_oss.split("PNG").length
		var k_oss=srclast_oss.split("JPEG").length
		var o_oss=srclast_oss.split("gif").length
		var m_oss=srclast_oss.split("GIF").length
		if(a_oss>1){
			oss_img=left_ossimg+'.jpg'
		}else if(c_oss>1){
			oss_img=left_ossimg+'.png'
		}else if(e_oss>1){
			oss_img=left_ossimg+'.jpeg'
		}else if(g_oss>1){
			oss_img=left_ossimg+'.JPG'
		}else if(i_oss>1){
			oss_img=left_ossimg+'.PNG'
		}else if(k_oss>1){
			oss_img=left_ossimg+'.JPEG'
		}else if(o_oss>1){
			oss_img=left_ossimg+'.gif'
		}else if(m_oss>1){
			oss_img=left_ossimg+'.GIF'
		}else{
			oss_img=(src);
		}
		var imgsrc=oss_img.replace("oss-","img-");
		imgsrc=imgsrc+size;
	    return imgsrc;
	}
}
function getStyle(obj, attr)
{
	if(obj.currentStyle)
	{
		return obj.currentStyle[attr];
	}
	else
	{
		return getComputedStyle(obj, false)[attr];
	}
}