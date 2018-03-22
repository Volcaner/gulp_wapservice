//加载数据
var strdom = function(data,flag){
	var str='';
    flag = arguments[1]?arguments[1]:false;
	if(typeof data.list!='undefined'){
		var list=data.list;
		if(list.length>0){
			console.log(55);
			console.log(list);
			for(var i=0;i<list.length;i++){
				var cjtime='';//创建时间
				if(typeof list[i].gmtCreate!='undefined'){
					var sj=(list[i].gmtCreate).split(' ');
					var lsj=sj[0].split("-").join("/");
					cjtime=lsj+" "+sj[1];
				}
				var zfstate=''; //是否支付
				if(typeof list[i].payStatus!='undefined' && list[i].payStatus!='SUCCESS'){
					zfstate='未支付';
				}else{
					zfstate='已支付';
				}
				var src='../images/wutu.png';//图片路径
				var wh={
						w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
						h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
				};
				if(typeof list[i].pay_main_src!='undefined'){
					src=list[i].pay_main_src;
					var whe="@"+wh.w+"w_"+wh.h+"h";
					src=func.imgsize(src,whe);//图片
				}
				var danleng=0;//含单量
				if(typeof list[i].trade!='undefined'){
					danleng=list[i].trade.length;
				}
				var jynum='';//交易号
				if(typeof list[i].alipayNum!='undefined'){
					jynum=list[i].alipayNum;
				}
				var zfsj='暂无';//支付时间
				if(typeof list[i].gmtPayment!='undefined'){
					var lzfsj=((list[i].gmtPayment).split(" "))[0].split("-").join("/");
					var rzfsj=((list[i].gmtPayment).split(" "))[1];
					zfsj=lzfsj+" "+rzfsj;
				}
				var zffs='暂无';//支付方式
				if(typeof list[i].paymentMethod!='undefined'){
					if(list[i].paymentMethod=='W'){
						zffs='现金';
					}else if(list[i].paymentMethod=='X'){
						zffs='微信';
					}else if(list[i].paymentMethod=='Y'){
						zffs='支付宝';
					}else if(list[i].paymentMethod=='P'){
						zffs='预存卡';
					}else{
						zffs="未知";
					}
				}
				var zje='0.00';//总金额
				if(typeof list[i].totalFee!='undefined'){
					zje=(list[i].totalFee).toFixed(2);
				}
				var btngroup='';//按钮组
				if(typeof list[i].payStatus!='undefined' && list[i].payStatus!='SUCCESS'){
					var djsnum=0;
					if(typeof list[i].time!='undefined'){
						djsnum=list[i].time;
					}
					btngroup=[
						'<div class="bottombtn">',
						'<input type="button" value="支付" class="zf"/>',
						'<input type="button" value="关闭支付" class="gbzf"/>',
						'<p class="ptime"><span class="minutes"></span>分<span class="seconds"></span>秒</p>',
						'<b style="display:none;" class="djs_haomiao">'+djsnum+'</b>',
						'<i class="icon iconfont djstb">&#xe751;</i>',
						'</div>',
					          ].join('');
				}
				var zsstgate='';
				if(list[i].yichPayType=='5'){
					//zsstgate="转售-";
					zsstgate = '<span>转售</span>';
				}
				var href='/yich/wapservice/dist/html/PaymentDetails.html?aliPayNum='+jynum+"&payType="+list[i].yichPayType;
				var selectimg='';
				if($.trim(list[i].yichPayType)==6){
					selectimg='<div><img src="../images/bai1.png" class="wutu1"/></div>';
				}else{
					selectimg='<img src="'+src+'" class="wutu2"/>';
				}
				str+=[
					'<li>',
					'<div class="divcjtime">',
						'<p class="pcjtime">创建时间：<span>'+cjtime+'</span></p>',
						'<span class="state">'+zfstate+'</span>',
					'</div>',
					'<div class="mianxx" jurl="'+href+'">',
						'<a href="javascript:;" class="a_left">',
						selectimg,
							//'<span>'+zsstgate+'含'+danleng+'单</span>',
							''+zsstgate+'',
						'</a>',
						'<div class="div_right">',
							'<p>',
								'<span class="lefttitle">交易号：</span>',
								'<span class="rightwb jyhao">'+jynum+'</span>',
							'</p>',
							'<p>',
								'<span class="lefttitle">支付时间：</span>',
								'<span class="rightwb">'+zfsj+'</span>',
							'</p>',
							'<p>',
								'<span class="lefttitle">支付方式：</span>',
								'<span class="rightwb">'+zffs+'</span>',
							'</p>',
							'<p>',
								'<span class="lefttitle">总金额：</span>',
								'<span class="rightwb" style="color:#f44336;">￥'+zje+'</span>',
							'</p>',
						'</div>',
					'</div>',
					btngroup,
					'</li>',
				      ].join('');
			}
			if(flag){
				$(".listul").html(str);
			}else{
				$(".listul").append(str);
			}
		}else{
			$(".listul").html(str);
		}
		
	}
	djstime();
};
$(".topfied").children("li").click(function(){
	$(this).addClass("active").siblings("li").removeClass("active");
	var type=$.trim($(".topfied").children(".active").text());
	if(type=="全部"){
		option='ALL';
	}else if(type=="已支付"){
		option='SUCCESS';
	}else if(type=="未支付"){
		option='NEW';
	}
	$(".listul").html('');
	$('#pageloading').show();
	dropload_obj.opts.loadUpFn(dropload_obj);
});
//支付关闭
var gbzfbtn='';
$(document).on("click",".gbzf",function(){
	$("#yingying,.alertmodel").css("display","block");
	$(".alertmodel").css("marginTop",(-$(".alertmodel").height()/2)+"px");
	gbzfbtn=$(this);
})
//隐藏框
$(".alertmodel_cancal").click(function(){
	$("#yingying,.alertmodel").css("display","none");
});
//确定
$(".alertmodel_sure").click(function(){
	//$(gbzfbtn).closest("li").remove();
	//$("#yingying,.alertmodel").css("display","none");
		var j={
				 payNum:$.trim(gbzfbtn.closest("li").find(".jyhao").text()),
		 };
		$.ajax({
			type:"POST",
			url:"/yich/PayOff",
			 data:JSON.stringify(j),
			success:function(data){
				if(typeof (data.userId)!='undefined'){
            	    func.fwh_authorize(data.userId);
            	}
				console.log(data);
				var o=data;
				if(o.flag==0){
					alert('关闭失败');
				}else{
					$(gbzfbtn).closest("li").remove();
					$("#yingying,.alertmodel").css("display","none");
				};
			}
		})
});

