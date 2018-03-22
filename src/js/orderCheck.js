var state ={
		supId:_getReg('supId'),
		traId:_getReg('traId'),
		traIds:[],//所有id集合
		starData:[],
		proIds:[],
		payPrice:0,
		setTime:null,//延时器
		
}
$(function(){
	setStarData();
	
	$('.checkBtn').click(function(){
		if(state.payPrice<=0){
			return false;
		}
		payAjax(state.traIds)
	})
	$('#taobaoId').blur(function(){
		var wang = $(this).val(); 
		var traIds = state.traIds.join(":");
		if(wang && traIds){
			$.ajax({
				type:"post",
				url:"/yich/PhoneChangeWangOrMemo",
				dataType:"json",
				data:{option:"wang",traIds:traIds,wang:wang},
				success:function(data){
					if(data.result == 1){
						
					}
				},error:function(){},
			})
		}
	})
	$(document).on('blur','.cellmemo',function(){
		var traId = $(this).closest('li').attr('traId'); 
		var memo = $(this).val();
		if(memo && traId){
			$.ajax({
				type:"post",
				url:"/yich/PhoneChangeWangOrMemo",
				dataType:"json",
				data:{option:"memo",traId:traId,memo:memo},
				success:function(data){
					if(data.result == 1){
						
					}
				},error:function(){},
			})
		}
	})
	
})
/*var arr = [{id:"1",name:"",child:[{id:'1',name:'圆通快递'},{id:'2',name:'等帮物流'},{id:"3",name:"邮政快递"}]}]*/
function setStarData(){
	var flist = '',clist = '',totalMoney = 0,favMoney = 0,sureMoney = 0,tempPrice = 0,orderSta = '';
	state.proIds = [];
	$.ajax({
		type:"post",
		url:"/yich/PhoneRecordedTradesInfo",
		dataType:"json",
		data:{traIds:state.traId},
		success:function(data){
			//404
			//checkErrorAjax(data);
			//func.authorize(data.userId,state.supId);
			if(data.data){
				state.starData = data.data;
				$('.o_conBox').html("");
				var list = data.data;
				for(var i in list){
					var mylist = list[i].roList;
					for(var j in mylist){
						var orginPrice  = '',sku='';
						if(mylist[j].proId){
							state.proIds.push(mylist[j].proId);
						}
						if(mylist[j].orginPrice && mylist[j].orginPrice != 0){
							orginPrice = '<del>￥'+mylist[j].orginPrice+'</del>';
							totalMoney += (mylist[j].orginPrice*mylist[j].traAmount);
							if(mylist[j].pricetemplateId && mylist[j].pricetemplateId !="N"){
								favMoney += ((mylist[j].orginPrice-mylist[j].price)*mylist[j].traAmount);
							}
						}else{
							totalMoney += (mylist[j].price*mylist[j].traAmount);
						}
						if(mylist[j].skuPropertiesName){
							var sku1 = mylist[j].skuPropertiesName.split(";")[0]?mylist[j].skuPropertiesName.split(";")[0].split(":")[1]:'';
							var sku2 = mylist[j].skuPropertiesName.split(";")[1]?mylist[j].skuPropertiesName.split(";")[1].split(":")[1]:'';
							sku = (sku1 &&sku2)?sku1+"/"+sku2:(sku1?sku1:'');
						}
						tempPrice += (mylist[j].price*mylist[j].traAmount);
						var wh={
								w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
								h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
						};
						var whe="@"+wh.w+"w_"+wh.h+"h";
						var _src=func.imgsize(mylist[j].src,whe);
						var hzpricestr = mylist[j].pricetemplate_id?'<span class="btn-display-pink">合作商价格</span>':'';
						var traAmount = parseInt(mylist[j].traAmount)>999?"999<sup>+</sup>":mylist[j].traAmount;
						var noafterSalse = mylist[j].customer_service == "N"?'<span class="noafterSalse">暂不支持售后</span>':'';
						clist +=[
								'<div class="goodsContent">',
									'<a href="javascript:;"><img src="'+_src+'">'+noafterSalse+'</a>',
									'<p>',
										'<a href="javascript:;">'+mylist[j].proName+'</a>',
										'<span>'+sku+'</span>',
										''+hzpricestr+'',
									'</p>',
									'<p>',
										'<span>￥'+mylist[j].price+'</span>',
										''+orginPrice+'',
										'<span>x'+traAmount+'件</span>',
									'</p>',
								'</div>',
						        ].join('');
					}
					var posarr = list[i].lpList?list[i].lpList:[];
					var arr= [];
					var json = {id:"1",name:"",child:[]};
					for(var p in posarr){
						var temp = {};
						temp.id = p;
						temp.name = posarr[p].logcpName+' , '+parseFloat(posarr[p].price).toFixed(2)+'元';
						json.child.push(temp);
					}
					
					sureMoney  = (parseFloat(tempPrice)+parseFloat(list[i].logMoney)).toFixed(2);
					var temptraid = list[i].traId?list[i].traId:'';
					state.traIds.push(temptraid);
					state.payPrice += parseFloat(sureMoney);
					
					flist=[
						'<li traId="'+list[i].traId+'">',
							'<p class="od_title">',
								'<span>'+list[i].supName+'</span>',
							'</p>',
							'<section class="or_goods">',
							''+clist+'',
							'</section>',
							'<div class="checkpost">',
								'<p>',
									'<i class="icon-post"></i>',
									'<span id="demo'+i+'">快递&nbsp;:&nbsp;<input class="wlpost" type="text" id="cityname'+i+'" value="'+list[i].logcpName+' , '+list[i].logMoney+'元" placeholder="请选择快递&nbsp;" disabled></span>',
								'</p>',
								'<i class="icon-menu-right"></i>',
							'</div>',
							'<dl class="oc_message">',
								'<dt>',
									'<i class="icon-message"></i>',
									'<span><span>留言&nbsp;:&nbsp;</span><input type="text" class="cellmemo" value="'+list[i].sellerMemo+'" maxlength="50" placeholder="给供货商的留言（选填）"></span>',
								'</dt>',
								'<dd>',
									'<i class="icon-edit"></i>',
								'</dd>',
							'</dl>',
							'<p class="or_price">',
								'<span>商品金额:<i>￥'+totalMoney.toFixed(2)+'</i></span>',
								'<span class="postmoney">运费:<i>￥'+list[i].logMoney+'</i></span>',
								'<span>合作商价格优惠:<i>￥'+favMoney.toFixed(2)+'</i></span>',
							'</p>',
							'<p class="oc_mixprice">应付金额:<span>￥'+sureMoney+'</span></p>',
						'</li>',
					      ].join('');
					clist = '';
					totalMoney = 0;
					favMoney = 0;
					sureMoney = 0;
					tempPrice = 0;
					$('.o_conBox').append(flist);
					arr.push(json);
					if(list[i].logcpName != "统一运费"){
						postcar("area"+i,arr,"#demo"+i,"#cityname"+i);
					}
					
					}
						var receiver = list[0].receiver?list[0].receiver:'';
						var receiverTel = list[0].receiverTel?list[0].receiverTel:'';
						var receiverAdd = list[0].traAdd?list[0].traAdd:'';
						var taobaoId = list[0].name?list[0].name:'';
						var allprice1 = state.payPrice?parseFloat(state.payPrice).toFixed(2).split('.')[0]:'0';
						var allprice2 = state.payPrice?parseFloat(state.payPrice).toFixed(2).split('.')[1]:'00';
						$('.adresspost dt').html('<i class="icon-adress-outline"></i><span>'+receiver+'</span><span class="telnumber">'+receiverTel+'</span>');
						$('.adresspost dd').html(receiverAdd);
						$('#taobaoId').val(taobaoId);
						$('.checkMoney').html('<i>￥</i>'+allprice1+'.<i>'+allprice2+'</i>');
					//delCaiGdData(state.proIds);//删除采录库下单后的商品
				
				}
			},
			error:function(err){},
		});
	
}
function delCaiGdData(ids){
	var locname =  "localobject_"+state.supId;
	if(window.localStorage && (window.localStorage)[locname]){
		var list = JSON.parse(localStorage.getItem(locname))?JSON.parse(localStorage.getItem(locname)):[];
		for(var j in ids){
			for(var i in list){
				if(ids[j] == list[i].pro_id){
					list.splice(i,1);
				}
			}
		}
		localStorage.removeItem(locname);
		if(list.length>0){
			localStorage.setItem(locname,JSON.stringify(list));
		}
	}
	
};

