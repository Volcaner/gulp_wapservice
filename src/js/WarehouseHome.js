var firstnum=1;
var supshopId='';
function strdom(data){
	 flag = arguments[1]?arguments[1]:false;
	var str='';
	if(typeof data.list!='undefined' && data.list.length>0){
		for(var i=0;i<data.list.length;i++){
			var _src='';//图片
			if(typeof (data.list)[i].proImage!='undefined' && typeof (data.list)[i].proImage.src!='undefined'){
				var src=(data.list)[i].proImage.src;
				var wh={
						w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(200)),
						h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(200)),
				};
				var whe="@"+wh.w+"w_"+wh.h+"h";
				var _src=func.imgsize(src,whe);
			}
			var name='';//title
			if(typeof (data.list)[i].pro_name!='undefined'){
				name=(data.list)[i].pro_name;
			}
			var goodno='';//货号
			if(typeof (data.list)[i].good_no!='undefined'){
				goodno=(data.list)[i].good_no;
			}
			var price1='0.';//价格
			var price2='00';//价格
			if(typeof (data.list)[i].fixed_price!='undefined'){
				var price=((data.list)[i].fixed_price).toFixed(2);
				var p=price.split(".");
				price1=p[0]+".";
				price2=p[1];
			}
			var hzs='';//合作商
			if(typeof (data.list)[i].template!='undefined' && (data.list)[i].template.length>0){
				hzs='<span class="hzsjg">合作商价格</span>';
			}
			var yjdf='';//一件代发
			if(typeof ((data.list)[i].shopInvtory)!='undefined' && (data.list)[i].shopInvtory.length>0 && typeof(((data.list)[i].shopInvtory)[0].price)!='undefined' &&  ((data.list)[i].shopInvtory)[0].price>0){
				yjdf='<span class="yjdf">一件代发</span>';
			}
			var xiaoliang=0;//销量
			if(typeof (data.list)[i].sale_times!='undefined'){
				xiaoliang=(data.list)[i].sale_times;
			}
			var xiazaics=0;//下载次数
			if(typeof (data.list)[i].download_times!='undefined'){
				xiazaics=(data.list)[i].download_times;
			}
			var cailucs=0;//采录次数
			if(typeof (data.list)[i].record_times!='undefined'){
				cailucs=(data.list)[i].record_times;
			}
			var thl=0;//退货率
			if(typeof ((data.list)[i].sale_times)!='undefined' && ((data.list)[i].sale_times-0)>0 && typeof ((data.list)[i].month_ret_num)!='undefined'){
				thl=(((data.list)[i].month_ret_num/(data.list)[i].sale_times)*100).toFixed(2);
			}
			var pfj='';//批发价
			if(typeof ((data.list)[i].salePrice)!='undefined' && typeof ((data.list)[i].salePrice.standard0)!='undefined' && typeof ((data.list)[i].salePrice.phonePrice0)!='undefined'){
				var a=((data.list)[i].salePrice.standard0).split("-");
				if((a[0]-1)>1){
					firstnum=a[0]-1;
				}else{
					firstnum=1;
				}
			}else if(typeof ((data.list)[i].salePrice)!='undefined' && typeof ((data.list)[i].salePrice.standard1)!='undefined' && typeof ((data.list)[i].salePrice.phonePrice1)!='undefined'){
				var a=((data.list)[i].salePrice.standard1).split("-");
				if((a[0]-1)>1){
					firstnum=a[0]-1;
				}else{
					firstnum=1;
				}
			}else if(typeof ((data.list)[i].salePrice)!='undefined' && typeof ((data.list)[i].salePrice.standard2)!='undefined' && typeof ((data.list)[i].salePrice.phonePrice2)!='undefined'){
				var a=((data.list)[i].salePrice.standard2).split("-");
				if((a[0]-1)>1){
					firstnum=a[0]-1;
				}else{
					firstnum=1;
				}
				
			}else{
				firstnum=1;
			}
			var pfjFirlst=0;
			if(typeof ((data.list)[i].region)!='undefined'){
				pfjFirlst=(data.list)[i].region;
			}
			if(pfjFirlst*1>0){
			pfj+=[
					'<div class="movediv">',
					'<p class="pricep"><span>￥'+pfjFirlst+'</span>起</p>',
				    '<span class="numsl">1-'+firstnum+'件</span>',
				    '</div>',
				 ].join('');
			}
			if(typeof ((data.list)[i].salePrice)!='undefined' && typeof ((data.list)[i].salePrice.standard0)!='undefined' && typeof ((data.list)[i].salePrice.phonePrice0)!='undefined'){
				var sum1='';
				if( ((data.list)[i].salePrice.standard0).split("-").length==1){
					sum1='<span class="numsl">≥'+(data.list)[i].salePrice.standard0+'件</span>';
				}else{
					sum1='<span class="numsl">'+(data.list)[i].salePrice.standard0+'件</span>';
				}
				pfj+=[
						'<div class="movediv">',
						'<p class="pricep"><span>￥'+parseFloat((data.list)[i].salePrice.phonePrice0)+'</span>起</p>',
						 sum1,
					    '</div>',
				      ].join('');
			}
			if(typeof ((data.list)[i].salePrice)!='undefined' && typeof ((data.list)[i].salePrice.standard1)!='undefined' && typeof ((data.list)[i].salePrice.phonePrice1)!='undefined'){
				var sum2='';
				if( ((data.list)[i].salePrice.standard1).split("-").length==1){
					sum2='<span class="numsl">≥'+(data.list)[i].salePrice.standard1+'件</span>';
				}else{
					sum2='<span class="numsl">'+(data.list)[i].salePrice.standard1+'件</span>';
				}
				pfj+=[
						'<div class="movediv">',
						'<p class="pricep"><span>￥'+parseFloat((data.list)[i].salePrice.phonePrice1)+'</span>起</p>',
					 	 sum2,
					    '</div>',
				      ].join('');
			}
			if(typeof ((data.list)[i].salePrice)!='undefined' && typeof ((data.list)[i].salePrice.standard2)!='undefined' && typeof ((data.list)[i].salePrice.phonePrice2)!='undefined'){
				var sum3='';
				if( ((data.list)[i].salePrice.standard2).split("-").length==1){
					sum3='<span class="numsl">≥'+(data.list)[i].salePrice.standard2+'件</span>';
				}else{
					sum3='<span class="numsl">'+(data.list)[i].salePrice.standard2+'件</span>';
				}
				pfj+=[
						'<div class="movediv">',
						'<p class="pricep"><span>￥'+parseFloat((data.list)[i].salePrice.phonePrice2)+'</span>起</p>',
						sum3,
					    '</div>',
				      ].join('');
			}
			//按钮判断
			if(typeof ((data.list)[i].coll)!='undefined' && typeof ((data.list)[i].coll.coid)!='undefined' && (data.list)[i].coll.coid){
				btn=[
					'<div class="btngroup2">',
					'<input type="button" value="加入采购单" class="jiarucgd"/>',
			        '<input type="button" value="下单" class="xiadan"/>',
			        '<input type="button" value="分享" class="fenx2"/>',
			        '<input type="hidden" value="'+(data.list)[i].pro_id+'" class="pro_id"/>',
					'<input type="hidden" value="'+(data.list)[i].supshop_id+'" class="supshop_id"/>',
				    '</div>',
				     ].join('');
			}else{
				var bestcid=null;
				var cid=null;
				if(typeof (data.list)[i].best_cat_cid!='undefined'){
					bestcid= (data.list)[i].best_cat_cid;
				}
				if(typeof (data.list)[i].cid!='undefined'){
					cid= (data.list)[i].cid;
				}
				btn=[
						'<div class="btngroup1">',
				        '<input type="button" value="采录" class="cailu"/>',
				        '<input type="button" value="分享" class="fenx1"/>',
				        '<input type="hidden" value="'+(data.list)[i].pro_id+'" class="pro_id"/>',
						'<input type="hidden" value="'+(data.list)[i].supshop_id+'" class="supshop_id"/>',
						'<input type="hidden" value="'+bestcid+'" class="best_id"/>',
						'<input type="hidden" value="'+cid+'" class="cid"/>',
					   '</div>',
					   
					   '<div class="btngroup2" style="display:none;">',
						'<input type="button" value="加入采购单" class="jiarucgd"/>',
				        '<input type="button" value="下单" class="xiadan"/>',
				        '<input type="button" value="分享" class="fenx2"/>',
				        '<input type="hidden" value="'+(data.list)[i].pro_id+'" class="pro_id"/>',
						'<input type="hidden" value="'+(data.list)[i].supshop_id+'" class="supshop_id"/>',
					    '</div>',
						
				     ].join('');
			}
			
			var localstr=JSON.stringify((data.list)[i]);
			var xqySrc='/yich/wapservice/dist/html/goods_detail_page.html?proId='+(data.list)[i].pro_id;
			str+=[
				'<li class="li_mian">',
				'<b class="localstr" style="display:none;">'+localstr+'</b>',
				'<div class="limain">',
					'<a href="'+xqySrc+'" class="lefta">',
						'<img src="'+_src+'"/>',
					'</a>',
					'<div class="righttext">',
						'<p class="textpwb">'+name+'</p>',
						'<span class="goodno">'+goodno+'</span>',
						'<div class="divbottom">',
							'<p class="price"><span>￥<span>'+price1+'<span>'+price2+'</span></p>',
							hzs,
							yjdf,
						'</div>',
						'<div class="more">',
							'<i class="icon iconfont moreico">&#xe600;</i>',
						'</div>',
					'</div>',
				'</div>',
				'<div class="listdiv">',
					'<ul class="top">',
					   '<li>',
					   	  '<span class="num">'+xiaoliang+'</span>',
					   	  '<span class="wb">销量</span>',
					   '</li>',
					   '<li>',
					   	  '<span class="num">'+xiazaics+'</span>',
					   	  '<span class="wb">下载次数</span>',
					   '</li>',
					   '<li>',
					   	  '<span class="num">'+cailucs+'</span>',
					   	  '<span class="wb">采录次数</span>',
					   '</li>',
					   '<li>',
					   	  '<span class="num">'+thl+'%</span>',
					   	  '<span class="wb">退货率</span>',
					   '</li>',
					'</ul>',
					'<div class="movebottom">',
					 pfj,
					'</div>',
					btn,
				'</div>',
				'</li>',
			      ].join('');
		}
		
	}
	if(flag){
		$(".main").children("ul").html(str);
	}else{
		$(".main").children("ul").append(str);
	}
	supshopId=(data.list && data.list.length>0)?(data.list)[0].supshop_id:'';
	cz();
	
};

