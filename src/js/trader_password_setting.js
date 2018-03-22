$(document).ready(function(){
	//验证手机成功令牌
	var code = '';
	//提示框
	var prompt = new promptFunc();
	$.ajax({
		type: 'POST',
		url: '/yich/PhoneCheckTraPwd',
		dataType: 'json',
		success: function(res){
			if(typeof (res.userId)!='undefined'){
			    fwh_authorize(res.userId);
			}
			if(res.result == 1){
				$('.settedModule').show();
				$('.number').text(res.tel);
			}else{
				$('.initialModule').show();
			}
		},
		error: function(){
			
		}
	});
	$('.trdPassword').bind('input propertychange',function(){
		if($(this).val()&&$('.confirmTrdPassword').val()){
			$('.initialConfirm').removeAttr('disabled');
			$('.initialConfirm').removeClass('confirmNext');
			$('.initialConfirm').addClass('confirmClick');
		}else{
			$('.initialConfirm').attr('disabled',true);
			$('.initialConfirm').removeClass('confirmClick');
			$('.initialConfirm').addClass('confirmNext');
		}
	});
	$('.confirmTrdPassword').bind('input propertychange',function(){
		if($(this).val()&&$('.trdPassword').val()){
			$('.initialConfirm').removeAttr('disabled');
			$('.initialConfirm').removeClass('confirmNext');
			$('.initialConfirm').addClass('confirmClick');
		}else{
			$('.initialConfirm').attr('disabled',true);
			$('.initialConfirm').removeClass('confirmClick');
			$('.initialConfirm').addClass('confirmNext');
		}
	});
	$('.trdPassword').bind('input propertychange',function(){
		$('.traPasswordDelete').show();
		$('.traPasswordEyes').show();
	});
	$('.trdPassword').focus(function(){
		if($('.trdPassword').val()){
			$('.traPasswordDelete').show();
			$('.traPasswordEyes').show();
		}
	});
	$('.trdPassword').blur(function(){
		$('.traPasswordDelete').hide();
		$('.traPasswordEyes').hide();
	});
	$('.traPasswordDelete').click(function(event){
		$('.trdPassword').val('');
	});
	$('.traPasswordDelete').mousedown(function(event){
		event.preventDefault();
	});
	$('.traPasswordEyes').click(function(){
		if($('.trdPassword').hasClass('numberPassword')){
			$('.trdPassword').removeClass('numberPassword');
			$('.confirmTrdPassword').removeClass('numberPassword');
			$('.traPasswordEyes').removeClass('icon-nolook');
			$('.traPasswordEyes').addClass('icon-look');
			$('.confirmTraPasswordEyes').removeClass('icon-nolook');
			$('.confirmTraPasswordEyes').addClass('icon-look');
		}else{
			$('.trdPassword').addClass('numberPassword');
			$('.confirmTrdPassword').addClass('numberPassword');
			$('.traPasswordEyes').removeClass('icon-look');
			$('.traPasswordEyes').addClass('icon-nolook');
			$('.confirmTraPasswordEyes').removeClass('icon-look');
			$('.confirmTraPasswordEyes').addClass('icon-nolook');
		}
	});
	$('.traPasswordEyes').mousedown(function(event){
		event.preventDefault();
	});
	$('.confirmTrdPassword').bind('input propertychange',function(){
		$('.confirmTraPasswordDelete').show();
		$('.confirmTraPasswordEyes').show();
	});
	$('.confirmTrdPassword').focus(function(){
		if($('.trdPassword').val()){
			$('.confirmTraPasswordDelete').show();
			$('.confirmTraPasswordEyes').show();
		}
	});
	$('.confirmTrdPassword').blur(function(){
		$('.confirmTraPasswordDelete').hide();
		$('.confirmTraPasswordEyes').hide();
	});
	$('.confirmTraPasswordDelete').click(function(event){
		$('.confirmTrdPassword').val('');
	});
	$('.confirmTraPasswordDelete').mousedown(function(event){
		event.preventDefault();
	});
	$('.confirmTraPasswordEyes').click(function(){
		if($('.confirmTrdPassword').hasClass('numberPassword')){
			$('.trdPassword').removeClass('numberPassword');
			$('.confirmTrdPassword').removeClass('numberPassword');
			$('.traPasswordEyes').removeClass('icon-nolook');
			$('.traPasswordEyes').addClass('icon-look');
			$('.confirmTraPasswordEyes').removeClass('icon-nolook');
			$('.confirmTraPasswordEyes').addClass('icon-look');
		}else{
			$('.trdPassword').addClass('numberPassword');
			$('.confirmTrdPassword').addClass('numberPassword');
			$('.traPasswordEyes').removeClass('icon-look');
			$('.traPasswordEyes').addClass('icon-nolook');
			$('.confirmTraPasswordEyes').removeClass('icon-look');
			$('.confirmTraPasswordEyes').addClass('icon-nolook');
		}
	});
	$('.confirmTraPasswordEyes').mousedown(function(event){
		event.preventDefault();
	});
	$('.initialConfirm').click(function(){
		if($('.trdPassword').val()!=$('.confirmTrdPassword').val()){
			prompt.init({
				type:'',
				text:'交易密码不一致',
			});
			return;
		}
		if($('.trdPassword').val().length<6){
			prompt.init({
				type:'',
				text:'请输入6位交易密码',
			});
			return;
		}
		$.ajax({
			type:"POST",
			url:"/yich/SendKey",
			 dataType:"json",
			 async:false,
			success:function(data){
				setMaxDigits(130);
				var key = new RSAKeyPair(data.empoent,"",data.module);
				var newResult = encryptedString(key, $('.trdPassword').val());
				$.ajax({
					type: 'POST',
					url: '/yich/PhoneSetUpTraPwd',
					dataType: 'json',
					data: {npwd:newResult},
					async:false,
					success: function(res){
						if(res.result > 0){
							prompt.init({
								type:'',
								text:'密码设置成功',
							});
							setTimeout(function(){
								window.location.replace('/yich/wapservice/dist/html/business_center_setting.html');
							},1000);
						}else{
							prompt.init({
								type:'',
								text:'密码设置失败',
							});
						}
					},
					error: function(res){
						prompt.init({
							type:'',
							text:'密码设置失败',
						});
					}
				});
			},
			error:function(res){
				prompt.init({
					type:'',
					text:'密码设置失败',
				});
			}
		});
	});
	$('.identifyingBtn').click(function(){
		$(this).attr('disabled',true);
		$(this).removeClass();
		$(this).addClass('click-btn-noclick clickFloatRight identifyingBtn');
		$(this).text('倒计时30秒');
		$.ajax({
			type: 'POST',
			url: '/yich/PhoneChangeTraPwdSetTelCodeServlet',
			dataType: 'json',
			success: function(res){
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
	$('.identifyCode').bind('input propertychange',function(){
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
			url: '/yich/PhoneChangeTraPwdCheckTelCodeServlet',
			dataType: 'json',
			data: {hcode:$('.identifyCode').val()},
			success: function(res){
				if(res.res == 1){
					$('.settedModule').hide();
					$('.changeModule').show();
					code = res.code;
				}else{
					prompt.init({
						type:'',
						text:'验证码输入有误',
					});
				}
			},
			error: function(res){
				
			}
		});
	});
	$('.newTraPassword').bind('input propertychange',function(){
		if($(this).val()&&$('.confirmNewTraPassword').val()){
			$('.newConfirm').removeAttr('disabled');
			$('.newConfirm').removeClass('confirmNext');
			$('.newConfirm').addClass('confirmClick');
		}else{
			$('.newConfirm').attr('disabled',true);
			$('.newConfirm').removeClass('confirmClick');
			$('.newConfirm').addClass('confirmNext');
		}
	});
	$('.confirmNewTraPassword').bind('input propertychange',function(){
		if($(this).val()&&$('.newTraPassword').val()){
			$('.newConfirm').removeAttr('disabled');
			$('.newConfirm').removeClass('confirmNext');
			$('.newConfirm').addClass('confirmClick');
		}else{
			$('.newConfirm').attr('disabled',true);
			$('.newConfirm').removeClass('confirmClick');
			$('.newConfirm').addClass('confirmNext');
		}
	});
	$('.newTraPassword').bind('input propertychange',function(){
		$('.newTraPasswordDelete').show();
		$('.newTraPasswordEyes').show();
	});
	$('.newTraPassword').focus(function(){
		if($('.newTraPassword').val()){
			$('.newTraPasswordDelete').show();
			$('.newTraPasswordEyes').show();
		}
	});
	$('.newTraPassword').blur(function(){
		$('.newTraPasswordDelete').hide();
		$('.newTraPasswordEyes').hide();
	});
	$('.newTraPasswordDelete').click(function(event){
		$('.newTraPassword').val('');
	});
	$('.newTraPasswordDelete').mousedown(function(event){
		event.preventDefault();
	});
	$('.newTraPasswordEyes').click(function(){
		if($('.newTraPassword').hasClass('numberPassword')){
			$('.newTraPassword').removeClass('numberPassword');
			$('.confirmNewTraPassword').removeClass('numberPassword');
			$('.newTraPasswordEyes').removeClass('icon-nolook');
			$('.newTraPasswordEyes').addClass('icon-look');
			$('.confirmNewTraPasswordEyes').removeClass('icon-nolook');
			$('.confirmNewTraPasswordEyes').addClass('icon-look');
		}else{
			$('.newTraPassword').addClass('numberPassword');
			$('.confirmNewTraPassword').addClass('numberPassword');
			$('.newTraPasswordEyes').removeClass('icon-look');
			$('.newTraPasswordEyes').addClass('icon-nolook');
			$('.confirmNewTraPasswordEyes').removeClass('icon-look');
			$('.confirmNewTraPasswordEyes').addClass('icon-nolook');
		}
	});
	$('.newTraPasswordEyes').mousedown(function(event){
		event.preventDefault();
	});
	$('.confirmNewTraPassword').bind('input propertychange',function(){
		$('.confirmNewTraPasswordDelete').show();
		$('.confirmNewTraPasswordEyes').show();
	});
	$('.confirmNewTraPassword').focus(function(){
		if($('.newTraPassword').val()){
			$('.confirmNewTraPasswordDelete').show();
			$('.confirmNewTraPasswordEyes').show();
		}
	});
	$('.confirmNewTraPassword').blur(function(){
		$('.confirmNewTraPasswordDelete').hide();
		$('.confirmNewTraPasswordEyes').hide();
	});
	$('.confirmNewTraPasswordDelete').click(function(event){
		$('.confirmNewTraPassword').val('');
	});
	$('.confirmNewTraPasswordDelete').mousedown(function(event){
		event.preventDefault();
	});
	$('.confirmNewTraPasswordEyes').click(function(){
		/*if($('.confirmNewTraPassword').hasClass('numberPassword')){
			$('.newTraPassword').removeClass('numberPassword');
			$('.confirmNewTrdPassword').removeClass('numberPassword');
			$('.newTraPasswordEyes').removeClass('icon-nolook');
			$('.newTraPasswordEyes').addClass('icon-look');
			$('.confirmNewTraPasswordEyes').removeClass('icon-nolook');
			$('.confirmNewTraPasswordEyes').addClass('icon-look');*/
		if($('.newTraPassword').hasClass('numberPassword')){
			$('.newTraPassword').removeClass('numberPassword');
			$('.confirmNewTraPassword').removeClass('numberPassword');
			$('.newTraPasswordEyes').removeClass('icon-nolook');
			$('.newTraPasswordEyes').addClass('icon-look');
			$('.confirmNewTraPasswordEyes').removeClass('icon-nolook');
			$('.confirmNewTraPasswordEyes').addClass('icon-look');
		}else{
			$('.newTraPassword').addClass('numberPassword');
			$('.confirmNewTraPassword').addClass('numberPassword');
			$('.newTraPasswordEyes').removeClass('icon-look');
			$('.newTraPasswordEyes').addClass('icon-nolook');
			$('.confirmNewTraPasswordEyes').removeClass('icon-look');
			$('.confirmNewTraPasswordEyes').addClass('icon-nolook');
		}
	});
	$('.confirmNewTraPasswordEyes').mousedown(function(event){
		event.preventDefault();
	});
	$('.newConfirm').click(function(){
		if($('.newTraPassword').val()!=$('.confirmNewTraPassword').val()){
			prompt.init({
				type:'',
				text:'新交易密码不一致',
			});
			return;
		}
		if($('.newTraPassword').val().length<6){
			prompt.init({
				type:'',
				text:'请输入6位新交易密码',
			});
			return;
		}
		$.ajax({
			type:"POST",
			url:"/yich/SendKey",
			 dataType:"json",
			 async:false,
			success:function(data){
				setMaxDigits(130);
				var key = new RSAKeyPair(data.empoent,"",data.module);
				var newResult = encryptedString(key, $('.newTraPassword').val());
				$.ajax({
					type: 'POST',
					url: '/yich/PhoneChangeTraPwd',
					dataType: 'json',
					data: "{\"code\":\""+code+"\",\"npwd\":\""+newResult+"\"}",
					async:false,
					success: function(res){
						if(res.result > 0){
							prompt.init({
								type:'',
								text:'修改成功',
							});
							setTimeout(function(){
								window.location.replace('/yich/wapservice/dist/html/business_center_setting.html');
							},1000);
						}else{
							prompt.init({
								type:'',
								text:'修改失败',
							});
						}
					},
					error: function(res){
						prompt.init({
							type:'',
							text:'修改失败',
						});
					}
				});
			},
			error:function(res){
				prompt.init({
					type:'',
					text:'修改失败',
				});
			}
		});
	});
});