function postcar(area,arr,clickId,valueId,index){
	 area = new LArea();
	    area.init({
	        'trigger': clickId, //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
	        'cityName': valueId,
	        'keys': {
	            id: 'id',
	            name: 'name'
	        }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
	        'type': 1, //数据源类型
	        'data': arr, //数据源
	        'level':1,
	    });
	    area.value=[0,0,0];//控制初始位置，注意：该方法并不会影响到input的value
}
function funback(val,id){
	var _this = id;
	if(_this){
		var traId = $(_this).closest('li').attr('traId');
		var logname = val?trim(val.split(',')[0]):'';
		var logMoney = 0;
		var cellPrice = 0,tempPrice = 0;
		var list = state.starData;
		for(var i in list){
			if(traId == list[i].traId){
				var postlist = list[i].lpList;
				var clist = list[i].roList;
				for(var j in postlist){
					if(logname && logname == postlist[j].logcpName){
						logMoney = parseFloat(postlist[j].price);
					}
				}
				for(var c in clist){
					tempPrice += (parseFloat(clist[c].price)*parseInt(clist[c].traAmount));
				}
				cellPrice = tempPrice+logMoney;
			}
		}
	if(logname){
		$.ajax({
			type:"post",
			url:"/yich/PhoneServiceCheckLogMoney",
			dataType:"json",
			data:{traId:traId,logMoney:logMoney,logname:logname,},
			success:function(data){
				//404
				//checkErrorAjax(data);
				if(data.result == 1){
					$(_this).closest('li').find('.postmoney>i').html('￥'+logMoney.toFixed(2));
					$(_this).closest('li').find('.oc_mixprice>span').html('￥'+cellPrice.toFixed(2));
					JSAllPrice();
				}
			},
			error:function(err){},
		})
	}
};
	
	
	
}
//付款
function payAjax(traId){
	var tempTraids = (traId && traId.length>0)?traId.join(","):'';
	$.ajax({
		type:'post',
		url:'/yich/PhoneAlipayapiServlet',
		data:{WIDout_trade_no:tempTraids,option:"first"},
		dataType:'json',
		success:function(data){
			//404
			//checkErrorAjax(data);
			if(data.flag == "true"){
				window.location.href="/yich/wapservice/dist/html/checkoutCounter.html?payNum="+data.payNum+"&type=1";
			}else if(data.flag == "false"){
				var str = "付款失败！<br>请前往支付管理支付!";
				chekMTfunc(str,function(){
					window.location.href='/yich/wapservice/dist/html/PaymentManagement.html';
				},"去支付管理");
				
			}
		},
		error:function(err){},
	})
}
//总金额
function JSAllPrice(){
	var pp=0.00;
	$('.o_conBox>li').each(function(){
		if($(this).find('.oc_mixprice>span').text().split('￥')[1]){
			pp += parseFloat($(this).find('.oc_mixprice>span').text().split('￥')[1]);
		}
		 
	})
	var allprice1 = pp?parseFloat(pp).toFixed(2).split('.')[0]:'0';
	var allprice2 = pp?parseFloat(pp).toFixed(2).split('.')[1]:'00';
	$('.checkMoney').html('<i>￥</i>'+allprice1+'.<i>'+allprice2+'</i>');
}
//去空格
function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g, "");
}


