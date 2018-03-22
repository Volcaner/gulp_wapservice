var state = {
	alipayId:_getReg('payNum'),
	type:_getReg('type'),
	supId:_getReg('supId'),
	whopay:"", //支付方式
	istime:'', //倒计时
	timer:999, //倒计时时间
	setTime:null,//延时ID
	payBtn:true,//
	truePayMoney:0,//最终支付金额
	trueBalance:0,//余额
	cardList:[],//预存卡
	cardId:'',
	cardSoldId:'',
	cardBalance:0,
	orderLogMoney:0,//快递金额
	pmcIndex:0,
	orderPayMoney:0,//初始支付金额
}
$(function(){
	satrAjax();
	runtime();
	$('#wechat').click(function(){
		if($(this).children('i').hasClass('icon-active')){
			$(this).find('.wx').removeClass('icon-checked icon-active').addClass('icon-unchecked');
			state.whopay = "";
		}else{
			$(this).find('.wx').removeClass('icon-unchecked');
			$(this).find('.wx').addClass('icon-checked icon-active').closest('li').siblings().children('i').removeClass('icon-checked icon-active').addClass('icon-unchecked');
			state.whopay = "weChat";
		}
		resetPayMoney();
		
	})
	/*$('#alipay').click(function(){
		$(this).find('.zfb').addClass('checkColor').closest('li').siblings().children().removeClass('checkColor');
		state.whopay = "alipay";
	})*/
	$('#blance').click(function(){
		if($(this).children('i').hasClass('icon-active')){
			$(this).find('.ye').removeClass('icon-checked icon-active').addClass('icon-unchecked');
			state.whopay = "";
		}else{
			$(this).find('.ye').removeClass('icon-unchecked');
			$(this).find('.ye').addClass('icon-checked icon-active').closest('li').siblings().children('i').removeClass('icon-checked icon-active').addClass('icon-unchecked');
			state.whopay = "balpay";
		}
		resetPayMoney();
		
	})
	$('#precard').click(function(){
		if($(this).children('i').hasClass('icon-active')){
			$(this).find('.pc').removeClass('icon-checked icon-active').addClass('icon-unchecked');
			state.whopay = "";
			resetPayMoney();
		}else{
			$(this).find('.pc').removeClass('icon-unchecked');
			$(this).find('.pc').addClass('icon-checked icon-active').closest('li').siblings().children('i').removeClass('icon-checked icon-active').addClass('icon-unchecked');
			state.whopay = "precard";
			resetPayMoney(state.pmcIndex);
		}
		
	})
	/*var isnomal = '';*/
	var addstr = '';
	var flag=false;
	var fristflag = true;
	$('.nabla').click(function(e){
		e.stopPropagation();
		if(state.cardList.length>0){
			if($('.nabla').hasClass('icon-nabla')){
				$(this).addClass('icon-upTriangle').removeClass('icon-nabla');
			}else{
				$(this).addClass('icon-nabla').removeClass('icon-upTriangle');
			}
		}
		if(!flag){
			if(!addstr){
				var logMoney = parseFloat(state.orderLogMoney);
				for(var i=0;i<state.cardList.length;i++){
					var afterZf = (state.orderPayMoney-logMoney)*((state.cardList[i].prestoreCard.discount)/10)+logMoney;
					if(state.cardList[i].card_balance>afterZf){
						if(fristflag){
							addstr+=[
							         '<li class="cardDetail redcard" preIndex="'+i+'"><div class="cardTitle"><p class="fontbig redcolor">'+state.cardList[i].prestoreCard.prestore_card_name+'</p><p class="fontsmall redcolor">'+state.cardList[i].prestore_card_sold_id+'</p></div><p class="fontsmall redcolor">(余额￥'+state.cardList[i].card_balance+')</p></li>'
							        ].join('');
							fristflag= false;
						}else{
							addstr+=[
							         '<li class="cardDetail graycard" preIndex="'+i+'"><div class="cardTitle"><p class="fontbig graycolor">'+state.cardList[i].prestoreCard.prestore_card_name+'</p><p class="fontsmall graycolor">'+state.cardList[i].prestore_card_sold_id+'</p></div><p class="fontsmall graycolor">(余额￥'+state.cardList[i].card_balance+')</p></li>'
							        ].join('');
						}
					}else{
						addstr+=[
						         '<li class="cardDetail nocard"><div class="cardTitle"><p class="fontbig nocolor">'+state.cardList[i].prestoreCard.prestore_card_name+'</p><p class="fontsmall nocolor">'+state.cardList[i].prestore_card_sold_id+'</p></div><p class="fontsmall nocolor">(余额￥'+state.cardList[i].card_balance+')</p></li>'
						        ].join('');
					}
				}
				$('.payKinds').append(addstr);
			}else{
				$('.cardDetail').show();
			}
			flag=true;
		}else{
			$('.cardDetail').hide();
			flag=false;
		}
		//点击选中
		setPmcCellCheck($('#precard'));
	});
	$(document).on('click','.graycard',function(){
		var index = $(this).attr('preIndex')?$(this).attr('preIndex'):0;
		$('.redcolor').addClass('graycolor').removeClass('redcolor');
		$(this).find('p').removeClass('graycolor').addClass('redcolor');
		$('.redcard').addClass('graycard').removeClass('redcard');
		$(this).addClass('redcard').removeClass('graycard');
		state.cardId = state.cardList[$(this).index()-3].prestoreCard.prestore_card_id;
		state.cardBalance = state.cardList[$(this).index()-3].card_balance;
		state.cardSoldId = state.cardList[$(this).index()-3].prestore_card_sold_id;
		$('.cardName').text(state.cardList[$(this).index()-3].prestoreCard.prestore_card_name+'('+state.cardList[$(this).index()-3].prestoreCard.prestore_card_id+')');
		state.pmcIndex = index;
		//点击选中
		setPmcCellCheck($('#precard'));
	});
	//支付
	$('#gopayBtn').click(function(){
		var payPrice = ($('.payMoney').text() && $('.payMoney').text().split('￥')[1]) ? parseFloat($('.payMoney').text().split('￥')[1]) : 0; 
		if(payPrice<=0 || !state.payBtn || state.timer<=0){
			return false;
		}
		if(state.whopay =='weChat'){
			$.ajax({
				type:"post",
				url:"/yich/PhoneWeChatPayServlet",
				dataType:"json",
				async:false,
				data:{payNum:state.alipayId},
				success:function(data){
					if(typeof (data.userId)!='undefined'){
					    func.fwh_authorize(data.userId);
					}
					//404
					//checkErrorAjax(data);
					var appId = data.appId;
					var timeStamp = data.timeStamp;
					var nonceStr = data.nonceStr;
					var packages = data['package'];
					var signType = data.signType;
					var paySign = data.paySign;
					var agent = data.agent?parseInt(data.agent):1;
					if(agent<5){
						var prompt = new promptFunc();
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
		}else if(state.whopay =='alipay'){
			
		}else if(state.whopay =='balpay'||state.whopay=='precard'){
			var keyBoard = new keyBoardPay();
			var balance = '';
			if(state.whopay =='balpay'){
				balance = state.trueBalance;
			}else{
				balance = state.cardBalance;
			}
			//支付键盘
			keyBoard.init({
				"type":"payment",
				 "money":state.truePayMoney,
				 "balance":balance,
				 "func":function(pwd){
					 endAjax(pwd);
				 },
			})
			
		}
	})

	

})

//初始ajax
function satrAjax(){
	$.ajax({
		type:"post",
		url:"/yich/PhoneBalanceSelect",
		dataType:"json",
		data:{payNum:state.alipayId},
		success:function(data){
			if(typeof (data.userId)!='undefined'){
			    func.fwh_authorize(data.userId);
			}
			//404
			//checkErrorAjax(data);
			/*func.authorize(data.userId,state.supId);*/
			if(data.flag == "1"){
				var pyprice = data.totalFee?parseFloat(data.totalFee).toFixed(2):"0.00";
				var pyprice1 = data.totalFee?parseFloat(data.totalFee).toFixed(2).split('.')[0]:"0";
				var pyprice2 = data.totalFee?parseFloat(data.totalFee).toFixed(2).split('.')[1]:"00";
				var syprice = data.balance?parseFloat(data.balance).toFixed(2):"0.00";
				state.timer = data.time;
				$('.payMoney').html('<i>￥</i>'+pyprice1+'.<i>'+pyprice2+'</i>');
				$('.balance').text("(余额￥"+syprice+")");
				
				state.truePayMoney = pyprice;
				state.orderPayMoney = pyprice;
				state.trueBalance = syprice;
				$.ajax({
					type:"post",
					url:"/yich/PayMoneyGetPrestoreCardServlet",
					dataType:"json",
					data:{payNum:state.alipayId},
					success:function(res){
						if(typeof (res.userId)!='undefined'){
						    func.fwh_authorize(res.userId);
						}
						if(res.prestoreCardSoldList.length>0){
							$('#precard').show();
							$('#precard').css('display','flex');
							state.orderLogMoney = res.log_money;
							state.cardList = res.prestoreCardSoldList;
							var logMoney = res.log_money?parseFloat(res.log_money):0;
							for(var i=0; i<res.prestoreCardSoldList.length; i++){
								var afterZf = (state.orderPayMoney-logMoney)*((res.prestoreCardSoldList[i].prestoreCard.discount)/10)+logMoney;
								if(res.prestoreCardSoldList[i].card_balance>afterZf){
									$('.cardName').text(res.prestoreCardSoldList[i].prestoreCard.prestore_card_name+'('+res.prestoreCardSoldList[i].prestoreCard.prestore_card_id+')');
									state.cardId = res.prestoreCardSoldList[i].prestoreCard.prestore_card_id;
									state.cardBalance = res.prestoreCardSoldList[i].card_balance;
									state.cardSoldId = res.prestoreCardSoldList[i].prestore_card_sold_id;
									state.pmcIndex = i;
									break;
								}
								$('.cardName').text('暂无可用');
							}
						}else{
							$('#precard').hide();
						}
					},
					error:function(err){
						//alert(err)
					},
				})
			}else{
				var prompt = new promptFunc();
				 prompt.init({
				      type:"",
				      text:"支付页面错误!",
				  });
			}
		},
		error:function(err){
			//alert(err)
		},
	});
}
//倒计时
state.istime = setInterval(runtime,1000);
function runtime(){
	if(state.timer<999){
		clearInterval(state.istime);
		state.istime=null;
		state.payBtn = false;
		$('#gopayBtn').css("background","#adadad")
		$('#gopayBtn').html("时间到期该订单支付已关闭！");
		var j={"payNum":state.alipayId};
		$.ajax({
    		type:"POST",
    		url:"/yich/PhonePayOff",
    		data:JSON.stringify(j),
    		success:function(data){
    			if(typeof (data.userId)!='undefined'){
    			    func.fwh_authorize(data.userId);
    			}
    			/*var o=eval("("+data+")");*/
    			//checkErrorAjax(data);
    			var prompt = new promptFunc();
    			if(data.flag==0){
 				 prompt.init({
 				      type:"",
 				      text:"支付关闭失败!",
 				  });
    			}else{
				 prompt.init({
				      type:"",
				      text:"该订单支付已关闭,请重新下单!",
				  });
    			};
    		}
    	})
	}else{
		var mm=parseInt(state.timer/60000);
		var ss=parseInt(state.timer/1000%60);
		mm=String(mm);
		ss=String(ss);
		mm=mm.length<2?('0'+mm):mm;
		ss=ss.length<2?('0'+ss):ss;	
		$('#fen').html(mm);
		$('#miao').html(ss);
		state.timer-=1000;	
	}
	
}

/**********余额支付*************/
function endAjax(pwd){
		var param = '0'; //0支付
		$.ajax({
			type:"post",
			url:"/yich/SendKey",
			dataType:"json",
			success:function(data){
				var firstjson=data;
  				setMaxDigits(130);
  				var key = new RSAKeyPair(firstjson.empoent,"",firstjson.module);
  				var result= encryptedString(key,pwd);
  				if(state.whopay=="balpay"){
  					$.ajax({
  	  					type:"post",
  	  					url:"/yich/BalancePayServlet",
  	  					dataType:"json",
  	  					data:"{\"pwd\":\""+result+"\",\"extra_common_param\":\""+param+"\",\"payNum\":\""+state.alipayId+"\"}",
  	  					success:function(data){
  	  					if(typeof (data.userId)!='undefined'){
	  	  				    func.fwh_authorize(data.userId);
	  	  				}
  	  						//404
  	  						//checkErrorAjax(data);
  	  						var result=data.result;
  	  						var prompt = new promptFunc();
  	  						 
  	  						 if(result=='locked'){
  			                    	prompt.init({
  			  						      type:"",
  			  						      text:"今日输入已达到上限!",
  			  						  });
  		                       }else if(result=='pwderror'){
  		                    		   prompt.init({
  				  						      type:"",
  				  						      text:"密码错误!",
  				  						  });
  		                        }else if(result=='error'){
  			                    	 prompt.init({
  			  						      type:"",
  			  						      text:"支付异常!",
  			  						  });
  		                        }else if(result==-1){
  			                    	 prompt.init({
  			  						      type:"",
  			  						      text:"余额不足<br>请充值后支付或选择其他支付方式",
  			  						  });
  		                        }else if(result==1){
  			                    	 prompt.init({
  			  						      type:"",
  			  						      text:"付款成功！",
  			  						      func:function(){
  			  						    	  if(state.type && state.type=="0"){
  			  						    		window.location.replace("/yich/wap/src/html/goodspayFinal.html?supId="+state.supId+"&payNum="+state.alipayId);
  			  						    	  }else{
  			  						    		window.location.replace("/yich/wapservice/dist/html/paySuccess.html?payNum="+state.alipayId+"&payMoney="+state.truePayMoney);
  			  						    	  }
  			  						      },
  			  						  });
  		                        }else if(result==0){
  			                    	 prompt.init({
  			  						      type:"",
  			  						      text:"支付失败<br>已支付过该订单",
  			  						  });
  		                        }else{
  		                        	prompt.init({
  			  						      type:"",
  			  						      text:"服务器开小差啦！",
  			  						  });
  		                        }
  	  					},
  	  					error:function(err){},
  	  				})
  				}else{
  					$.ajax({
  	  					type:"post",
  	  					url:"/yich/PredepositCardPaymentServlet",
  	  					dataType:"json",
  	  					data:"{\"pwd\":\""+result+"\",\"prestoreCardsoldId\":\""+state.cardSoldId+"\",\"payNum\":\""+state.alipayId+"\"}",
  	  					success:function(data){
  	  					if(typeof (data.userId)!='undefined'){
	  	  				    func.fwh_authorize(data.userId);
	  	  				}
  	  						//404
  	  						//checkErrorAjax(data);
  	  						var prompt = new promptFunc();
  	  						 if(data.result=='locked' && data.flag==0){
  			                    	prompt.init({
  			  						      type:"",
  			  						      text:"今日输入已达到上限!",
  			  						  });
  		                       }else if(data.result=='pwderror' && data.flag==0){
  		                    	   var str = '交易密码不正确,今日还有'+data.count+'次机会'
  		                    	   if(state.type==1){
    		                    	   chekMTfunc(str,function(){
    		                    		   window.location.href='/yich/wapservice/dist/html/business_center_setting.html';
    		                    	   },"忘记密码");
  		                    	   }else{
  		                    		  prompt.init({
 			  						      type:"",
 			  						      text:str,
 			  						  });
  		                    	   }	                    	   
  		                        }else if(data.result=='error' && data.flag==0){
  			                    	 prompt.init({
  			  						      type:"",
  			  						      text:"支付异常!",
  			  						  });
  		                        }else if(data.flag==-1){
  			                    	 prompt.init({
  			  						      type:"",
  			  						      text:"余额不足<br>请充值后支付或选择其他支付方式",
  			  						  });
  		                        }else if(data.flag==1){
  			                    	 prompt.init({
  			  						      type:"",
  			  						      text:"付款成功！",
  			  						      func:function(){
  			  						    	if(state.type && state.type=="0"){
			  						    		window.location.replace("/yich/wap/src/html/goodspayFinal.html?supId="+state.supId+"&payNum="+state.alipayId);
			  						    	}else{
			  						    		window.location.replace("/yich/wapservice/dist/html/paySuccess.html?payNum="+state.alipayId+"&payMoney="+data.total);
			  						    	}
  			  						      },
  			  						  });
  		                        }else if(data.flag==2){
			                    	 prompt.init({
			  						      type:"",
			  						      text:"不存在预售卡",
			  						  });
  		                        }else if(data.flag==4){
			                    	 prompt.init({
			  						      type:"",
			  						      text:"此订单已支付",
			  						  });
  		                        }else if(data.flag==3){
			                    	 prompt.init({
			  						      type:"",
			  						      text:"多商户订单",
			  						  });
  		                        }else if(data.flag==5){
			                    	 prompt.init({
			  						      type:"",
			  						      text:"子单查询失败",
			  						  });
  		                        }else{
  		                        	prompt.init({
  			  						      type:"",
  			  						      text:"服务器开小差啦！",
  			  						  });
  		                        }
  	  					},
  	  					error:function(err){},
  	  				})
  				}
  				
			},
			error:function(err){},
		})
}
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
		        	   if(state.type && state.type=="0"){
				    		window.location.replace("/yich/wap/src/html/goodspayFinal.html?supId="+state.supId+"&payNum="+state.alipayId);
				    	}else{
				    		window.location.replace("/yich/wapservice/dist/html/paySuccess.html?payNum="+state.alipayId+"&payMoney="+state.truePayMoney);
				    	}
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
function resetPayMoney(index){
	if(index || index == 0){//选择预存卡时传参
		var be_paymoney = parseFloat(state.orderPayMoney);
		var be_logmoney = parseFloat(state.orderLogMoney);
		var be_discount = parseFloat(state.cardList[index]?state.cardList[index].prestoreCard.discount:10)/10;
		var be_truePrice = ((be_paymoney-be_logmoney)*be_discount).toFixed(2);
		state.truePayMoney = be_truePrice?(parseFloat(be_truePrice)+be_logmoney).toFixed(2):(0.01+be_logmoney).toFixed(2);
	}else{
		state.truePayMoney = state.orderPayMoney;
	}

	var pyprice1 = state.truePayMoney?parseFloat(state.truePayMoney).toFixed(2).split('.')[0]:"0";
	var pyprice2 = state.truePayMoney?parseFloat(state.truePayMoney).toFixed(2).split('.')[1]:"00";
	$('.payMoney').html('<i>￥</i>'+pyprice1+'.<i>'+pyprice2+'</i>');
}
function setPmcCellCheck(_this){
	$(_this).find('.pc').removeClass('icon-unchecked');
	$(_this).find('.pc').addClass('icon-checked icon-active').closest('li').siblings().children('i').removeClass('icon-checked icon-active').addClass('icon-unchecked');
	state.whopay = "precard";
	resetPayMoney(state.pmcIndex);
}