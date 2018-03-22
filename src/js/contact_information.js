$(document).ready(function(){
	var prompt = new promptFunc();
	$.ajax({
		type: 'POST',
		url: '/yich/PhoneConnectionWayServlet',
		dataType: 'json',
		success: function(res){
			if(typeof (res.userId)!='undefined'){
			    func.fwh_authorize(res.userId);
			}
			if(res.business){
				if(res.business.mobile){
					$('.contactPhone').val(res.business.mobile);
				}
				if(res.business.landline_tel){
					$('.landline').val(res.business.landline_tel);
				}
				if(res.business.wangwang){
					$('.wangwang').val(res.business.wangwang);
				}
				if(res.business.tel||res.business.landline_tel){
					$('.confirm').removeAttr('disabled');
					$('.confirm').addClass('confirmClick');
					$('.confirm').removeClass('confirmForbid');
				}else{
					$('.confirm').addClass('confirmForbid');
					$('.confirm').removeClass('confirmClick');
					$('.confirm').attr('disabled',true);
				}
			}
		},
		error: function(res){
			
		}
	});
	$('.confirm').click(function(){
		if($('.contactPhone').val()&&!(/^1[34578]\d{9}$/.test($('.contactPhone').val()))){
			prompt.init({
				type:"",
				text:"手机号码格式错误",
			});
			return;
		}
		if($('.landline').val()&&!(/^(\d{3,4}-)?\d{5,8}(-\d+)?$/.test($('.landline').val()))){
			prompt.init({
				type:"",
				text:"座机格式错误",
			});
			return;
		}
		$.ajax({
			type: 'POST',
			url: '/yich/PhoneUpdateConnectionWayServlet',
			dataType: 'json',
			data:"{\"tel\":\""+$('.contactPhone').val()+"\",\"wangwang\":\""+$('.wangwang').val()+"\",\"landline\":\""+$('.landline').val()+"\"}",
			success: function(res){
				if(typeof (res.userId)!='undefined'){
				    func.fwh_authorize(res.userId);
				}
				if(res.i == 2){
					prompt.init({
						type:"",
						text:"修改成功",
					});
					setTimeout(function(){
						window.location.replace('/yich/wapservice/dist/html/business_center_setting.html');
					},1000);
				}else{
					prompt.init({
						type:"",
						text:"修改失败",
					});
				}
			},
			error: function(res){
				prompt.init({
					type:"",
					text:"修改失败",
				});
			}
		});
	});
	//联系手机输入框失去焦点
	$('.contactPhone').bind('input propertychange',function(){
		if($(this).val()||$('.landline').val()){
			$('.confirm').removeAttr('disabled');
			$('.confirm').addClass('confirmClick');
			$('.confirm').removeClass('confirmForbid');
		}else{
			$('.confirm').addClass('confirmForbid');
			$('.confirm').removeClass('confirmClick');
			$('.confirm').attr('disabled',true);
		}
	});
	//联系座机输入框失去焦点
	$('.landline').bind('input propertychange',function(){
		if($(this).val()||$('.contactPhone').val()){
			$('.confirm').removeAttr('disabled');
			$('.confirm').addClass('confirmClick');
			$('.confirm').removeClass('confirmForbid');
		}else{
			$('.confirm').addClass('confirmForbid');
			$('.confirm').removeClass('confirmClick');
			$('.confirm').attr('disabled',true);
		}
	});
});
