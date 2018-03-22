/*
 * shy 转售下单页
 */
var state = {
		traId:_getReg("traId"),
		openId:_getReg("openId"),
		userId:_getReg("userId"),
		payment:_getReg("payment")?_getReg("payment"):"0.00",
		alipayNum:'',		
}
$(function(){
	payResaleGetAddress();
	setaddMT();
	var payMoney = parseFloat(state.payment).toFixed(2);
	var price1 = payMoney.split('.')[0]?payMoney.split('.')[0]:'0';
	var price2 = payMoney.split('.')[1]?payMoney.split('.')[1]:'00';
	$('.payMoneyBox').html('需支付：<span><i>￥</i>'+price1+'<i>.'+price2+'</i></span>');
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
	$('#payResaleBtn').click(function(){
		var prompt = new promptFunc()
		var name = $('.cad_content>li').eq(0).find('input').val();
		var mobile = $('.cad_content>li').eq(1).find('input').val();
		var tel = $('.cad_content>li').eq(2).find('input').val();
		var postcode = $('.cad_content>li').eq(3).find('input').val();
		var area = $('.cad_content>li').eq(4).find('input').val();
		var address = $('.cad_content>li').eq(5).find('textarea').val();
		var province = area.split(" ")[0]?area.split(" ")[0]:'';
		var city = area.split(" ")[1]?area.split(" ")[1]:'';
		var areas = area.split(" ")[2]?area.split(" ")[2]:'';
		if(mobile || tel){
			if(name && area && address){
				$.ajax({
					type:"post",
					url:"/yich/ResalePaymentServlet",
					dataType:"json",
					async:false,
					data:{traId:state.traId,
						openId:state.openId,
						userId:state.userId,
						name:name,
						mobile:mobile,
						tel:tel,
						postCode:postcode,
						province:province,
						city:city,
						area:areas,
						adress:address},
					success:function(data){
						//404
						//checkErrorAjax(data);
						state.alipayNum = data.payNum;
						var appId = data.appId;
						var timeStamp = data.timeStamp;
						var nonceStr = data.nonceStr;
						var packages = data['package'];
						var signType = data.signType;
						var paySign = data.paySign;
						var agent = data.agent?parseInt(data.agent):1;
						if(agent<5){
							 prompt.init({
							      type:"",
							      text:"微信版本过低!",
							  });
							return false;
						}
						weichatPay(appId,timeStamp,nonceStr,packages,signType,paySign);
					},
					error:function(err){},
				})
			}else{
				 prompt.init({
				      type:"",
				      text:"信息填写不完整!",
				  });
			}
		}else{
			 prompt.init({
			      type:"",
			      text:"请至少填写一个联系方式!",
			  });
		}
		
		
	})
})
/***********微信支付************/
function weichatPay(appId,timeStamp,nonceStr,packages,signType,paySign){
	var isappId = appId;
	var istimeStamp = timeStamp;
	var isnonceStr = nonceStr;
	var ispackages = packages;
	var issignType = signType;
	var ispaySign = paySign;
	function onBridgeReady(){
		   WeixinJSBridge.invoke(
		       'getBrandWCPayRequest', {
		           "appId":isappId,     //公众号名称，由商户传入     
		           "timeStamp":istimeStamp.toString(),         //时间戳，自1970年以来的秒数     
		           "nonceStr":isnonceStr, //随机串     
		           "package":ispackages,     
		           "signType":issignType,         //微信签名方式：     
		           "paySign":ispaySign, //微信签名 
		       },
		       function(res){     
		    	   var prompt = new promptFunc();
		           if(res.err_msg == "get_brand_wcpay_request:ok" ) {
		        	   window.location.href="/yich/wapservice/dist/html/paysuccess_resale.html?tradeNum="+state.alipayNum;
		           }else{
                  	  prompt.init({
						      type:"",
						      text:"支付未完成，请重新支付!",
						  });
		           }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
		       }
		   ); 
		}
		if (typeof WeixinJSBridge == "undefined"){
		   if( document.addEventListener ){
		       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
		   }else if (document.attachEvent){
		       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
		       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
		   }
		}else{
		   onBridgeReady();
		}
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
function payResaleGetAddress(){
	$.ajax({
		type:"post",
		url:'/yich/DelegationGetCAddress',
		dataType:'json',
		data:{openId:state.openId},
		success:function(data){
			console.log(data);
			var name = data.name?data.name:'';
			var mobile = data.mobile?data.mobile:'';
			var tel = data.tel?data.tel:'';
			var code = data.post_code?data.post_code:'';
			var province = data.province?data.province:'';
			var city = data.city?data.city:'';
			var area = data.area?data.area:'';
			var address = data.address?data.address:'';
			var pca = province+" "+city+" "+area;
			$('.cad_content>li').eq(0).find('input').val(name);
			$('.cad_content>li').eq(1).find('input').val(mobile);
			$('.cad_content>li').eq(2).find('input').val(tel);
			$('.cad_content>li').eq(3).find('input').val(code);
			$('.cad_content>li').eq(4).find('input').val(pca);
			$('.cad_content>li').eq(5).find('textarea').val(address);
		},error:function(err){}
		
	})
}
