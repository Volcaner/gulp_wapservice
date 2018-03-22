var state={
		goodNo:window.location.href.split('goodsNo=')[1]?unescape(window.location.href.split('goodsNo=')[1].split('&supId=')[0]):'',
		//goodNo:"456789-000,666-000,zzz-000,1-00Q",
		isTemp:window.location.href.split("isTemp=")[1]?window.location.href.split("isTemp=")[1].split('&')[0]:false,//是否临时地址
		cache:window.location.href.split("cache=")[1]?window.location.href.split("cache=")[1].split('&')[0]:false,//是否为缓存地址
		hadAddress:localStorage.getItem("CHECKADDRESS")?JSON.parse(localStorage.getItem("CHECKADDRESS")):'',//缓存的地址
		hadDataArray:localStorage.getItem("ALLDATAS")?JSON.parse(localStorage.getItem("ALLDATAS")):'',//缓存所有数据
		checkNumArr:localStorage.getItem("CHECKSKUDATAS")?JSON.parse(localStorage.getItem("CHECKSKUDATAS")):[],//选择sku的摘出数据
				
		allPrice:0.00,//订单总价
		dataArray:[],//总数据;
		skuArray:[],//选择sku的数据
		templateId:'',//商品的合作商价格模板ID
		tempGoodNo:'',//this商品货号
		cellPrice:0,//this商品的价格
		skuChekNum:0,//选择sku的总数量
		
	//	tempAddress:'',//临时存储地址
		logCompanyInf:'',//选择sku的快递数据
		allPostArray:[],//商品快递公司数据
		thisPostName:'',//当前商品选中的快递
		LAreaArray:[],//快递插件对象
}
$(function(){
	starDataAjax();
	$('.addressBase').click(function(){
		if(!state.cache){
			localStorage.setItem("ALLDATAS",JSON.stringify(state.dataArray)); 
		}
		localStorage.setItem("CHECKSKUDATAS",JSON.stringify(state.checkNumArr)); 
		window.location.href = "/yich/wapservice/dist/html/orderAddressAdmin.html";
	})
	//选择sku模态框
	$(document).on('click','.csku',function(){
		var logInforId = $(this).closest('li').attr('logInforId');
		var proId = $(this).closest('.goodslist').attr('proId');
		
		var index = $(this).closest('li').index();
		var post = $(this).closest('section').find('.checkpost').attr('id');
		var demo = $(this).closest('section').find('.checkpost').find('p').attr('id');
		var cityname = $(this).closest('section').find('.checkpost').find('input').attr('id');
		var qjPrice = $(this).closest('.goodslist').attr('qjPrice')?$(this).closest('.goodslist').attr('qjPrice'):'';
		state.thisPostName = $(this).closest('section').find('.checkpost').find('input').val();
		state.templateId = $(this).closest('.goodslist').attr('templateId')?$(this).closest('.goodslist').attr('templateId'):'';
		state.tempGoodNo = $(this).closest('.goodslist').attr('goodNo')?$(this).closest('.goodslist').attr('goodNo'):''; 
		var _this = $('.gssku>li').eq(0).find('.jia');
		$('.mt_content').attr('post',post);
		$('.mt_content').attr('demo',demo);
		$('.mt_content').attr('cityname',cityname);
		$('.mt_content').attr('proId',proId);
		$('.mt_content').attr('logInforId',logInforId);
		$('.mt_content').attr('isIndex',index);
		
		getSkuData(proId,logInforId);
		$('.checkSkuMT').toggle();
		JSprice(state.skuChekNum,state.skuArray,_this);
	})
	$(document).on('click','.skuMTClose,.mt_back',function(){
		state.skuChekNum = 0;
		$('.checkNum').html('&nbsp;'+state.skuChekNum+'&nbsp;');
		$('#cellprice').html('<i>￥</i>0.<i>00</i>');
		$('.checkSkuMT').toggle();
	})
	
	//选择SKU
	$(document).on('click','.chsku',function(){
		var sku = $(this).text();
		var invId = $(this).closest('li').attr("invId");
		$(this).addClass('checkSkuSta').closest('li').siblings().find('.chsku').removeClass('checkSkuSta');
		setSkuPrice(state.skuArray,invId,sku,state.templateId);
	})

	//减
	$(document).on('click','.jian',function(){
		var _this = $(this);
		var nn = parseInt($(this).closest('p').find('input').val());
		
		var bthis = $(this).closest('li').find('.chsku');
		var sku = $(this).closest('li').find('.chsku').text();
		var invId = $(this).closest('li').attr("invId");
		if(nn>0){
			nn--;
			state.skuChekNum--;
			$(this).closest('p').find('input').val(nn);
			$(this).closest('li').attr("num",nn);
		}else{
			
		}
		$(this).closest('li').find('.chsku').addClass('checkSkuSta').closest('li').siblings().find('.chsku').removeClass('checkSkuSta');
		setSkuPrice(state.skuArray,invId,sku,state.templateId);
		JSprice(state.skuChekNum,state.skuArray,_this);
		$('.checkNum').html('&nbsp;'+state.skuChekNum+'&nbsp;');
	})
	//加
	$(document).on('click','.jia',function(){
		var _this = $(this);
		var nn = parseInt($(this).closest('p').find('input').val());
		var kcnum = parseInt($(this).closest('li').attr('kc'));
		
		var bthis = $(this).closest('li').find('.chsku');
		var sku = $(this).closest('li').find('.chsku').text();
		var invId = $(this).closest('li').attr("invId");
		
		if(nn>-1 && nn<kcnum){
			nn++;
			state.skuChekNum++;
			$(this).closest('p').find('input').val(nn);
			$(this).closest('li').attr("num",nn);
		}else{
			nn = 0;
		}
		$(this).closest('li').find('.chsku').addClass('checkSkuSta').closest('li').siblings().find('.chsku').removeClass('checkSkuSta');
		setSkuPrice(state.skuArray,invId,sku,state.templateId);
		JSprice(state.skuChekNum,state.skuArray,_this);
		$('.checkNum').html('&nbsp;'+state.skuChekNum+'&nbsp;');
	})
	
	//确定
	$(document).on('click','.checkBtn',function(){
		var minNum = $(this).closest('dl').attr('minNum')?parseInt($(this).closest('dl').attr('minNum')):0;//最小选择一件
		var obj = {
			skunum:0,
			skudata:[],
		};
		
		var skudata = [],invIdNum=[];
		var post = $(this).closest('dl').attr('post');
		var demo = $(this).closest('dl').attr('demo');
		var cityname = $(this).closest('dl').attr('cityname');
		
		var index = $(this).closest('dl').attr('isIndex');
		var logInforId = $(this).closest('dl').attr('logInforId');
		obj.proId = $(this).closest('dl').attr('proId');
		obj.cprice = state.cellPrice;
		obj.templateId = state.templateId;
		obj.goodno = state.tempGoodNo;
		$('.gssku li').each(function(){
			var skuobj = {};
			/*var postobj = {
					pro_num:'',
					inv_id:'',
			}*/
			skuobj.invId = $(this).attr('invId');
			skuobj.sku = $(this).attr('sku');
			skuobj.cknum = $(this).attr('num')?$(this).attr('num'):0;
			
			/*postobj.pro_num = $(this).attr('num')?$(this).attr('num'):0;
			postobj.inv_id = $(this).attr('invId');*/
			if(skuobj.cknum && skuobj.cknum!=0){
				obj.skunum+=parseInt(skuobj.cknum);
				obj.skudata.push(skuobj);
			}
			//invIdNum.push(postobj);
		})
		if(obj.skunum >= minNum || obj.skunum==0){
			$('.o_conBox>li').eq(index).find('.goodslist').each(function(){
				if($(this).attr('proid') == obj.proId){
					if(obj.skunum>0){
						$(this).find('.csku>p').html('<span ischeck="ischeck">已选<i>&nbsp;'+obj.skunum+'&nbsp;</i>件,&nbsp;<i>'+obj.cprice.toFixed(2)+'&nbsp;</i>元</span>');
					}else {
						$(this).find('.csku>p').html('请选择sku');
					}
				}
			})
			var priceArr = pdCheckSku(state.checkNumArr,obj,logInforId);
			for(var i in priceArr){
				var tempArr = priceArr[i].logInforId;
				if(tempArr == logInforId && logInforId !=''){
					var tempProlist = priceArr[i].prolist;
					for(var j in tempProlist){
						var tempSkudata = tempProlist[j].skudata;
						for(var x in tempSkudata){
							var tempInvId = {};
							tempInvId.pro_num = tempSkudata[x].cknum;
							tempInvId.inv_id = tempSkudata[x].invId;
							invIdNum.push(tempInvId)
						}
					}
				}
			}
			resetPostPrice(invIdNum,post,demo,cityname);//重新计算快递价格
			state.allPrice=0;
			$('.checkSkuMT').toggle();
			$('.mt_content').attr('minnum','0');
		}else{
			var prompt = new promptFunc();
			prompt.init({
			      type:"",
			      text:"该商品不支持一件代发",
			    });
			return false;
		}
		
	})
	//删除
	$(document).on('click',".skdelBtn",function(){
		var _this = $(this);
		var selfArr = state.checkNumArr;
		var logInforId = $(this).closest('li').attr('logInforId');
		var proId = $(this).closest('.goodslist').attr('proId');
		var goodNo = $(this).closest('.goodslist').attr('goodNo');
		var str = "确定删除该订单吗?";
		function delfunc(){
			var tempGoodNo = state.goodNo.split(",");
			for(var g in tempGoodNo){
				if(goodNo == tempGoodNo[g]){
					tempGoodNo.splice(g,1);
				}
			}
			state.goodNo = tempGoodNo.join(",");
			var pararr = window.location.href.split('?')[1].split('&');
			for(var p in pararr){
				if(pararr[p].indexOf('goodsNo=') != -1){
					pararr.splice(p,1,'goodsNo='+tempGoodNo.join(","));
				}
			}
			var newurl = window.location.href.split('?')[0]+"?"+pararr.join("&");
			history.replaceState(null,null,newurl);
			if(_this.closest('.goodslist').length>1){
				_this.closest('.goodslist').remove();
				
			}else{
				_this.closest('li').remove();
			};
			for(var s in selfArr){
				if(logInforId == selfArr[s].logInforId){
					var plist = selfArr[s].prolist;
					for(var d in plist){
						if(proId == plist[d].proId){
							plist.splice(d,1);
							if(plist.length==0){
								selfArr.splice(s,1);
							}
						}
					}
				}
			}
			JSAllPrice(selfArr);
			if(state.cache){
				var alldatas = state.hadDataArray;
				localStorage.setItem("CHECKSKUDATAS",JSON.stringify(state.checkNumArr)); 
				for(var a in alldatas){
					var prodatas = alldatas[a];
					for(var p in prodatas){
						if(proId == prodatas[p].pro_id){
							prodatas.splice(p,1);
							if(prodatas.length==0){
								alldatas.splice(a,1);
							}
						}
					}
				}
				localStorage.setItem("ALLDATAS",JSON.stringify(state.hadDataArray));
			}
		}
		chekMTfunc(str,delfunc);//提示框
	})
	
	//计算价格提示
	$('.js_tips').click(function(){
		$('#js_mtTips').show();
	})
	$('#js_mtcancel>i').click(function(){
		$('#js_mtTips').hide();
	})
	
	
/**********下单按钮**********/
$('#orderbtn').click(function(){
	var findata = state.checkNumArr;
	var finadd = state.hadAddress;
	var datas=[];
	var prompt = new promptFunc();
	for(var f in findata){
		var postArray = findata[f].prolist;
		var fobj = {
				supshop_id:'',
				supshop_name:'',
				receiver:'',//收件人姓名
				receivertel:'',//收件人电话
				province:'',//省
				city:'',//市
				area:'',//区
				detailaddr:'',//具体地址
				logcomname:'',//快递名字
				sellermemo:'',//留言
				taobaoid:'',//淘宝买家ID
				tradeOrderList:[],
		};
		fobj.supshop_id = postArray[0].supshop_id;
		fobj.supshop_name = postArray[0].sup_name;
		if(finadd.name){
			fobj.receiver = finadd.name;
			fobj.receivertel = finadd.mobile?finadd.mobile:finadd.tel;
			fobj.province = finadd.area.split(' ')[0]?trim(finadd.area.split(' ')[0]):'';
			fobj.city = finadd.area.split(' ')[1]?trim(finadd.area.split(' ')[1]):'';
			fobj.area = finadd.area.split(' ')[2]?trim(finadd.area.split(' ')[2]):'';
			fobj.detailaddr = finadd.address;
			
		}else{
			prompt.init({
			      type:"",
			      text:"收货地址未填写",
			    });
			return false;
		}
		if(postArray[0].post){
			fobj.logcomname = postArray[0].post;
		}else{
			 prompt.init({
			      type:"",
			      text:"部分商品未选快递",
			    });
			 return false;
		}
		fobj.sellermemo = $('.o_liuy').val()?$('.o_liuy').val():'';//备注
		fobj.taobaoid =  $('.o_taobId').val()?$('.o_taobId').val():'';//淘宝Id
		for(var p in postArray){
			var list = postArray[p].skudata;
			if(list && list.length>0){
				for(var s in list){
					var skulist = {};
					skulist.num = list[s].cknum;
					skulist.invid = list[s].invId;
					fobj.tradeOrderList.push(skulist);
				}
			}else{
				prompt.init({
				      type:"",
				      text:"部分商品未选SKU",
				  });
				return false;
			}
			
		}
		datas.push(fobj);
	}	
	
	$.ajax({
		type:"post",
		url:"/yich/PhoneGeneratOrder",
		dataType:"json",
		data:JSON.stringify(datas),
		success:function(data){
			if(typeof (data.userId)!='undefined'){
			    func.fwh_authorize(data.userId);
			}
			if(typeof (data.outofbigestprice)!='undefined'){
				var prompt = new promptFunc();
				prompt.init({
				      type:"",
				      text:"下单金额超过最大限额",
				  });
				return false
			}
			//404
			//checkErrorAjax(data);
			if(data.flag > 0 && data.result == 1){
				var traids = (data.traIdlist && data.traIdlist.length>0)?data.traIdlist.join(','):'';
				localStorage.removeItem("CHECKADDRESS");
		    	localStorage.removeItem("CHECKSKUDATAS");
				localStorage.removeItem("ALLDATAS");
				if(state.isTemp){
					localStorage.removeItem("CHECKADDRESS");
				}
		    	window.location.href='/yich/wapservice/dist/html/orderCheck.html?traId='+traids;
			}else{
				prompt.init({
				      type:"",
				      text:"下单出错或请选择默认地址!",
				    });
		    }
				
		},error:function(err){},
	})

})


})

