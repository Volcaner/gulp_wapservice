/*
 * 下单页地址解析
 */
var anstate = {
	isSureBtn:false,
	an_name:'',
	an_phone:'',
	an_tel:'',
	an_prov:'',
	an_stre:'',	
}
$(function(){
setaddMT();

//地址解析展示
$('.addressTxt').click(function(){
	var anAddress=localStorage.getItem("CHECKADDRESS")?JSON.parse(localStorage.getItem("CHECKADDRESS")):'';//缓存的地址
	$('.analyBox').show();
	if(anAddress){
		setAnalyMT(anAddress);
	}
})
//关闭
$('.an_cancelBtn').click(function(){
	$('.analyBox').hide();
})
//解析地址
$('.analysisBtn').click(function(){
	 var tempadd = $('.an_analyText').text();
	 ParseAddress(tempadd);
})
//输入
$(document).on('input','.an_name',function(){
	anstate.an_name = trim($(this).val());
	checkADDSureBtn();
})
$(document).on('blur','.an_phone',function(){
	if(anstate.an_phone && !(/^1[34578]\d{9}$/.test(anstate.an_phone))){
		$(this).css('color','#f44336');
		$(this).focus();
	}
})
$(document).on('input','.an_phone',function(){
	anstate.an_phone = trim($(this).val());
	checkADDSureBtn();
})
$(document).on('blur','.an_tel',function(){
	if(anstate.an_tel && !(/^(\d{3,4}-)?\d{5,8}(-\d+)?$/.test(anstate.an_tel))){
		$(this).css('color','#f44336');
		$(this).focus();
	}
})
$(document).on('input','.an_tel',function(){
	anstate.an_tel = trim($(this).val());
	checkADDSureBtn();
})
$(document).on('input','.an_street',function(){
	anstate.an_stre = trim($(this).text());
	checkADDSureBtn();
})

//确定
$('.addressSure').click(function(){
	if(anstate.isSureBtn){
		var addObj = {};
		addObj.name = anstate.an_name;
		addObj.area = anstate.an_prov;
		addObj.address = anstate.an_stre;
		addObj.mobile = anstate.an_phone;
		addObj.tel = anstate.an_tel;
		addObj.postCode = "";
		addObj.isDel = ""
		addObj.isDefault = "0";
	
		setAnTopData(addObj);
		localStorage.setItem("CHECKADDRESS",JSON.stringify(addObj)); 
		
		
	}
})
})


function ParseAddress(add){
	anstate.an_name = '',
	anstate.an_phone = '',
	anstate.an_prov = '',
	anstate.an_stre = '';
	if(add && add.length>0){
		var anArray = add.replace(/\s+/g,',').split(',')
		var tempContect =  anArray[1]?anArray[1]:'';
		anstate.an_name = anArray[0]?anArray[0]:'';
		anstate.an_prov = anArray[2]?anArray[2]:'';
		if((/^1[0-9]\d{9}$/.test(tempContect))){
			anstate.an_phone = tempContect;
		}else{
			anstate.an_tel = tempContect;
		}
		for(var i in anArray){
			if(i>=3){
				anstate.an_stre+=anArray[i]+" ";
			}
		}
		$('.an_name').val(anstate.an_name);
		$('.an_province').val(anstate.an_prov);
		$('.an_street').text(anstate.an_stre);
		$('.an_phone').val(anstate.an_phone);
		$('.an_tel').val(anstate.an_tel);
		
	}else{
		$('.an_name').val('');
		$('.an_phone').val('');
		$('.an_tel').val('');
		$('.an_province').val('');
		$('.an_street').text('');
	}
	checkADDSureBtn("jx");
}
function setaddMT(){
	var area1 = new LArea();
	area1.init({
	    'trigger': '#an_demo', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
	    'cityName': '#an_cityname',
	    'valueTo': '#value1', //选择完毕后id属性输出到该位置
	    'keys': {
	        id: 'id',
	        name: 'name'
	    }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
	    'type': 1, //数据源类型
	    'data': LAreaData, //数据源
	    'callbackfunc':getfunback1,
	});
	area1.value=[0,0,0];//控制初始位置，注意：该方法并不会影响到input的value
}
function getfunback1(val,_this){
	anstate.an_prov = trim(val);
	checkADDSureBtn();
}
function setAnalyMT(data){
	anstate.isSureBtn = false;
	anstate.an_name = data.name;
	anstate.an_phone = data.mobile;
	anstate.an_tel = data.tel;
	anstate.an_prov = data.area;
	anstate.an_stre = data.address;
	$('.an_name').val(data.name);
	$('.an_phone').val(data.mobile);
	$('.an_tel').val(data.tel);
	$('.an_province').val(data.area);
	$('.an_street').text(data.address);
	checkADDSureBtn();
	
}
function checkADDSureBtn(pro){
	if((/^(\d{3,4}-)?\d{5,8}(-\d+)?$/.test(anstate.an_tel))){
		$('.an_tel').css('color','#212121');
		if(anstate.an_name &&  anstate.an_prov && anstate.an_stre){
			$('.an_addressBtnbox>input').addClass('an_active');
			anstate.isSureBtn = true;
		}else{
			$('.an_addressBtnbox>input').removeClass('an_active');
			anstate.isSureBtn = false;
		}
	}else{
		$('.an_addressBtnbox>input').removeClass('an_active');
		anstate.isSureBtn = false;
		if(pro && pro == "jx"){
			$('.an_tel').css('color','#f44336');
			$('.an_tel').focus();
		}
	}
	if((/^1[34578]\d{9}$/.test(anstate.an_phone))){
		$('.an_phone').css('color','#212121');
		if(anstate.an_name &&  anstate.an_prov && anstate.an_stre){
			$('.an_addressBtnbox>input').addClass('an_active');
			anstate.isSureBtn = true;
		}else{
			$('.an_addressBtnbox>input').removeClass('an_active');
			anstate.isSureBtn = false;
		}
		
	}else{
		$('.an_addressBtnbox>input').removeClass('an_active');
		anstate.isSureBtn = false;
		if(pro && pro == "jx"){
			$('.an_phone').css('color','#f44336');
			$('.an_phone').focus();
		}
	}
}

//getTop数据
function setAnTopData(data){
	var list={}, str = '';
	list = data;
	if(list.name){
		var mb = (list.mobile && list.tel)?list.mobile+"/"+list.tel:list.mobile?list.mobile:list.tel;
		str = [
			'<div class="hadAddress">',
				'<p>',
					'<span class="addessName">'+list.name+'</span>',
					'<span class="telnumber">'+mb+'</span>',
				'</p>',
				'<p class="addressInfor addressXX">'+list.area+' '+list.address+'</p>',
			'</div>',
			'<input class="editorAddress" type="text" placeholder="编辑或粘贴收货人地址" disabled>',
			].join("");
	}
	$('.addressTxt').html(str);
	$('.analyBox').hide();
	$('.hadAddress').show();
	$('.editorAddress').hide();
	resetAddressAnaly();
}
//解析地址重置（清空数据）
function resetAddressAnaly(){
	anstate.isSureBtn = false;
	anstate.an_name = '';
	anstate.an_phone = '';
	anstate.an_tel = '';
	anstate.an_prov = '';
	anstate.an_stre = '';
	$('.an_name').val('');
	$('.an_phone').val('');
	$('.an_province').val('');
	$('.an_street').text('');
	$('.an_analyText').html('');
}
//去除首尾空格
function trim(str){return str.replace(/(^\s*)|(\s*$)/g,"");}