$(".selectul").click(function(){
	if($(".listtype").css("display")=="none"){
		$(".listtype").css("display","block");
	}else{
		$(".listtype").css("display","none");
	}
});
$(".listtype").children("li").click(function(){
	var text=$.trim($(this).text());
	$(".selectul").children("span").text(text);
	$(".listtype").css("display","none");
});

function cz(){
	$(".jiarucgd").each(function(){
		var ppid=$(this).siblings(".pro_id").val();
		if(pdcgd(ppid)){
			$(this).addClass('active');
		}else{
			$(this).removeClass('active');
		}
	});
	
	/*$(".moreico").click(function(){
		  $(this).closest(".li_mian").siblings(".li_mian").find(".slidown").removeClass("slidown");
	  if(!$(this).closest(".limain").siblings(".listdiv").hasClass("slidown")){
		  $(this).closest(".limain").siblings(".listdiv").addClass("slidown");
	  }else{
		  $(this).closest(".limain").siblings(".listdiv").removeClass("slidown");
	  }
	})*/
};
$(document).on("click",".moreico",function(){
	  $(this).closest(".li_mian").siblings(".li_mian").find(".slidown").removeClass("slidown");
if(!$(this).closest(".limain").siblings(".listdiv").hasClass("slidown")){
	  $(this).closest(".limain").siblings(".listdiv").addClass("slidown");
}else{
	  $(this).closest(".limain").siblings(".listdiv").removeClass("slidown");
}
})