function starDataAjax(){
	if(!state.cache){
		state.checkNumArr=[];
		$.ajax({
			type:"post",
			url:"/yich/PhoneServiceAdvanceOrderSearch",
			dataType:"json",
			data:{goodNo:state.goodNo},
			success:function(data){
				if(typeof (data.userId)!='undefined'){
				    func.fwh_authorize(data.userId);
				}
				//404
				//checkErrorAjax(data);
				//func.authorize(data.userId,state.supId);
				if(data.plist && data.plist.length>0){
					state.dataArray = data.plist;
					getData(data.plist);
					//操作数据
					for(var i in data.plist){
						var temparr = data.plist[i];
						var ispost = '',ispostprice = '';
						if(temparr[0].logCompanyInf && temparr[0].logCompanyInf.details && temparr[0].logCompanyInf.details.length>0){
							var postarr = temparr[0].logCompanyInf.details
								for(var j in postarr){
									if(postarr[j].is_Default == 1){
										ispost = postarr[j].companyInf.logcpName;
										ispostprice = postarr[j].initPrice;
									}
								}
						}
						var obj={
								logInforId:'',//
								postPrice:'',//
								prolist:[],//
						};
						obj.logInforId = data.plist[i][0].log_info_id?data.plist[i][0].log_info_id:"";
						obj.postPrice = data.plist[i][0].unique_log?data.plist[i][0].unique_log:ispostprice;
						for(var t in temparr){
							var cprolist = {};
							cprolist.supshop_id = temparr[t].supshop_id;
							cprolist.sup_name = temparr[t].supplierShop.supshop_name;
							cprolist.templateId = temparr[t].templateId;
							cprolist.fareType = (temparr[t].logCompanyInf && temparr[t].logCompanyInf.details)?temparr[t].logCompanyInf.details[0].fareType:0;
							cprolist.proId = temparr[t].pro_id;
							cprolist.skunum = 0;
							cprolist.cprice = 0;
							cprolist.goodno = temparr[t].good_no;
							cprolist.skudata = [];
							cprolist.post = temparr[t].unique_log?'统一运费':ispost;
							
							obj.prolist.push(cprolist);
						}
						state.checkNumArr.push(obj);
					}
				}
				if(data.address && data.address.length>0){
					var list = data.address;
					for(var i in list){
						if(list[i].isDefault == "1"){
							localStorage.setItem("CHECKADDRESS",JSON.stringify(list[i])); //地址存储本地
							state.hadAddress = list[i];
							setTopData(state.hadAddress);
						}
					}
				}
			},
			error:function(err){},
		})
	}else{
		getData(state.hadDataArray);
		//计算总价
		JSAllPrice(state.checkNumArr);
	}
	if(state.hadAddress){
		setTopData(state.hadAddress);
	}
}
//getTop数据
function setTopData(data){
	var list={},str = '';
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
}
/**********下单初始:dom**********/
function getData(data){
	var fstr="",cstr="",postArr=[];
	$('.o_conBox').html('');
	state.allPostArray = [];
	for(var i in data){
		var list = data[i];
		
		//快递
		var isNomalPost = "";
		var isNoPost = true;
		var postHadClick = "";
		if(list[0].unique_log){
			isNoPost = false;
			isNomalPost = '统一运费,'+parseFloat(list[0].unique_log).toFixed(2)+'元';
			postHadClick='';
		}else{
			var tempPost = (list[0].logCompanyInf && list[0].logCompanyInf.details)?list[0].logCompanyInf.details:[];
			if(tempPost.length>0){
				var tempostarr = {};
				postArr = getPost(tempPost,"posthad");
				tempostarr.arr = postArr;
				tempostarr.logInforId = list[0].log_info_id;
				state.allPostArray.push(tempostarr);
			}
			for(var p in tempPost){
				if(tempPost[p].is_Default == "1"){
					isNomalPost = tempPost[p].companyInf.logcpName+","+tempPost[p].initPrice.toFixed(2)+"元&nbsp;(默认)";
				}
			}
			postHadClick='<i class="icon-menu-right"></i>';
		}
		
		for(var j in list){
			var wh={
					w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
					h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
			};
			var whe="@"+wh.w+"w_"+wh.h+"h";
			var _src=func.imgsize(list[j].proImage.src,whe);
			var noafterSalse = list[j].customer_service == "N"?'<span class="noafterSalse">暂不支持售后</span>':'';
			cstr+=[
					'<div class="goodslist"proId="'+list[j].pro_id+'" templateId="'+list[j].templateId+'" qjPrice="'+list[j].region+'" goodNo="'+list[j].good_no+'">',
					'<a><img src="'+_src+'">'+noafterSalse+'</a>',
					'<dl class="o_content">',
						'<dt >',
							'<a>'+list[j].pro_name+'</a>',
							'<span class="skdelBtn"><i class="icon-trash"></i></span>',
						'</dt>',
						'<dd class="csku">',
							'<p>请选择sku</p>',
							'<i class="icon-menu-right"></i>',
						'</dd>',
					'</dl>',
					'</div>',
			       ].join("");
		}
		var storageName = (data[i].length>0 && data[i][0].supplierShop && data[i][0].supplierShop.supshop_name)?data[i][0].supplierShop.supshop_name:'';
		var logInforId = +data[i][0].log_info_id?data[i][0].log_info_id:'';
		fstr=[
				'<li logInforId="'+logInforId+'">',
				'<p class="od_title">',
					'<span>'+storageName+'</span>',
				'</p>',
				'<section>',
				''+cstr+'',
				'<div class="checkpost" id="post'+i+'">',
					'<p id="demo'+i+'"><input class="wlpost" type="text" id="cityname'+i+'" value="'+isNomalPost+'" placeholder="请选择快递&nbsp;" disabled></p>',
					''+postHadClick+'',
				'</div>',
				'</section>',
				'</li>',
		     ].join("");
		$('.o_conBox').append(fstr);
		if(isNoPost){
			postcar("post"+i,postArr,"#demo"+i,"#cityname"+i); //快递插件
		}
		cstr = '';
	}
	var _sklist = state.checkNumArr;
	//console.log(_sklist)
	if(_sklist.length>0){
		for(var l in _sklist){
			var proarray = _sklist[l].prolist;
			for(var p in proarray){
				$('.o_conBox>li').each(function(){
					var fthis = $(this);
					if($(this).attr('logInforId') == _sklist[l].logInforId){
						$(this).find('.goodslist').each(function(){
							if($(this).attr('proId') == proarray[p].proId){
								if(proarray[p].skunum>0){
									$(this).find('.csku>p').html('<span ischeck="ischeck">已选<i>&nbsp;'+proarray[p].skunum+'&nbsp;</i>件,&nbsp;<i>'+proarray[p].cprice.toFixed(2)+'&nbsp;</i>元</span>');
								}else {
									$(this).find('.csku>p').html('请选择sku');
								}
								fthis.find('.wlpost').val(proarray[p].post+','+parseFloat(_sklist[l].postPrice).toFixed(2)+'元');
							}
							
						})
						
					}
				})
			}
			
		}
		
		/*if(obj.skunum>0){
			$('.o_conBox>li').eq(index).find('.csku>p').html('<span ischeck="ischeck">已选<i>&nbsp;'+obj.skunum+'&nbsp;</i>件,&nbsp;<i>'+obj.cprice.toFixed(2)+'&nbsp;</i>元</span>');
		}else {
			$('.o_conBox>li').eq(index).find('.csku>p').html('请选择sku');
		}*/
	}
}
function resetPostPrice(invidNum,post,demo,cityname){
	var thisTempLogCompany = '';
	var logInforId = state.logCompanyInf?state.logCompanyInf.id:'';
	var fareType  = state.logCompanyInf?state.logCompanyInf.details[0].fareType:'';
	var province = $('.addressInfor').length>0?trim($('.addressInfor').text()).split(' ')[0]:'';
	if(state.logCompanyInf && state.logCompanyInf.id){
		$.ajax({
			type:"post",
			url:"/yich/PhoneServiceLogMoneyCalc",
			dataType:"json",
			async:false,
			data:{invIdNum:JSON.stringify(invidNum),logInfoId:logInforId,fareType:fareType,province:province},
			success:function(data){
				if(typeof (data.userId)!='undefined'){
				    func.fwh_authorize(data.userId);
				}
				var postArr = getPost(data.list,"postno");
				for(var i in state.allPostArray){
					if(logInforId == state.allPostArray[i].logInforId){
						state.allPostArray[i].arr = postArr;
						for(var l in state.LAreaArray){
							if(state.LAreaArray[l].params.trigger == "#"+demo){
								state.LAreaArray[l].data = postArr;
							}
						}
						var setpostArr = postArr[0].child;
						for(var n in setpostArr){
							var thisName = trim(state.thisPostName.split(",")[0]);
							var thatName = trim(setpostArr[n].name.split(",")[0]);
							if(thisName == thatName){
								$("#"+cityname).val(setpostArr[n].name);
								thisTempLogCompany = setpostArr[n].name;
							}
						}
					}
				}
				for(var p in state.checkNumArr){
					if(logInforId == state.checkNumArr[p].logInforId && logInforId != ''){
						state.checkNumArr[p].postPrice = thisTempLogCompany?trim(thisTempLogCompany.split(',')[1].split('元')[0]):'0';
					}
				}
				
			},
			error:function(err){},
		})
	}
	//计算总价
	JSAllPrice(state.checkNumArr);
}
//get快递数据
function getPost(array,pro){
	var arr = [];
	var arrid = [];
	var json = {id:"1",name:"",child:[]};
	for(var i in array){
		var temp = {};
		temp.id = i;
		if(pro == "postno"){
			temp.name = array[i].logcpName+(", "+ parseFloat(array[i].price).toFixed(2) +"元");
			json.child.push(temp);
		}else if(pro == "posthad"){
			temp.name = (array[i].companyInf && array[i].companyInf.logcpName)?array[i].companyInf.logcpName:'';
			temp.name +=(", "+ array[i].initPrice.toFixed(2) +"元");
			if(!remsame(arrid,array[i])){
				json.child.push(temp);
				arrid.push(array[i].companyInf.logcpId);
			}
		}
		
	}
	arr.push(json);
	return arr;
}
function postcar(post,arr,clickId,valueId,index){
	post = new LArea();
	post.init({
	        'trigger': clickId, //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
	        'cityName': valueId,
	        'keys': {
	            id: 'id',
	            name: 'name'
	        }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
	        'type': 1, //数据源类型
	        'data': arr, //数据源
	        'level':1,
	        'callbackfunc':getfunback0,
	    });
	post.value=[0,0,0];//控制初始位置，注意：该方法并不会影响到input的value
	state.LAreaArray.push(post);
}
function getfunback0(val,_this){
	var list = state.checkNumArr;//选择sku的摘出数据
	var logInforId = $(_this).closest('li').attr('logInforId');
	//console.log(list)
	for(var i in list){
		if(logInforId == list[i].logInforId && logInforId != ''){
			var pprolist = list[i].prolist;
			list[i].post = val?trim(val.split(',')[0]):'';
			list[i].postPrice = val?trim(val.split(',')[1].split("元")[0]):'';
			for(var j in pprolist){
				pprolist[j].post = val?trim(val.split(',')[0]):'';
			}
		}
	}
	JSAllPrice(list);	
	
}

