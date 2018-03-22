$(document).ready(function(){
	var prompt = new promptFunc();
	var oldPhoneNum = '';
	if(window.location.href.indexOf('tel=')>0){
		oldPhoneNum = window.location.href.split('=')[1];
		$('.bindingNum').text(oldPhoneNum);
		$('.number').text(oldPhoneNum);
	}
	$('.changeBindingPhone').click(function(){
		$('.bindingPhoneDomain').hide();
		$('.changeBindingPhoneDomain').show();
	})
	$('.identifyingBtn').click(function(){
		$(this).attr('disabled',true);
		$(this).removeClass();
		$(this).addClass('click-btn-noclick clickFloatRight identifyingBtn');
		$(this).text('倒计时30秒');
		$.ajax({
			type: 'POST',
			url: '/yich/PhoneSetTelCodeServlet',
			dataType: 'json',
			data:{option:'obt'},
			success: function(res){
				if(typeof (res.userId)!='undefined'){
				    fwh_authorize(res.userId);
				}
				if(res.result == 1){
					console.log('success');
				}
			},
			error: function(res){
				
			}
		});
		var _this = this;
		var time = 30;
		var timer = setInterval(function(){
			if(time <= 0){
				$(_this).removeAttr('disabled');
				$(_this).removeClass();
				$(_this).addClass('click-btn-redcolor clickFloatRight identifyingBtn');
				$(_this).text('获取验证码');
				clearInterval(timer);
			}else{
				$(_this).text('倒计时' + --time +'秒');
			}
		},1000);
	});
	//实时监听验证码输入
	$('.oldIdentifyingCode').bind('input propertychange',function(){
		if($(this).val()){
			$('.next').removeAttr('disabled');
			$('.next').removeClass('confirmNext');
			$('.next').addClass('confirmClick');
		}else{
			$('.next').attr('disabled',true);
			$('.next').removeClass('confirmClick');
			$('.next').addClass('confirmNext');
		}
	});
	$('.next').click(function(){
		$.ajax({
			type: 'POST',
			url: '/yich/PhoneCheckTelCodeServlet',
			dataType: 'json',
			data:{hcode:$('.oldIdentifyingCode').val(),option:'obt',tel:oldPhoneNum},
			success: function(res){
				if(res.res != 1){
					prompt.init({
						type:"",
						text:"验证码输入有误",
					});
				}else{
					$('.changeBindingPhoneDomain').hide();
					$('.newBindingPhoneDomain').show();
				}
			},
			error: function(res){
				
			}
		})
	})
	$('.newIdentifyingBtn').click(function(){
		if(!(/^1[34578]\d{9}$/.test($('.newPhoneNumberInput').val()))){
			prompt.init({
				type:"",
				text:"手机号码格式错误",
			});
			return;
		}
		$(this).attr('disabled',true);
		$(this).removeClass();
		$(this).addClass('click-btn-noclick clickFloatRight newIdentifyingBtn');
		$(this).text('倒计时30秒');
		$.ajax({
			type: 'POST',
			url: '/yich/PhoneSetTelCodeServlet',
			dataType: 'json',
			data:{option:'nbt',tel:$('.newPhoneNumberInput').val()},
			success: function(res){
				if(res.result == -1){
					prompt.init({
						type:"",
						text:"该手机号已存在",
					});
				}
				if(res.result == 1){
					
				}
			},
			error: function(res){

			}
		});
		var _this = this;
		var time = 30;
		var timer = setInterval(function(){
			if(time <= 0){
				$(_this).removeAttr('disabled');
				$(_this).removeClass();
				$(_this).addClass('click-btn-redcolor clickFloatRight newIdentifyingBtn');
				$(_this).text('获取验证码');
				clearInterval(timer);
			}else{
				$(_this).text('倒计时' + --time +'秒');
			}
		},1000);
	});
	$('.newPhoneNumberInput').bind('input propertychange',function(){
		if($(this).val()&&$('.newIdentifyingCode').val()){
			$('.sure').removeAttr('disabled');
			$('.sure').removeClass('confirmNext');
			$('.sure').addClass('confirmClick');
		}else{
			$('.sure').attr('disabled',true);
			$('.sure').removeClass('confirmClick');
			$('.sure').addClass('confirmNext');
		}
	});
	$('.newIdentifyingCode').bind('input propertychange',function(){
		if($(this).val()&&$('.newPhoneNumberInput').val()){
			$('.sure').removeAttr('disabled');
			$('.sure').removeClass('confirmNext');
			$('.sure').addClass('confirmClick');
		}else{
			$('.sure').attr('disabled',true);
			$('.sure').removeClass('confirmClick');
			$('.sure').addClass('confirmNext');
		}
	});
	$('.sure').click(function(){
		$.ajax({
			type: 'POST',
			url: '/yich/PhoneCheckTelCodeServlet',
			dataType: 'json',
			data:{hcode:$('.newIdentifyingCode').val(),option:'nbt',tel:$('.newPhoneNumberInput').val()},
			success: function(res){
				if(res.res != 1){
					prompt.init({
						type:"",
						text:"验证码输入有误",
					});
				}else{
					if(res.result>0){
						prompt.init({
							type:"",
							text:"绑定成功",
						});
						setTimeout(function(){
							window.location.replace('/yich/wapservice/dist/html/account_binding.html');
						},1000);
					}
				}
			},
			error: function(res){
				prompt.init({
					type:"",
					text:"绑定失败",
				});
			}
		})
	})
});