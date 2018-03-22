function fwh_authorize(userId){
	if((typeof userId=='undefined') || (!userId)){
		  window.location.href= "/yich/PhoneClickWechatButton";
	  }
}
$(document).ready(function(){
	$.ajax({
		type: 'POST',
		url: '/yich/PhoneUserBindInfoServlet',
		dataType: 'json',
		success: function(res){
			if(typeof (res.userId)!='undefined'){
       		 fwh_authorize(res.userId);
       	 }
			var alipayHref = '/yich/wapservice/dist/html/alipay_binding.html';
			if(res.bu){
				if(res.bu.tel){
					$('.phoneNum').text(res.bu.tel);
					$('.turnPhoneBinding').attr('href','/yich/wapservice/dist/html/phone_binding.html?tel='+res.bu.tel)
				}else{
					$('.phoneNum').text('请绑定');
				}
				if(res.bu.alipay&&res.bu.alipay_name){
					$('.accountBounded').text(res.bu.alipay);
					//$('.nameBounded').text(res.bu.alipay_name);
					$('.turnAlipayBinding').attr('href','/yich/wapservice/dist/html/alipay_binding.html?alipay_account='+res.bu.alipay+'&alipay_name='+res.bu.alipay_name);
				}else if(res.bu.alipay){
					$('.accountBounded').text(res.bu.alipay);
					$('.turnAlipayBinding').attr('href','/yich/wapservice/dist/html/alipay_binding.html?alipay_account='+res.bu.alipay);
				}else if(res.bu.alipay_name){
					$('.nameBounded').text(res.bu.alipay_name);
					$('.turnAlipayBinding').attr('href','/yich/wapservice/dist/html/alipay_binding.html?alipay_name='+res.bu.alipay_name);
				}
			}else{
				$('.phoneNum').text('请绑定');
				$('.unbound').text('请绑定');
			}
		},
		error: function(res){
			
		}
	})
});