/**********SKU:dom**********/
function getSkuData(proid,loginforid){
	var arr = '',sklist={};
	var data = !state.cache?state.dataArray:state.hadDataArray?state.hadDataArray:[];
	for(var i in data){
		var cdata = data[i];
		for(var j in cdata){
			if(proid == cdata[j].pro_id){
				arr = cdata[j];
				state.logCompanyInf = cdata[j].logCompanyInf?cdata[j].logCompanyInf:'';
			}
		}
	}
	for(var k in state.checkNumArr){
		if(loginforid == state.checkNumArr[k].logInforId){
			var parray = state.checkNumArr[k].prolist;
			for(var p in parray){
				if(proid == parray[p].proId){
					sklist = parray[p];
				}
			}
			
		}
		
	}
	if(arr){
		//名字和img
		var imgsrc = (arr.proImage && arr.proImage.src)?arr.proImage.src:'';
		var name = arr.pro_name?arr.pro_name:'';
		var wh={
				w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(196)),
				h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(196)),
		};
		var whe="@"+wh.w+"w_"+wh.h+"h";
		var _src=func.imgsize(imgsrc,whe);
		$('.sku_img>img').attr('src',_src);
		$('.sku_con>span').eq(0).text(name);
		//价格标题展示
		var price_title = arr.templateId?'价格 <span class="btn-display-pink">合作商价格</span>':'价格';
		price_title += (arr.shopInvtory && parseFloat(arr.shopInvtory[0].price)>0)?'<span class="btn-display-orange">一件代发</span>':'';
		$('.gsmess').html(price_title);
		//初始价格展示
		var pri0 = arr.region?parseFloat(arr.region.split('-')[0]).toFixed(2).split('.')[0]:'';
		var pri1 = arr.region?parseFloat(arr.region.split('-')[0]).toFixed(2).split('.')[1]:'';
		var pri2 = (arr.region && arr.region.split('-')[1])?parseFloat(arr.region.split('-')[1]).toFixed(2).split('.')[0]:'';
		var pri3 = (arr.region && arr.region.split('-')[1])?parseFloat(arr.region.split('-')[1]).toFixed(2).split('.')[1]:'';
		if(pri1 && pri2){
			$('.gsprice').html('<li><span><i>￥</i>'+pri0+'.<i>'+pri1+'</i> - <i>￥</i>'+pri2+'.<i>'+pri3+'</i></span></li>');
		}else if(pri1){
			$('.gsprice').html('<li><span><i>￥</i>'+pri0+'.<i>'+pri1+'</i></span>');
		}else{
			$('.gsprice').html('<li><span><i>￥</i>'+pri2+'.<i>'+pri3+'</i></span>');
		}
		//sku展示
		var skuarr = arr.shopInvtory?arr.shopInvtory:[];
		state.skuArray = arr.shopInvtory?arr.shopInvtory:[];
		var skulist = '';
		for(var s in skuarr){
			var nokcsta='';
			if(skuarr[s].sku_properties == "默认规格"){
				var sku = skuarr[s].sku_properties;
			}else{
				var sku1 = skuarr[s].sku_properties.split(';')[0]?skuarr[s].sku_properties.split(';')[0].split(':')[1]:'';
				var sku2 = skuarr[s].sku_properties.split(';')[1]?skuarr[s].sku_properties.split(';')[1].split(':')[1]:'';
				var sku = (sku1 && sku2)?sku1+'/'+sku2:(sku1?sku1:sku2);
			}
			
			var truesku = skuarr[s].sku_properties?skuarr[s].sku_properties:'';
			var kcnum = skuarr[s].pro_num?skuarr[s].pro_num:0;
			var invId = skuarr[s].inv_id?skuarr[s].inv_id:'';
			if(parseInt(kcnum) <= 0){
				nokcsta="nokc";
			}
			skulist+=[
					'<li class="'+nokcsta+'" kc="'+kcnum+'" invId="'+invId+'" sku="'+truesku+'">',
					'<p class="chsku">'+sku+'<i></i></p>',
					'<p class="chnum">',
						'<i class="icon-reduce jian"></i>',
						'<input type="number" value="0" disabled>',
						'<i class="icon-add jia"></i>',
					'</p>',
					'<p class="jsPrice"><span>￥0.00</span>&nbsp;×&nbsp;<span>0</span></p>',
					'</li>',
			         ].join("");	
		}
		$('.gssku').html(skulist);
		skulist = '';
	}
	if(sklist.proId){
		var list = sklist.skudata;
		state.skuChekNum = sklist.skunum?sklist.skunum:0;
		$('.checkNum').html('&nbsp;'+sklist.skunum+'&nbsp;');
		$('.gssku>li').each(function(i){
			for(var l in list){
				if(list[l].invId == $(this).attr('invId')){
					$(this).attr('num',list[l].cknum);
					$(this).find('.chnum>input').val(list[l].cknum);
				}
			}
		})
	}
}
/**********SKU:price**********/
function setSkuPrice(data,invId,sku,templateId){
	var skuInfor = {},skustr = '',hzStr = '';
	for(var i in data){
		if(invId == data[i].inv_id){
			skuInfor = data[i];
		}
	}
	$('.gsprice').html('');
	if(skuInfor.inv_id){
		
		var priceall = skuInfor.wholesalePrice?skuInfor.wholesalePrice:'';
		if(templateId){
			//有合作商价格
			if(parseFloat(skuInfor.price)>0){
				$('.gsmess').html(sku+'<a>(库存:'+skuInfor.pro_num+'件)</a><span class="btn-display-pink">合作商价格</span><span class="btn-display-orange">一件代发</span>');
			}else{
				$('.gsmess').html(sku+'<a>(库存:'+skuInfor.pro_num+'件)</a><span class="btn-display-pink">合作商价格</span>');
			}
		}else{
			//没有合作商价格
			if(parseFloat(skuInfor.price)>0){
				$('.gsmess').html(sku+'<a>(库存:'+skuInfor.pro_num+'件)</a><span class="btn-display-orange">一件代发</span>');
			}else{
				$('.gsmess').html(sku+'<a>(库存:'+skuInfor.pro_num+'件)</a>');
			}
		}
		if(priceall.orginPrice){
			var temp1 = priceall.templaeOrginPrice?parseFloat(priceall.templaeOrginPrice).toFixed(2).split('.')[0]:"0";
			var temp2 = priceall.templaeOrginPrice?parseFloat(priceall.templaeOrginPrice).toFixed(2).split('.')[1]:"00";
			var wholp = priceall.orginPrice?parseFloat(priceall.orginPrice).toFixed(2):"0.00";
			var wholp1 = priceall.orginPrice?parseFloat(priceall.orginPrice).toFixed(2).split('.')[0]:"0";
			var wholp2 = priceall.orginPrice?parseFloat(priceall.orginPrice).toFixed(2).split('.')[1]:"00";
			if(templateId){
				//有合作商价格
				
				hzStr = '<span><i>￥</i>'+temp1+'.<i>'+temp2+'</i></span><del>￥'+wholp+'</del>';
				if(parseFloat(skuInfor.price)>0){
					$('.gsmess').html(sku+'<a>(库存:'+skuInfor.pro_num+'件)</a><span class="btn-display-pink">合作商价格</span><span class="btn-display-orange">一件代发</span>');
				}else{
					$('.gsmess').html(sku+'<a>(库存:'+skuInfor.pro_num+'件)</a><span class="btn-display-pink">合作商价格</span>');
				}
				
			}else{
				//没有合作商价格
				hzStr = '<span><i>￥</i>'+wholp1+'.<i>'+wholp2+'</i></span>';
				if(parseFloat(skuInfor.price)>0){
					$('.gsmess').html(sku+'<a>(库存:'+skuInfor.pro_num+'件)</a><span class="btn-display-orange">一件代发</span>');
				}else{
					$('.gsmess').html(sku+'<a>(库存:'+skuInfor.pro_num+'件)</a>');
				}
				
			}
			var one_num = "1";
			if(priceall.standard0 && priceall.standard0 != "N" &&  parseInt(priceall.standard0)>1){
				one_num = (parseInt(priceall.standard0)-1);
			}else if(priceall.standard1 && priceall.standard1 != "N" && parseInt(priceall.standard1)>1){
				one_num = (parseInt(priceall.standard2)-1);
			}else if(priceall.standard2 && priceall.standard2 != "N" && parseInt(priceall.standard2)>1){
				one_num = (parseInt(priceall.standard2)-1);
			}
			skustr = [
						'<li>',
						''+hzStr+'',
						'<span>1-'+one_num+'件:</span>',
						'</li>',
			         ].join('');
		}
		if(priceall.standard0){
			var temp1 = priceall.templatePrice0?parseFloat(priceall.templatePrice0).toFixed(2).split('.')[0]:"0.00";
			var temp2 = priceall.templatePrice0?parseFloat(priceall.templatePrice0).toFixed(2).split('.')[1]:"0.00";
			var wholp = priceall.wholesalePrice0?parseFloat(priceall.wholesalePrice0).toFixed(2):"0.00";
			var wholp1 = priceall.wholesalePrice0?parseFloat(priceall.wholesalePrice0).toFixed(2).split('.')[0]:"0.00";
			var wholp2 = priceall.wholesalePrice0?parseFloat(priceall.wholesalePrice0).toFixed(2).split('.')[1]:"0.00";
			if(templateId){
				//有合作商价格
				hzStr = '<span><i>￥</i>'+temp1+'.<i>'+temp2+'</i></span><del>￥'+wholp+'</del>';
			}else{
				//没有合作商价格
				hzStr = '<span><i>￥</i>'+wholp1+'.<i>'+wholp2+'</i></span>';
			}
			var te_oneNum = '';
			if(priceall.standard1 && priceall.standard1 != "N"){
				te_oneNum = priceall.standard0+"-"+(parseInt(priceall.standard1)-1);
			}else if(priceall.standard2 && priceall.standard2 != "N"){
				te_oneNum = priceall.standard0+"-"+(parseInt(priceall.standard2)-1);
			}
			skustr += [
						'<li>',
						''+hzStr+'',
						'<span>'+te_oneNum+'件:</span>',
						'</li>',
			         ].join('');
			
		}
		if(priceall.standard1){
			var temp1 = priceall.templatePrice1?parseFloat(priceall.templatePrice1).toFixed(2).split('.')[0]:"0.00";
			var temp2 = priceall.templatePrice1?parseFloat(priceall.templatePrice1).toFixed(2).split('.')[1]:"0.00";
			var wholp = priceall.wholesalePrice1?parseFloat(priceall.wholesalePrice1).toFixed(2):"0.00";
			var wholp1 = priceall.wholesalePrice1?parseFloat(priceall.wholesalePrice1).toFixed(2).split('.')[0]:"0.00";
			var wholp2 = priceall.wholesalePrice1?parseFloat(priceall.wholesalePrice1).toFixed(2).split('.')[1]:"0.00";
			if(templateId){
				//有合作商价格
				hzStr = '<span><i>￥</i>'+temp1+'.<i>'+temp2+'</i></span><del>￥'+wholp+'</del>';
			}else{
				//没有合作商价格
				hzStr = '<span><i>￥</i>'+wholp1+'.<i>'+wholp2+'</i></span>';
			}
			var te_twoNum = '';
			if(priceall.standard2 && priceall.standard2 != "N"){
				te_twoNum = priceall.standard1+"-"+(parseInt(priceall.standard2)-1);
			}
			skustr += [
						'<li>',
						''+hzStr+'',
						'<span>'+te_twoNum+'件:</span>',
						'</li>',
			         ].join('');
		}
		if(priceall.standard2){
			var temp1 = priceall.templatePrice2?parseFloat(priceall.templatePrice2).toFixed(2).split('.')[0]:"0.00";
			var temp2 = priceall.templatePrice2?parseFloat(priceall.templatePrice2).toFixed(2).split('.')[1]:"0.00";
			var wholp = priceall.wholesalePrice2?parseFloat(priceall.wholesalePrice2).toFixed(2):"0.00";
			var wholp1 = priceall.wholesalePrice2?parseFloat(priceall.wholesalePrice2).toFixed(2).split('.')[0]:"0.00";
			var wholp2 = priceall.wholesalePrice2?parseFloat(priceall.wholesalePrice2).toFixed(2).split('.')[1]:"0.00";
			if(templateId){
				//有合作商价格
				hzStr = '<span><i>￥</i>'+temp1+'.<i>'+temp2+'</i></span><del>￥'+wholp+'</del>';
			}else{
				//没有合作商价格
				hzStr = '<span><i>￥</i>'+wholp1+'.<i>'+wholp2+'</i></span>';
			}
			skustr += [
						'<li>',
						''+hzStr+'',
						'<span>≥'+priceall.standard2+'件:</span>',
						'</li>',
			         ].join('');
		}
		if(skuInfor.price == 0){
			var minNum = priceall.standard0?priceall.standard0:priceall.standard1?priceall.standard1:priceall.standard2?priceall.standard2:0;
			$('.mt_content').attr('minNum',minNum);
		}else{
			$('.mt_content').attr('minNum',0);
		}
		
	}
	$('.gsprice').html(skustr);
	
}
//计算价格
function JSprice(num,data,_this){
	//num:选择的总数量，data：价格区间，_this:this指针
	var singPrice = 0,cellPrice = 0.00;
	for(var s in data){
		var _thisNum = $('.gssku>li').eq(s).find('.chnum>input[type="number"]').val();
		/*if(num == 1){*/
			if(data[s].wholesalePrice.templaeOrginPrice && data[s].wholesalePrice.templaeOrginPrice !=0 ){
				singPrice = data[s].wholesalePrice.templaeOrginPrice;
			}else{
				singPrice = data[s].wholesalePrice.orginPrice?data[s].wholesalePrice.orginPrice:0;
			}
		/*}else*/ if(num>1){
			if(data[s].wholesalePrice.standard0){
				var minNum = data[s].wholesalePrice.standard0?data[s].wholesalePrice.standard0:0;
				var maxNum = data[s].wholesalePrice.standard1?parseInt(data[s].wholesalePrice.standard1)-1:data[s].wholesalePrice.standard2?parseInt(data[s].wholesalePrice.standard2)-1:0;
				if(num>=parseInt(minNum) && num<=parseInt(maxNum)){
					if(data[s].wholesalePrice.templatePrice0 && data[s].wholesalePrice.templatePrice0 !=0){
						singPrice = data[s].wholesalePrice.templatePrice0;
					}else{
						singPrice = data[s].wholesalePrice.wholesalePrice0?data[s].wholesalePrice.wholesalePrice0:0;
					}
					
				}
			}
			if(data[s].wholesalePrice.standard1){
				var minNum = data[s].wholesalePrice.standard1?data[s].wholesalePrice.standard1:0;
				var maxNum = data[s].wholesalePrice.standard2?parseInt(data[s].wholesalePrice.standard2)-1:0;
				if(num>=parseInt(minNum) && num<=parseInt(maxNum)){
					if(data[s].wholesalePrice.templatePrice1 && data[s].wholesalePrice.templatePrice1 !=0){
						singPrice = data[s].wholesalePrice.templatePrice1;
					}else{
						singPrice = data[s].wholesalePrice.wholesalePrice1?data[s].wholesalePrice.wholesalePrice1:0;
					}
					
				}
			}
			if(data[s].wholesalePrice.standard2){
				var tempNum = data[s].wholesalePrice.standard2 ? data[s].wholesalePrice.standard2:0;
				
				if(num>=parseInt(tempNum)){
					if(data[s].wholesalePrice.templatePrice2 && data[s].wholesalePrice.templatePrice2 !=0){
						singPrice = data[s].wholesalePrice.templatePrice2;
					}else{
						singPrice = data[s].wholesalePrice.wholesalePrice2?data[s].wholesalePrice.wholesalePrice2:0;
					}
					
				}
			}
		}else if(num!=1){
			singPrice = 0;
		}
		if(parseInt(_thisNum)>0){
			cellPrice += (parseInt(_thisNum)*singPrice);
			$('.gssku>li').eq(s).find('.jsPrice>span').eq(0).text(singPrice.toFixed(2));
			$('.gssku>li').eq(s).find('.jsPrice>span').eq(1).text(_thisNum);
		}else{
			$('.gssku>li').eq(s).find('.jsPrice>span').eq(0).text('0.00');
			$('.gssku>li').eq(s).find('.jsPrice>span').eq(1).text('0');
		}
		
	}
	state.cellPrice = cellPrice;
	var cPrice1 = cellPrice.toFixed(2).split('.')[0];
	var cPrice2 = cellPrice.toFixed(2).split('.')[1];
	$('#cellprice').html('<i>￥</i>'+cPrice1+'.<i>'+cPrice2+'</i>');
	cellPrice = 0.00;
}