//倒计时
var timer=null;
function djstime(){
	clearInterval(timer);
	timer=setInterval(function(){
		djs(); 
	},1000);
	djs();
	function djs(){
		$(".djs_haomiao").each(function(){
			var t=$.trim($(this).text());
			t=parseInt(t);
			if(+t>0){
				var tt=+t-1;
				$(this).text(tt);
				var days = Math.floor(tt / 1440 / 60);
				var hours = Math.floor((tt - days * 1440 * 60) / 3600);
				var minutes = Math.floor((tt - days * 1440 * 60 - hours * 3600) / 60);
				var seconds = (tt - days * 1440 * 60 - hours * 3600 - minutes *60);
				$(this).siblings(".ptime").children(".minutes").text(tozero(minutes));
				$(this).siblings(".ptime").children(".seconds").text(tozero(seconds));
			}else{
				var j={
						 payNum:$.trim($(this).closest("li").find(".jyhao").text()),
				 };
				var me=this;
				return false
				$.ajax({
					type:"POST",
					url:"/yich/PayOff",
					 data:JSON.stringify(j),
					success:function(data){
						if(typeof (data.userId)!='undefined'){
	                	    func.fwh_authorize(data.userId);
	                	}
						console.log(data);
						var o=data;
						if(o.flag==0){
							alert('关闭失败');
						}else{
							$(me).closest("li").remove();
							$("#yingying,.alertmodel").css("display","none");
						};
					}
				})
			}
		});
	}
	
}
//支付
$(document).on("click",".zf",function(){
	window.location.href='/yich/wapservice/dist/html/checkoutCounter.html?payNum='+$(this).closest("li").find(".jyhao").text();
});
//js点击cell跳转
$(document).on('click','.mianxx',function(){
	var jurl = $(this).attr('jurl');
	window.location.href = jurl;
})

function tozero(t){
    return (t<10)?'0'+t:t;
}