//搜索
$(".rightqx").click(function(){
	history();
	ssdom();
	$("#history").css("display","none");
});
$(".tabul").children("li").click(function(){
	if($(this).children("span").text()=='新品排行'){
		$(this).children("i").html('&#xe618;');
	}else{
		$(this).siblings("li").children("i").html('&#xe619;');
	}
	$(this).addClass("active").siblings().removeClass('active');
	$('#pageloading').show();
	ssdom();
});
//历史记录
function history(){
	var text=$.trim($(".selectul").children("span").text());
	if(text=='标题'){
		   type=0;
	   }else{
		   type=1;
	   }
	 if(window.localStorage){
	if(window.localStorage && (window.localStorage)['ccindexhistory']){
		var obj = localStorage.getItem('ccindexhistory');
		console.log(obj);
		var arr=eval("("+obj+")");
		if(arr.length>200){
			localStorage.removeItem('ccindexhistory');
		}
	}
	
	if(window.localStorage && (window.localStorage)['ccindexhistory']){
		var obj = localStorage.getItem('ccindexhistory');
		var arr=eval("("+obj+")");
		var sz=[];
		for(var j=0;j<arr.length;j++){
			sz.push(JSON.stringify(arr[j]));
		}
		var obj2={};
		obj2.type=type;
		obj2.key=$.trim($(".ssinput").val());
		if(sz.indexOf(JSON.stringify(obj2))==-1){
			sz.unshift(JSON.stringify(obj2));
		}else{
			sz.splice(sz.indexOf(JSON.stringify(obj2)),1);
			sz.unshift(JSON.stringify(obj2));
		}
		
		localStorage.setItem('ccindexhistory','['+sz+']');
	}else{
		var sz=[];
		var obj={};
		obj.type=type;
		obj.key=$.trim($(".ssinput").val());
		sz.push(JSON.stringify(obj));
		localStorage.setItem('ccindexhistory','['+sz+']');
	};
 }else{
		alert("浏览暂不支持localStorage")
	} 
};
$(".ssinput").click(function(){
	ss();
});
function ss(){
	var text=$.trim($(".selectul").children("span").text());
	if(text=='标题'){
		   type=0;
	   }else{
		   type=1;
	   }
	if(window.localStorage && (window.localStorage)['ccindexhistory']){
		var obj = localStorage.getItem('ccindexhistory');
		var arr=eval("("+obj+")");
		var str='';
		if(arr.length>0){
		    var sz=[];
		    var arrlenght=0;
		    if(arr.length>10){
		    	arrlenght=10;
		    }else{
		    	arrlenght=arr.length;
		    }
		    for(var v=0;v<arrlenght;v++){
		    	if(arr[v].type==type){
		    		sz.push(arr[v]);
		    	}
		    }
		    if(sz.length>0){
		    	var l=0;
		    	if(sz.length>10){
		    		l=10;
		    	}else{
		    		l=sz.length;
		    	}
		    	
		    	for(var c=0;c<l;c++){
		    		if($.trim(sz[c].key)!=''){
		    			str+='<li class="searchli">'+sz[c].key+'</li>';
		    		}
		    	}
		    	if(str!=''){
		    		$(".ulhistory").html(str);
		    		$("#history").css("display","block");
		    	}
		    	
		    }else{
	    		$(".ulhistory").html('');
	    		$("#history").css("display","none");
	    	}
			
		}
	}
	histyli();
};

