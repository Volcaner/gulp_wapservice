var state = {
		page:1,
		checkNum:0, //选择商品数量,
		paySta:false,
}
var zf_starX=0,zf_satrY=0,zf_ww=0,zf_hh=0,zf_moveX=0,zf_moveY=0,zf_scrollTop,zf_ismove=false;
var zf = document.getElementById('zfgl_btn')?document.getElementById('zfgl_btn'):null;
if(zf){
var footh = document.getElementById('noPayFoot').offsetHeight+100;
var headh = document.getElementById('orderNav').offsetHeight;

var width = document.documentElement.clientWidth;
var height = document.documentElement.clientHeight;
}
$(function(){
if(zf){
zf.addEventListener('touchstart',star,false);
zf.addEventListener('touchmove',move,false);
zf.addEventListener('touchend',end,false);
}
$('#zfgl_btn').click(function(){
	window.location.href='/yich/wapservice/dist/html/PaymentManagement.html';
})
$(document).on('click','.or_goods',function(){
	var traId =$(this).closest('li').attr('traId');
	var traState =$(this).closest('li').attr('traState');
	var retState =$(this).closest('li').attr('retState');
	window.location.href="/yich/wapservice/dist/html/orderNoPayDetail.html?traId="+traId+"&traState="+traState+"&retState="+retState;
})
/*选择商品付款*/
//单选
$(document).on("click",".nopaycheck",function(){
	if(!$(this).attr('click')){
		hadcheck($(this));
		state.checkNum++;
		if(state.checkNum == $('.nopaylist li').length){
			hadcheck($('.checkall'));
		}
	}else{
		nocheck($(this));
		nocheck($('.checkall'));
		state.checkNum--;
	}
	$('.checkNum').html(state.checkNum);
	payBtnSta(state.checkNum);
});
//全选
$(document).on("click",".checkall",function(){
	var _this = $(this);
	/*if($('.nopaylist li').eq(0).attr('class') != "nogods"){*/
		if(!_this.attr('click')){
			hadcheck(_this);
			hadcheck($('.nopaycheck'));
			state.checkNum = $('.nopaylist li').length;
		}else{
			nocheck(_this);
			nocheck($('.nopaycheck'));
			state.checkNum = 0;
		}
	/*}*/
	$('.checkNum').html(state.checkNum);
	payBtnSta(state.checkNum);
});

//footer付款
$(document).on('click',"#payMoneyBtn",function(){
	if(state.paySta){
		var strid = '';
		$('.nopaylist li').each(function(){
			var ischeck = $(this).find('.nopaycheck').attr('click');
			if(ischeck){
				strid+=($(this).closest('li').attr('traId')+',');
			}
		})
		payAjax(strid);
		
	}
});


})

/*数据*/
var setOrdersData=function(data,flag){
	flag = arguments[1]?arguments[1]:false;
	//func.authorize(data.userId,state.supId);
	if(flag)$('.orderlist').html('');
	if(data.trade_list && data.trade_list.length>0){
		var list = data.trade_list;
		for(var i in list){
			var fstr= '',cstr = '',trueMoney = 0,totalMoney = 0,favMoney = 0,goodsMony = 0;
			var mylist = list[i].tradeOrderList;
			for(var j in mylist){
				var orginPrice  = '';
				if(mylist[j].orginPrice && mylist[j].orginPrice != 0){
					orginPrice = '<del>￥'+mylist[j].orginPrice.toFixed(2)+'</del>';
					totalMoney += (mylist[j].orginPrice*mylist[j].traAmount);
					//if(mylist[j].pricetemplateId && mylist[j].pricetemplateId !="N"){
						favMoney += ((mylist[j].orginPrice-mylist[j].price)*mylist[j].traAmount);
					//}
				}else{
					totalMoney += (mylist[j].price*mylist[j].traAmount);
				}
				
				goodsMony += (mylist[j].price*mylist[j].traAmount);
				var wh={
						w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
						h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
				};
				var whe="@"+wh.w+"w_"+wh.h+"h";
				var _src=func.imgsize(mylist[j].shopInv.product.proImage.src,whe);
				var hzpricesmodel = (mylist[j].pricetemplateId && mylist[j].pricetemplateId !="N")?'<span class="btn-display-pink">合作商价格</span>':'';
				hzpricesmodel += (mylist[j].shopInv.price && mylist[j].shopInv.price !="0")?'<span class="btn-display-orange">一件代发</span>':'';
				hzpricesmodel += (mylist[j].isModify && mylist[j].isModify !="0")?'<span class="btn-display-nomal">已改价</span>':'';
				var traAmount = parseInt(mylist[j].traAmount)>999?"999<sup>+</sup>":mylist[j].traAmount;
				var noafterSalse = mylist[j].customer_service == "N"?'<span class="noafterSalse">暂不支持售后</span>':'';
				cstr+=[
						'<section class="or_goods">',
							'<a href="/yich/wapservice/dist/html/goods_detail_page.html?proId='+mylist[j].shopInv.pro_id+'"><img src="'+_src+'">'+noafterSalse+'</a>',
							'<p>',
								'<a href="javascript:;">'+mylist[j].title+'</a>',
								'<span>'+mylist[j].skuPropertiesName+'</span>',
								'<span>'+hzpricesmodel+'</span>',
							'</p>',
							'<p>',
								'<span>￥'+mylist[j].price.toFixed(2)+'</span>',
								''+orginPrice+'',
								'<span>x'+traAmount+'件</span>',
							'</p>',
						'</section>',
				      ].join("");
			}
			//trueMoney  = (goodsMony+parseFloat(list[i].log_money?list[i].log_money:0)).toFixed(2);
			trueMoney = (list[i].payment).toFixed(2);
			var buttonStr = '<span class="or_btnbox">'+
								'<input type="button" class="click-btn cancelgoodsBtn" value="作废订单">'+
								'<input type="button" class="click-btn-redcolor singelpayBtn" value="付款">'+
							'</span>';
			var log_money =  list[i].log_money?list[i].log_money.toFixed(2):'0.00';
			fstr = [
					'<li traId="'+list[i].tra_id+'" payNum="'+list[i].alipay_num+'" traState="'+list[i].tra_state+'" retState="'+list[i].return_state+'">',
						'<p class="or_title">',
							'<span><span class="nopaycheck"><i class="icon-unchecked"></i></span>'+list[i].supplierShop.supshop_name+'</span>',
							'<span>未付款</span>',
						'</p>',
						''+cstr+'',
						'<p class="or_price">',
							'<span>商品金额:<i>￥'+totalMoney.toFixed(2)+'</i></span>',
							'<span>运费:<i>￥'+log_money+'</i></span>',
							'<span>合作商价格优惠:<i>￥'+favMoney.toFixed(2)+'</i></span>',
						'</p>',
						'<p><span>实付金额:<i>￥'+trueMoney+'</i></span>'+buttonStr+'</p>',
					'</li>',
			       ].join("");
			$('.orderlist').append(fstr);
		}
	}
	
}


