var state = {
		isDefaultId:'',
		hadAddress:localStorage.getItem("CHECKADDRESS")?JSON.parse(localStorage.getItem("CHECKADDRESS")):'',//缓存的地址
		addressArr:[],
}
$(function(){
	getdataAjax();
	$(document).on('click','.ad_nomal',function(){
		var oldId = state.isDefaultId;
		var newId = $(this).closest('li').attr('addressId');
		setnomalAjax(oldId,newId);
	})
	//选择地址
	$(document).on("click",".ad_infor",function(){
		var adress = {};
		var adId = $(this).closest('li').attr('addressid');
		for(var d in state.addressArr){
			if(state.addressArr[d].addressId == adId){
				adress = state.addressArr[d];
			}
		}
		localStorage.setItem("CHECKADDRESS",JSON.stringify(adress)); //地址存储本地
		$(this).find('.checkedBtn').removeClass('icon-unchecked');
		$(this).find('.checkedBtn').addClass('icon-checked icon-active').closest('li').siblings().find('.checkedBtn').removeClass('icon-checked icon-active').addClass('icon-unchecked');
		window.location.href = "/yich/wapservice/dist/html/goodsOrder.html?cache=true";
	})
	//编辑地址
	$(document).on('click','.adbj',function(){
		var addressId = $(this).closest('li').attr('addressId');
		 window.location.href="/yich/wapservice/dist/html/orderCreatAddress.html?status=chage&addressId="+addressId;
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
			});
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
			 window.location.href="/yich/wapservice/dist/html/orderCreatAddress.html?status=addnew";
		}
		
	})
	//新增临时地址
	/*$('#addTempAdressBtn').click(function(){
		 window.location.replace("/yich/wapservice/dist/html/orderCreatAddress.html?status=addtemp");
	})*/
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
				state.addressArr = data.list;
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
	var adstr = '',isnomal = '',isIconNomal = '';
	for(var i in list){
		var tel = '';
		if(list[i].mobile && list[i].tel){
			tel = list[i].mobile+" / "+list[i].tel;
		}else if(list[i].mobile && !list[i].tel){
			tel = list[i].mobile;
		}else if(!list[i].mobile && list[i].tel){
			tel = list[i].tel;
		}
		if(state.hadAddress){
			if(state.hadAddress.addressId == list[i].addressId){
				isIconNomal = '<i class="checkedBtn icon-checked icon-active"></i>';
			}else{
				isIconNomal = '<i class="checkedBtn icon-unchecked"></i>';
			}
			if(list[i].isDefault == "1"){
				isnomal = '<span class="ad_nomal isDefault"><i class="icon-adress"></i>默认地址</span>';
				state.isDefaultId = list[i].addressId;
			}else{
				isnomal =  '<span class="ad_nomal"><i class="icon-adress"></i>设为默认地址</span>';
			}
			
		}else{
			if(list[i].isDefault == "1"){
				isIconNomal = '<i class="checkedBtn icon-checked icon-active"></i>';
				isnomal = '<span class="ad_nomal isDefault"><i class="icon-adress"></i>默认地址</span>';
				state.isDefaultId = list[i].addressId;
			}else{
				isIconNomal = '<i class="checkedBtn icon-unchecked"></i>';
				isnomal =  '<span class="ad_nomal"><i class="icon-adress"></i>设为默认地址</span>';
			}
		}
		
		adstr += [
				'<li addressId="'+list[i].addressId+'" isDefault="'+list[i].isDefault+'">',
					'<dl class="ad_infor">',
						'<dt>',
							'<p><span class="ad_name">'+list[i].name+'</span><span class="ad_tel">'+tel+'</span></p>',
							''+isIconNomal+'',
						'</dt>',
						'<dd>',
							'<p>'+list[i].area+' '+list[i].address+'</p>',
						'</dd>',
					'</dl>',
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