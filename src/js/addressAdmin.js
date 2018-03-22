var state = {
		isDefaultId:'',
}
$(function(){
	getdataAjax();
	$(document).on('click','.ad_nomal',function(){
		var oldId = state.isDefaultId;
		var newId = $(this).closest('li').attr('addressId');
		setnomalAjax(oldId,newId);
	})
	//编辑地址
	$(document).on('click','.adbj',function(){
		var addressId = $(this).closest('li').attr('addressId');
		 window.location.replace("/yich/wapservice/dist/html/createAddress.html?status=chage&addressId="+addressId);
	})
	//删除地址
	$(document).on('click','.addel',function(){
		var _this = $(this);
		var addressId = $(this).closest('li').attr('addressId');
		var tempIsDefault = $(this).closest('li').attr('isDefault');
		var tsp = new promptFunc();
		if(tempIsDefault != "1"){
			var str = "确定删除该条地址信息吗？";
			chekMTfunc(str,function(){
				$.ajax({
					type:"post",
					url:"/yich/PhoneDelAddressServlet",
					dataType:"json",
					data:"{\"addressId\":\""+addressId+"\"}",
					success:function(data){
						if(typeof (data.userId)!='undefined'){
			        		 func.fwh_authorize(data.userId);
			        	 }
						if(data.i > 0){
							tsp.init({
								text:"删除成功!"
							})
							_this.closest('li').remove();
						}else{
							tsp.init({
								text:"删除失败!"
							})
						}
					},error:function(err){},
				})
			})
		}else{
			tsp.init({
				text:"不能删除默认地址!",
			})
		}
		
		
		
	})
	//新增地址
	$('#addAdressBtn').click(function(){
		var tsp = new promptFunc();
		if($('.ad_content>li').length>=10){
			tsp.init({
				text:"最多添加10条收货地址"
			})
		}else{
			 window.location.replace("/yich/wapservice/dist/html/createAddress.html?status=add");
		}
		
	})
})

function getdataAjax(){
	$.ajax({
		type:"post",
		url:"/yich/PhoneDeliveryAddressServlet",
		dataType:"json",
		success:function(data){
			if(typeof (data.userId)!='undefined'){
       		 func.fwh_authorize(data.userId);
       	 }
			if(data.list && data.list.length){
				setdomList(data.list);
			}
			
		},error:function(err){},
	})
}
function setnomalAjax(oldId,newId){
	$.ajax({
		type:"post",
		url:"/yich/PhoneSetDefaultsServlet",
		dataType:"json",
		data:"{\"oid\":\""+oldId+"\",\"id\":\""+newId+"\"}",
		success:function(data){
			if(typeof (data.userId)!='undefined'){
       		 func.fwh_authorize(data.userId);
       	   }
			if(data.i > 0){
				setdomList(data.list);
			}
		},error:function(err){},
	})
}
function setdomList(data){
	var list = data;
	var adstr = '',isnomal = '';
	for(var i in list){
		var tel = '';
		if(list[i].mobile && list[i].tel){
			tel = list[i].mobile+" / "+list[i].tel;
		}else if(list[i].mobile && !list[i].tel){
			tel = list[i].mobile;
		}else if(!list[i].mobile && list[i].tel){
			tel = list[i].tel;
		}
		if(list[i].isDefault == "1"){
			isnomal = '<span class="ad_nomal isDefault"><i class="icon-adress"></i>默认地址</span>';
			state.isDefaultId = list[i].addressId;
		}else{
			isnomal =  '<span class="ad_nomal"><i class="icon-adress"></i>设为默认地址</span>';
		}
		adstr += [
				'<li addressId="'+list[i].addressId+'" isDefault="'+list[i].isDefault+'">',
					'<p><span class="ad_name">'+list[i].name+'</span><span class="ad_tel">'+tel+'</span></p>',
					'<p>'+list[i].area+' '+list[i].address+'</p>',
					'<p>',
						''+isnomal+'',
						'<span class="ad_handel">',
							'<span class="adbj"><i class="icon-edit"></i>编辑</span>',
							'<span class="addel"><i class="icon-trash"></i>删除</span>',
						'</span>',
					'</p>',
				'</li> ',
		        ].join("");
	}
	$('.ad_content').html(adstr);
}