//计算总价
function JSAllPrice(priceArr){
	state.allPrice=0;
	for(var p in priceArr){
		var parray = priceArr[p].prolist;
		for(var l in parray){
			state.allPrice+=(parray[l].cprice?parseFloat(parray[l].cprice):0.00);
		}
		state.allPrice+=(priceArr[p].postPrice?parseFloat(priceArr[p].postPrice):0.00);
	}
	var allprice1 = state.allPrice ? state.allPrice.toFixed(2).split('.')[0]:0;
	var allprice2 = state.allPrice ? state.allPrice.toFixed(2).split('.')[1]:00;
	//$('#allPrice').html('￥'+(state.allPrice).toFixed(2));
	$('#allPrice').html('<i>￥</i>'+allprice1+'.<i>'+allprice2+'</i>');
	if(state.allPrice>0){
		$('#allPrice').closest('.yicon-tabbar').addClass('getOrderBtn');
	}else{
		$('#allPrice').closest('.yicon-tabbar').removeClass('getOrderBtn');
	}
}
/**********工具**********/
//判定checkSku
function pdCheckSku(arr,pro,logid){
	var ishad = false;
	for(var i in arr){
		if(arr[i].logInforId == logid){
			var parray = arr[i].prolist;
			for(var j in parray){
				if(parray[j].proId == pro.proId){
					
					parray[j].cprice = pro.cprice;
					parray[j].skudata = pro.skudata;
					parray[j].skunum = pro.skunum;
					ishad = true;
				}
			}
		}
		
	}
	
	return arr;
}
//去重
function remsame(data,obj){
	for(var j in data){
		if(data[j] == obj.companyInf.logcpId){
			return true;
		}
	}
	return false;
}
//去除首尾空格
function trim(str){return str.replace(/(^\s*)|(\s*$)/g,"");}