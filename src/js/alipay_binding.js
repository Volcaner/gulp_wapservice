$(document).ready(function(){
	var prompt = new promptFunc();
	var alipay = '';
	var alipay_name = '';
	if(window.location.search.length>0){
		var items = window.location.search.substring(1).split('&');
		for(var i = 0; i <items.length; i++){
			var item = items[i].split('=');
			if(item[0] == 'alipay_account'){
				alipay = decodeURI(item[1]);
			}else if(item[0] == 'alipay_name'){
				alipay_name = decodeURI(item[1]);
			}
		}
	}
	if(alipay&&alipay_name){
		$('.boundDomain').show();
		$('.account').text(alipay);
		$('.name').text(alipay_name);
	}else{
		$('.unboundDomain').show();
		if(alipay){
			$('.alipayAccountInput').val(alipay);
		}else if(alipay_name){
			$('.nameInput').val(alipay_name);
		}
	}	
	$('.confirmClick').click(function(){
		$('.boundDomain').hide();
		$('.unboundDomain').show();
	});
	$('.confirmSure').click(function(){
		$.ajax({
			type: 'POST',
			url: '/yich/PhoneUpdateBundAlipay',
			dataType: 'json',
			data:{alipay:$('.alipayAccountInput').val(),name:$('.nameInput').val()},
			success: function(res){
				if(typeof (res.userId)!='undefined'){
		       		 func.fwh_authorize(res.userId);
		       	 }
				if(res.result == 1){
					prompt.init({
						type:"",
						text:"绑定成功",
					});
					setTimeout(function(){
						window.location.replace('/yich/wapservice/dist/html/account_binding.html');
					},1000);
				}else{
					prompt.init({
						type:"",
						text:"绑定失败",
					});
				}
			},
			error: function(res){
				prompt.init({
					type:"",
					text:"绑定失败",
				});
			}
		})
	});
	$('.alipayAccountInput').bind('input propertychange',function(){
		if($(this).val()&&$('.nameInput').val()){
			$('.sure').removeAttr('disabled');
			$('.sure').removeClass('confirmSure');
			$('.sure').addClass('confirmClick');
		}else{
			$('.sure').attr('disabled',true);
			$('.sure').removeClass('confirmClick');
			$('.sure').addClass('confirmSure');
		}
	});
	//联系座机输入框失去焦点
	$('.nameInput').bind('input propertychange',function(){
		if($(this).val()&&$('.alipayAccountInput').val()){
			$('.sure').removeAttr('disabled');
			$('.sure').removeClass('confirmSure');
			$('.sure').addClass('confirmClick');
		}else{
			$('.sure').attr('disabled',true);
			$('.sure').removeClass('confirmClick');
			$('.sure').addClass('confirmSure');
		}
	});

});