//选中
function hadcheck(pro){
	pro.find('i').removeClass();
	pro.find('i').addClass("icon-checked icon-active");
	pro.attr("click","click");
}
//撤销选中
function nocheck(pro){
	pro.find('i').removeClass();
	pro.find('i').addClass("icon-unchecked");
	pro.attr("click",null);
}
function payBtnSta(n){
	if(n>0){
		$('#payMoneyBtn').addClass("button-active");
		state.paySta = true;
	}else{
		$('#payMoneyBtn').removeClass("button-active");
		state.paySta = false;
	}
}
function nopayCheckNum(){
	var thisNum = 0;
	$('.nopaylist li').each(function(){
		if($(this).find('.nopaycheck').attr('click') == "click"){
			thisNum++;
		}
	})
	if(thisNum == $('.nopaylist li').length && thisNum != 0){
		hadcheck($('.checkall'));
	}else if(thisNum == 0){
		state.checkNum = 0;
		nocheck($('.checkall'));
	}else{
		nocheck($('.checkall'));
	}
	$('.checkNum').html(state.checkNum);
	payBtnSta(state.checkNum);
}


//付款ajax
function payAjax(tradId){
	$.ajax({
		type:'post',
		url:'/yich/PhonepaymentServlet',
		data:{WIDout_trade_no:tradId,option:"first"},
		dataType:'json',
		success:function(data){
			//404
			checkErrorAjax(data);
			if(data.flag == "true"){
				window.location.href="/yich/wapservice/dist/html/checkoutCounter.html?payNum="+data.payNum;
			}else if(data.flag == "false"){
				var str = "包含已创建支付号的订单<br>请前往支付管理关闭或支付";
				konwsMTfunc(str);
			}
		},
		error:function(err){},
	})
}


/*************支付管理按钮移动***************/
function star(event){
    zf_starX = parseInt(event.touches[0].pageX);
    zf_satrY = parseInt(event.touches[0].pageY);
    zf_scrollTop = window.pageYOffset;
    zf_ww = zf.offsetWidth;
    zf_hh = zf.offsetHeight;
    zf_ismove = false;
}
function move(event){
	zf_ismove = true;
	event.preventDefault();
    zf_moveX = parseInt(event.changedTouches[0].pageX);
    zf_moveY = parseInt(event.changedTouches[0].pageY);

    zf.style.transition = "all 0s";
    var cliw = Math.ceil(width-zf_moveX);
    var clih = Math.ceil(height-zf_moveY+zf_scrollTop);
    if(cliw>zf_ww/2 && cliw<(width-zf_ww/2)){
         zf.style.left = (zf_moveX-zf_ww/2)+'px';
    }else if(cliw<zf_ww/2){
         zf.style.left = (width-zf_ww)+'px';
    }else if(cliw>(width-zf_ww/2)){
         zf.style.left = 0+'px';
    }

    if(clih>(zf_hh/2+footh) && clih<(height-zf_hh/2-headh)){
        zf.style.bottom = (clih-zf_hh/2)+'px';
    }else if(clih<=(zf_hh/2+footh)){
        zf.style.bottom = (footh)+'px';
    }else if(clih>(height-zf_hh/2-headh)){
        zf.style.bottom = (height-zf_hh-headh)+'px';
    }

}
function end(){
	 if((zf_moveX-zf_starX)>=0){
	        if(zf_moveX>=width/2){
	            zf.style.left= (width-zf_ww)+"px";
	        }else{
	            zf.style.left= 0+"px";
	        }
	    }else{
	       if(zf_moveX<width/2 && zf_moveX >0){
	            zf.style.left= 0+"px";
	        }else{
	            zf.style.left= (width-zf_ww)+"px";
	        }
	    } 
    zf.style.transition = "all 500ms";
}