function histyli(){
	$(".searchli").on("click",function(){
		var text = $(this).text();
		$(".ssinput").val(text);
		$("#history").css("display","none");
		ssdom();
		history();
	})
};


function ssdom(){
	var text=$.trim($(".selectul").children("span").text());
   if(text=='标题'){
	   type=0;
   }else{
	   type=1;
   }
   page=0;
   var opt=$.trim($(".tabul").children(".active").children("span").text());
   if(opt=='新品排行'){
	   option=0;
   }else{
	   option=1;
   }
   key=$.trim($(".ssinput").val());
   dropload_obj.opts.loadUpFn(dropload_obj);
};
//分享 
$(document).on("click",".fenx1,.fenx2",function(){
	var proId=$(this).siblings(".pro_id").val();
	var supId=$(this).siblings(".supshop_id").val();
	//window.location.href='/yich/wap/src/html/share.html?proId='+proId+'&supId='+supId;
	window.location.href='/yich/wapservice/dist/html/releaseSharePoster.html?where=gostore&proId='+proId;
})
//下单
$(document).on("click",".xiadan",function(){
	window.location.href='/yich/wapservice/dist/html/goodsOrder.html?goodsNo='+escape($.trim($(this).closest("li").find(".goodno").text()));
})
//采录
$(document).on("click",".cailu",function(){
	var _this=this;
	var  pro_id=$(this).siblings(".pro_id").val();
	var  supshop_id=$(this).siblings(".supshop_id").val();
	var best_cid=$(this).siblings('.best_id').val();
	var cid=$(this).siblings("cid").val();
	$(this).attr("disabled","disabled");
	$(this).addClass('select');
	  $.ajax({
	  		type:"POST",
	  		url:"/yich/PhoneCollectServlet",
	  		 dataType:"json",
	  		data:{
	  			"status":'R',
	  			"proId_shopid":pro_id,
	  			"supshopId":supshop_id,
	  			"best_cid":best_cid,
	  			"cid":cid,
	  			"flag":1,
	  		},
	  		success:function(data){
	  			if(typeof (data.userId)!='undefined'){
            	    func.fwh_authorize(data.userId);
            	}
	  			if(data.flag_two==1){
	  				$(".alertsuccess").children("span").text("采录成功!");
	  				$(".alertsuccess").css("display","block");
	  				$(".alertsuccess").css("marginLeft",(-$(".alertsuccess").width()/2)+'px');
	  				setTimeout(function(){
	  					$(".btngroup1").css("display","none");
	  					$(".btngroup2").css("display","block");
	  					$(".alertsuccess").css("display","none");
		       	            // func.claddcount();
	  					
	  				},1000);
	  			}else{
	  				alert("采录失败！");
	  			}
	  			 
	  		},
	  		error:function(){},
	  	})
	  	
});


