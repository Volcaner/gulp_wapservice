function fwh_authorize(userId){
	if((typeof userId=='undefined') || (!userId)){
		  window.location.href= "/yich/PhoneClickWechatButton";
	  }
};
var openId='';
var href=window.location.href;
var search=(href.split("?"))[1];
var OPTION='';
if(search){
	var searcharr=search.split("&");
	for(var i=0;i<searcharr.length;i++){
		var str=searcharr[i];
		strarr=str.split("=");
		var key=strarr[0];
		var val=strarr[1];
		if(key=='openId'){
			openId=val;
		}else if(key=='option'){
			OPTION=val;
		}
	}
}
$(function(){
	$("#yzm").click(function(){
		  var tel=$.trim($("#num").val());
		  if(!(/^1[34578]\d{9}$/.test($.trim(tel)))){
			 tips("手机号错误!");
		  }else{
			  if(!$("#yzm").hasClass("disab")){
				  getyzm()
			  }
			  
		  }
	  });
})
function tips(text){
	 $(".tips").text(text);
	  $(".tips").css("display","block");
	  $(".tips").css({
		  "marginLeft": (-$(".tips").width()/2)+'px',
		  "marginTop": (-$(".tips").height()/2)+'px',
	  });
	  settime();
};
//提示框隐藏
var timer=null;
function settime(){
	clearTimeout(timer);
	timer=setTimeout(function(){
		$(".tips").css("display","none");
		$(".tips").text('');
	},1000);
};
//获取验证码
function getyzm(){
	$.ajax({
		type:"POST",
		url:"/yich/SendCodeForBund",
		 dataType:"json",
		data:{
			"tel":$.trim($("#num").val()),
		},
		success:function(json){
			if(typeof (json.userId)!='undefined'){
			    fwh_authorize(json.userId);
			}
			var num=0;
			if(typeof (json.num)!='undefined'){
				num=20-json.num;
			}
			$(".duanx_num").text("今日短信还剩"+num+"条");
			if(json.result==-11 || json.result==-4){
				tips("此手机号码已禁用,一到两天后解除!");
			}else{
				yzmdjs($("#yzm"),60);
				if(!$("#yzm").hasClass("disab")){
					$("#yzm").addClass("disab");
				}
			}
		}
	})
};

//验证码倒计时
function yzmdjs(_this,t){
	   var timer2=null;
	   var time=t;
	 d();
	 timer2=setInterval(function(){
	d(); 
	},1000);
	function d(){
	    time--;
	    if(time>=0){
	      _this.val(tozero(time)+'秒');
	      
	    }else{
	      clearInterval(timer2);
	      _this.val('获取验证码');
	    //s.removeClass(_this,'disab');
	      _this.removeClass('disab');
	    }
	} 
};
function tozero(t){
    return (t<10)?'0'+t:t;
}

//下一步
/*$("#sub").click(function(){
	var code=$("#code").val();
	$.ajax({
		type:"POST",
		url:"/yich/CheckTelOrLogin",
		 dataType:"json",
		data:{
			"tel":$("#num").val(),
			"code":code,
			"openId":openId,
		},
		success:function(json){
			if(json.result==2){
				tips("信息失效!");
			}else if(json.result==3){
				tips("验证码错误!");
			}else if(json.result==5){
				tips("手机号重复!");
			}else if(json.result==4){
				$("#t1").css("display","none");
				$("#t2").css("display","block");
			}else{
				window.location.href='/yich/wapservice/dist/html/business_center.html';
			}
		}
	})
});*/

//登录
$("#sub").click(function(){
	login();
});
function login(){
	var n=$.trim($("#num").val());
	var y=$.trim($("#code").val());
	var m=$.trim($("#passed").val());
	if(!(/^1[34578]\d{9}$/.test($.trim(n)))){
		 tips("手机号码有误，请重填!");
	}else if(y==''){
		$("#tip2").html("请输入验证码");
		tips("请输入验证码!");
	}else if(m.length<6 || m.length>18){
		tips("密码输入6-18位!");
	}else{
		yhm();
	}
};
function  yhm(){
	var passed = $("#passed").val();
		$.ajax({
			type:"POST",
			url:"/yich/SendKey",
			 dataType:"json",
			 async:false,
			success:function(data){
				setMaxDigits(130);
				var key = new RSAKeyPair(data.empoent,"",data.module);
				var result = encryptedString(key, document.getElementById("passed").value);
				$.ajax({
					type:"POST",
					url:"/yich/CheckTelOrLogin",
					 dataType:"json",
					 data:{
						 "code":$.trim($("#code").val()),
						 "openId":openId,
						 "passwd":result,
					 },
					 async:false,
					success:function(json){
						if(typeof (json.userId)!='undefined'){
						    fwh_authorize(json.userId);
						}
						if(json.result=='-2'){
							tips("验证码已失效，重新获取!");
						}else if(json.result=='-3'){
							tips("验证码错误!");
						}else if(json.result=='-5'){
							tips("密码格式不对!");
						}else if(json.result=='0'){
							tips("信息存储失败!");
						}else{
							if(OPTION=='manage' || (typeof (json.option)!='undefined ' && json.option=='fb')){
								window.location.href="/yich/wapservice/dist/html/commodityManagement.html";
							}else{
								window.location.href="/yich/wapservice/dist/html/business_center.html";
							}
						}
					}
				})
			}
		})
	
};
$("#sub").on("touchstart",function(){
	$(this).addClass("select");
})
$("#sub").on("touchend",function(){
	$(this).removeClass("select");
})