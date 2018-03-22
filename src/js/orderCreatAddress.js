var state = {
		addressId:_getReg('addressId'),
		status:_getReg('status'),
		setIsDefault:false,
}
$(function(){
	if(state.status == 'chage'){
		//$('.ad_title>span').text("编辑收货地址");
		getChageAdressData(state.addressId);
		
	}else if(state.status == 'addtemp'){
		//$('.ad_title>span').text("临时地址");
		$('.setIsDefault').hide();
	}
	
	setaddMT();
	$('.contactPhone').on('input',function(){
		var vall = $(this).val();
		if($(this).val().length > 11){
			vall = vall.substring(0,11);
			$(this).val(vall);
		}
	})
	$('.contactPhone').on("blur",function(){
		var _this = $(this);
		var prompt = new promptFunc()
		if($(this).val()&&!(/^1[345798]\d{9}$/.test($(this).val()))){
		    prompt.init({
		      type:"",
		      text:"手机号码格式错误",
		      func:function(){
		    	  _this.val("");
		      }
		    });
		    return;
		  }
	})
	$('.landline').on('input',function(){
		var vall = $(this).val().slice(0,30);
		$(this).val(vall);
		
	})
	$('.landline').on("blur",function(){
		var _this = $(this);
		var prompt = new promptFunc()
		if($(this).val()&&!(/^(\d{3,4}-)?\d{5,8}(-\d+)?$/.test($(this).val()))){
		    prompt.init({
		      type:"",
		      text:"座机格式错误",
		    });
		    return;
		  }
	})
	$('.postcode').on('input',function(){
		var vall = $(this).val();
		if($(this).val().length > 6){
			vall = vall.substring(0,6);
			$(this).val(vall);
		}
	})
	
	$('.setIsDefault').click(function(){
		if(!state.setIsDefault){
			$(this).html('<p class="isDefault"><i class="icon-adress"></i>默认地址</p>');
		}else{
			$(this).html('<p><i class="icon-adress"></i>设为默认地址</p>');
		}
		state.setIsDefault = !state.setIsDefault;
	})
	//保存地址
	$('#saveAdressBtn').click(function(){
		var name = $('.cad_content>li').eq(0).find('input').val();
		var mobile = $('.cad_content>li').eq(1).find('input').val();
		var tel = $('.cad_content>li').eq(2).find('input').val();
		var postcode = $('.cad_content>li').eq(3).find('input').val();
		var area = $('.cad_content>li').eq(4).find('input').val();
		var address = $('.cad_content>li').eq(5).find('textarea').val();
		var addressId = state.addressId;
		var isDefault = state.setIsDefault?"1":"0";
		
		var tsp = new promptFunc();
		if(name && area && address){
			if(mobile || tel){
				if(state.status == "addtemp"){
					var addObj = {};
					addObj.address = address;
					addObj.area = area;
					addObj.mobile = mobile;
					addObj.name = name;
					addObj.postCode = postcode;
					addObj.tel = tel;
					addObj.isDel = ""
					addObj.isDefault = "0";
					localStorage.setItem("CHECKADDRESS",JSON.stringify(addObj)); 
					window.location.href="/yich/wapservice/dist/html/goodsOrder.html?cache=true&isTemp=true";
				}else{
					$.ajax({
						type:"post",
						url:"/yich/PhoneAddAddressServlet",
						dataType:"json",
						data:{
							name:name,
							mobile:mobile,
							tel:tel,
							postcode:postcode,
							area:area,
							address:address,
							addressId:addressId,
							isDefault:isDefault
						},
						success:function(data){
							if(data.i > 0){
								tsp.init({
									text:'保存成功!',
									func: function(){
										 window.location.replace("/yich/wapservice/dist/html/orderAddressAdmin.html");
									}
								})
							}
							
						},error:function(err){},
					})
				}
			}else{
				tsp.init({
					text:'信息不完整！',
				})
			}
		}else{
			tsp.init({
				text:'信息不完整！',
			})
		}
		
	})
	
})
function getChageAdressData(addId){
	$.ajax({
		type:'post',
		url:'/yich/PhonebianjiServlet',
		dataType:'json',
		data:{addressId:addId},
		success:function(data){
			//404
			//checkErrorAjax(data);
			
			if(data.addressList){
				var mesJson = data.addressList;
				var name = mesJson.name?mesJson.name:'';
				var mobile =  mesJson.mobile?mesJson.mobile:'';
				var tel =  mesJson.tel?mesJson.tel:'';
				var area =  mesJson.area?mesJson.area:'';
				var adress = mesJson.address?mesJson.address:'';
				var postcode =  mesJson.postCode?mesJson.postCode:'';
				$('.cad_content li').eq(0).find('input').val(name);
				$('.cad_content li').eq(1).find('input').val(mobile);
				$('.cad_content li').eq(2).find('input').val(tel);
				$('.cad_content li').eq(3).find('input').val(postcode);
				$('.cad_content li').eq(4).find('input').val(area);
				$('.cad_content li').eq(5).find('textarea').val(adress);   
				if(mesJson.isDefault && mesJson.isDefault == "1"){
					state.setIsDefault = true;
					$('.setIsDefault').html('<p class="isDefault"><i class="icon-adress"></i>默认地址</p>');
				}else{
					state.setIsDefault = false;
					$('.setIsDefault').html('<p><i class="icon-adress"></i>设为默认地址</p>');
				}
			}
			
		},
		error:function(err){},
	})
}
function setaddMT(){
	var area1 = new LArea();
	area1.init({
	    'trigger': '#demo1', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
	    'cityName': '#cityname',
	    'valueTo': '#value1', //选择完毕后id属性输出到该位置
	    'keys': {
	        id: 'id',
	        name: 'name'
	    }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
	    'type': 1, //数据源类型
	    'data': LAreaData //数据源
	});
	area1.value=[0,0,0];//控制初始位置，注意：该方法并不会影响到input的value
}