//采购
var timeout=null;
$(document).on("click",".jiarucgd",function(){
		   var  pro_id=$(this).siblings(".pro_id").val();
     	    var li=$(this).closest("li");
     	    var localstr=li.find(".localstr").html();
     	   supshopId=$(this).siblings(".supshop_id").val();
     	 if(window.localStorage){
     		 if(!pdcgd(pro_id)){
 			    $(".alertsuccess").children("span").text("加入采购单成功!");
 				$(".alertsuccess").css("display","block");
 				$(".alertsuccess").css("marginLeft",(-$(".alertsuccess").width()/2)+'px');
               $(this).addClass('active');
               clearTimeout(timeout);
               timeout=setTimeout(function(){
            	   $(".alertsuccess").css("display","none");
               },1000);
         		func.localadd("localobject_"+supshopId,localstr);
         		//cgdcount();
 	          }
     		}
     		else{
     			alert("浏览暂不支持localStorage");return false;
     			} 
     	 
     	 
})

//预存卡
$(".iconmore").click(function(){
	$(".yingying,.iconmore").css("display","block");
});
$(".yingying").click(function(){
	$(".yingying").css("display","none");
});
$(".yc_card").click(function(){
	window.location.href='/yich/wapservice/dist/html/buyCard.html?supid='+supshopId;
});