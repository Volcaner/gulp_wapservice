$(document).ready(function(){
	var recordHtml = '';
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
		url: '/yich/ServiceRecord',
		dataType: 'json',
		data:{'orderId':orderId,'type':0},
//		data:{'orderId':'20170823103826106626','type':0},
		success: function(res){
			if(typeof (res.userId)!='undefined'){
       		 func.fwh_authorize(res.userId);
       	 }
			for(var i = 0; i < res.list.length; i++){
				recordHtml+=[
				'<li>',			
					'<dl class="headerImg">',
						'<dt class="user_imgbox">',
							'<img src="'+res.list[i].head+'">',
							'</dt>',
						'<dd>',
							'<p>'+res.list[i].nickName+'</p>',
							'<p>'+res.list[i].operTime+'</p>',
						'</dd>',
					'</dl>',
					'<p class="asl_content">'+res.list[i].message+'</p>',
				'</li>',].join("");
			}
			$('.afterSalselist').append(recordHtml);
		},
		error: function(res){
			
		}
	})
});