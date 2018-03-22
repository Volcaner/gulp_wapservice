function fwh_authorize(userId){
	if((typeof userId=='undefined') || (!userId)){
		  window.location.href= "/yich/PhoneClickWechatButton";
	  }
}
$(document).ready(function(){
	$.ajax({
		type: 'POST',
		url: '/yich/PhoneCheckTraPwd',
		dataType: 'json',
		success: function(res){
			if(typeof (res.userId)!='undefined'){
			    fwh_authorize(res.userId);
			}
			if(res.result == 1){
				$('.trdPassword').text('交易密码修改');
			}else{
				$('.trdPassword').text('交易密码设置');
			}
		},
		error: function(){
			
		}
	});
});