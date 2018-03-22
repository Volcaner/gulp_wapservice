var title='';//商品标题
var goodsDescribe='';//商品描述
var src=[];//图片
var yijian=0;//一件代发是否勾选
var pifa=0;//是否支持批发
var price=0;//一件代发价格
var storeNum=0;//单规格库存
var inv=[];//多规格数组
var wholeNums=[];//批发数量
var wholePrices=[];//批发价格
var logMoney=0;//运费
var cat='';//类目
var goodNo='';//货号

var shangchuan_lujing='';
var pro_id='';
$(function(){
//编辑
var hrefarr=(window.location.href).split("?");
if(hrefarr.length>1){
	var arr=hrefarr[1].split("&");
    for(var i=0;i<arr.length;i++){
    	var k=arr[i].split("=");
    	if(k[0]=='proId'){
    		pro_id=k[1];
    	}
    }
}
if($.trim(pro_id)!=''){
	 $.ajax({
         type:"POST",
         url:"/yich/PhoneUpdateLink",
         dataType:"json",
         data:{
        	 "proId":$.trim(pro_id),
         },
         success: function(data){
        	 if(typeof (data.userId)!='undefined'){
        		    func.fwh_authorize(data.userId);
        		}
        	 //pro_name
        	// pro_re
        	// shopInvtory price
        	 if(typeof (data.p)!='undefined'){
        		 update(data.p);
        	 }
        	 
         },
         error: function(){
             console.log('Ajax error!');
         }
     });
function update(data){
	var pro_name='';//商品标题
	var pro_re='';//商品描述
	var src=[];//图片
	var yjdf=false;//一件代发是否选中
	var yjdfprice='';//一件代发价格
	var zcpf=false;//支持批发是否选中
	var zcpfjnum=[];//支持批发 件数数组
	var zcpfprice=[];//支持批发价格数组
	var sfdangg=true;//是否为单规格 否则多规格
	var danggkc='';//单规格库存
	var duoggskckc=[];//多规格skc和库存
	var yunfei='';//运费
	var cat='';//类目
	var goodNo='';//货号
	if(typeof(data.pro_name)!='undefined'){
		pro_name=data.pro_name;
	}
	if(typeof(data.pro_re)!='undefined'){
		pro_re=data.pro_re;
	}
	if(typeof (data.unique_log)!='undefined'){
		yunfei=data.unique_log;
	}
	if(typeof(data.iamgeList)!='undefined' && data.iamgeList.length>0){
		for(var i=0;i<data.iamgeList.length;i++){
			src.push((data.iamgeList)[i].src);
		}
	}
	if(typeof (data.next_catagory)!='undefined'){
		cat=data.next_catagory;
	}
	if(typeof (data.good_no_sequ)!='undefined'){
		goodNo=data.good_no_sequ;
	}
	
	if(typeof (data.shopInvtory)!='undefined' && data.shopInvtory.length>0){
		if(typeof ((data.shopInvtory)[0].price)!='undefined' && (data.shopInvtory)[0].price*1>0){
			yjdf=true;
			yjdfprice=(data.shopInvtory)[0].price*1;
		}
		if(typeof ((data.shopInvtory)[0].wholesalePrice)!='undefined'){
			zcpf=true;
			if(typeof ((data.shopInvtory)[0].wholesalePrice.standard0)!='undefined'){
				var n=(((data.shopInvtory)[0].wholesalePrice.standard0).split("-"))[0];
				if(n>0){
					zcpfjnum.push(n);
				}
			}
			if(typeof ((data.shopInvtory)[0].wholesalePrice.standard1)!='undefined'){
				var n=(((data.shopInvtory)[0].wholesalePrice.standard1).split("-"))[0];
				if(n>0){
					zcpfjnum.push(n);
				}
			}
			if(typeof ((data.shopInvtory)[0].wholesalePrice.standard2)!='undefined'){
				var n=(((data.shopInvtory)[0].wholesalePrice.standard2).split("-"))[0];
				if(n>0){
					zcpfjnum.push(n);
				}
			}
			if(typeof ((data.shopInvtory)[0].wholesalePrice.wholesalePrice0)!='undefined'){
				var p=(data.shopInvtory)[0].wholesalePrice.wholesalePrice0;
				zcpfprice.push(p);
			}
			if(typeof ((data.shopInvtory)[0].wholesalePrice.wholesalePrice1)!='undefined'){
				var p=(data.shopInvtory)[0].wholesalePrice.wholesalePrice1;
				zcpfprice.push(p);
			}
			if(typeof ((data.shopInvtory)[0].wholesalePrice.wholesalePrice2)!='undefined'){
				var p=(data.shopInvtory)[0].wholesalePrice.wholesalePrice2;
				zcpfprice.push(p);
			}
		}
		if(typeof ((data.shopInvtory)[0].sku_properties)!='undefined' && $.trim((data.shopInvtory)[0].sku_properties)=='默认规格'){
			sfdangg=true;
			danggkc=(data.shopInvtory)[0].pro_num;
	   }else{
		   sfdangg=false;
		   for(var v=0;v<data.shopInvtory.length;v++){
			   var j={};
			   j.sku=(data.shopInvtory)[v].sku_properties;
			   j.kc=(data.shopInvtory)[v].pro_num;
			   duoggskckc.push(j);
		   }
	   }
		if(sfdangg){
			$(".guige").children("span").removeClass("active");
			$(".guige").children("span").eq(0).addClass("active");
			$(".dangg").css("display","block");
			$(".duogg").css("display","none");
		}else{
			$(".guige").children("span").removeClass("active");
			$(".guige").children("span").eq(1).addClass("active");
			$(".dangg").css("display","none");
			$(".duogg").css("display","block");
		}
	}
$(".shangpname").val(pro_name);
$(".shangpmians").val(pro_re);
var str='';
for(var u=0;u<src.length;u++){
	 var wh={
				w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
				h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
		};
		var whe="@"+wh.w+"w_"+wh.h+"h";
		var _src=func.imgsize(src[u],whe);
	str+=[
         '<li>',
            '<span class="spanclose" style="cursor: pointer"><i class="icon iconfont">&#xe603;</i></span>',
            '<span class="opcaty" style="display:none">0%</span>',
            '<img src="'+_src+'" oldsrc="'+src[u]+'" class="imgsrc">',
            '</li>',
	      ].join('');
}
if(src.length>=8){
	$("ul").children(".divfile").css("display","none");
}else{
	$("ul").children(".divfile").css("display","block");
}
$("ul").children(".divfile").before(str);
if(yjdf){
	$(".sfzcyj").addClass("actve");
	$(".sfzcyj").html('&#xe617;');
}else{
	$(".sfzcyj").removeClass("actve");
	$(".sfzcyj").html('&#xe668;');
}
$(".yjprice").val(yjdfprice);
if(zcpf){
	$(".zcpf").addClass("actve");
	$(".zcpf").html('&#xe617;');
	$(".uljglist").addClass("slidown");
}else{
	$(".zcpf").removeClass("actve");
	$(".zcpf").html('&#xe668;');
	$(".uljglist").removeClass("slidown");
}
for(var c=0;c<zcpfjnum.length;c++){
	$(".input1").eq(c).val(zcpfjnum[c]);
}
for(var m=0;m<zcpfprice.length;m++){
	$(".input2").eq(m).val(zcpfprice[m]);
}
$(".danggkc").val(danggkc);
if(duoggskckc.length>0){
	for(var g=0;g<duoggskckc.length;g++){
		if(g==0){
			$(".duogg").children("ul").children("li").eq(0).children(".txgg").val(duoggskckc[g].sku);
			$(".duogg").children("ul").children("li").eq(0).children(".kc").val(duoggskckc[g].kc);
		}else{
			var skckcstr=[
						'<li>',
						'<input type="text" class="txgg" placeholder="请填写规格(20个字符内)" value="'+duoggskckc[g].sku+'"/>',
						'<input type="number" class="kc" placeholder="请填写库存" value="'+duoggskckc[g].kc+'"/>',
						'<span class="removeli"><i class="icon iconfont">&#xe603;</i></span>',
						'</li>',
			             ].join('');
			$(".duogg").children("ul").append(skckcstr);
		}
	}
}
$(".yunfei").val(yunfei);
$(".select_leimu").val(cat);
$(".goodno").val(goodNo);
};
}
	
	 $.ajax({
         type:"POST",
         url:"/yich/ShowCatServlet",
         dataType:"json",
         success: function(data){
        	 if(typeof (data.userId)!='undefined'){
        		 func.fwh_authorize(data.userId);
        	 }
           shangchuan_lujing=data.name+'/fabushangping';
           var l=0;
           if(typeof (data.itemsList)!='undefined'){
        	   l=data.itemsList.length;
           }
           var str='';
           for(var i=0;i<l;i++){
        	   str+='<li>'+(data.itemsList)[i]+'</li>';
           }
           $(".listleimu").children("ul").html(str);
         },
         error: function(){
             console.log('Ajax error!');
         }
     });
	AliyunUpload = new $.AliyunUpload();
	/*AliyunUpload.init({
		region: 'oss-cn-hangzhou',
	    accessKeyId: 'LTAIuio3BmR3xlxV',
	    accessKeySecret: 'SaNNLqkclS0UbU0HzqtR9m0r8tyx47',
	    bucket: 'ngsimage',
	});*/
/*function reInitOssInit(){
	var state=true;
	  $("#photo").change(function(){
		  if(state){
			  state=false;
		  if($(".ullist_img").children("li").length>=8){
			  $(".ullist_img").children("li.divfile").css("display","none");
		  }
	      var file=$(this)[0].files;
	      var str='<li><span class="spanclose" style="cursor: pointer"><i class="icon iconfont">&#xe603;</i></span><span class="opcaty">0%</span></li>';
	      $("ul").children(".divfile").before(str);
	      AliyunUpload.upload(shangchuan_lujing + "/", file[0], function(img) {
	    	  var l=$(".ullist_img").children("li").length;
	    	  var wh={
						w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
						h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
				};
				var whe="@"+wh.w+"w_"+wh.h+"h";
				var _src=func.imgsize(img.url,whe);
	    	 $(".ullist_img").children("li").eq(l-2).append('<img src="'+_src+'" oldsrc="'+img.url+'" class="imgsrc"/>');
	    	 console.log($(".ullist_img").children("li").eq(l-2).html());
			}, function(val) {
				console.log(val);  // progress
				var b=parseInt(val.toFixed(2)*100);
				var l=$(".ullist_img").children("li").length;
				$(".ullist_img").children("li").eq(l-2).find(".opcaty").text(b+'%');
				if(b>=100){
					state=true;
					setTimeout(function(){
						$(".ullist_img").children("li").eq(l-2).find(".opcaty").css("display","none");
					},200);
				}
			});
		  }else{
			  alert("请稍候");
		  }
	  });
}*/
$(document).on("click",".spanclose",function(){
	$(this).closest("li").remove();
	if($(".ullist_img").children("li").length<8){
		$(".ullist_img").children("li.divfile").css("display","block");
	}
});
$(".divopcaty").click(function(){
	if($(this).siblings(".leftname").children("i").hasClass("actve")){
		$(this).siblings(".leftname").children("i").removeClass("actve");
		$(this).siblings(".leftname").children("i").html('&#xe668;');
	}else{
		$(this).siblings(".leftname").children("i").addClass("actve");
		$(this).siblings(".leftname").children("i").html('&#xe617;');
	}
});
$(".open").click(function(){
	if(!$(".uljglist").hasClass("slidown")){
		$(".uljglist").addClass("slidown");
		$(this).children("i").html('&#xe638;');
		
	}else{
		$(".uljglist").removeClass("slidown");
		$(this).children("i").html('&#xe600;');
	}
});
//规格选择
$(".guige").children("span").click(function(){
   $(this).addClass("active");
   $(this).siblings("span").removeClass("active");
   if($(".guige").children("span").eq(0).hasClass('active')){
	   $(".dangg").css("display","block");
	   $(".duogg").css("display","none");
   }else{
	   $(".dangg").css("display","none");
	   $(".duogg").css("display","block");
   }
});
//添加规格
$(".addgg").click(function(){
	var str=[
			'<li>',
			'<input type="text" class="txgg" placeholder="请填写规格(20个字符内)"/>',
			'<input type="number" class="kc" placeholder="请填写库存"/>',
			'<span class="removeli" style="cursor: pointer"><i class="icon iconfont">&#xe603;</i></span>',
			'</li>',
	         ].join('');
$(".duogg").children("ul").append(str);
});
//删除规格
$(document).on("click",".removeli",function(){
	if($(".duogg").children("ul").children("li").length>1){
		$(this).closest("li").remove();
	}
})

$('.shangpname').bind('input propertychange', function() {  
	var n=strlengh($(this).val());
$(".sptitle").children("span").text(n+'/30');
}); 

$('.shangpmians').bind('input propertychange', function() {  
	var n=strlengh($(this).val());
$(".spms").children("span").text(n+'/200');
}); 
$(".goodno").blur(function(){
	var val=Stringlength($(this).val(),36);
	$(this).val(val);
});
$('.shangpname').blur(function(){
	var val=Stringlength($(this).val(),30);
	$(this).val(val);
	var n=strlengh($(this).val());
	$(".sptitle").children("span").text(n+'/30');
});
$('.shangpmians').blur(function(){
	var val=Stringlength($(this).val(),200);
	$(this).val(val);
	var n=strlengh($(this).val());
	$(".spms").children("span").text(n+'/200');
});
  
$(document).on("blur",".txgg",function(){
	var s=$(this).val();
	var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
	
	var rs = ""; 
	for (var i = 0; i < s.length; i++) { 
	rs = rs+s.substr(i, 1).replace(pattern, ''); 
	} 
	var val=Stringlength(rs,10);
    $(this).val(val);
});
})
function reInitOssInit(){
	var state=true;
	  $("#photo").change(function(){
		  if(state){
			  state=false;
		  if($(".ullist_img").children("li").length>=8){
			  $(".ullist_img").children("li.divfile").css("display","none");
		  }
	      var file=$(this)[0].files;
	      var str='<li><span class="spanclose" style="cursor: pointer"><i class="icon iconfont">&#xe603;</i></span><span class="opcaty">0%</span></li>';
	      $("ul").children(".divfile").before(str);
	      AliyunUpload.upload(shangchuan_lujing + "/", file[0], function(img) {
	    	  var l=$(".ullist_img").children("li").length;
	    	  var wh={
						w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
						h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(150)),
				};
				var whe="@"+wh.w+"w_"+wh.h+"h";
				var _src=func.imgsize(img.url,whe);
	    	 $(".ullist_img").children("li").eq(l-2).append('<img src="'+_src+'" oldsrc="'+img.url+'" class="imgsrc"/>');
	    	 console.log($(".ullist_img").children("li").eq(l-2).html());
			}, function(val) {
				console.log(val);  // progress
				var b=parseInt(val.toFixed(2)*100);
				var l=$(".ullist_img").children("li").length;
				$(".ullist_img").children("li").eq(l-2).find(".opcaty").text(b+'%');
				if(b>=100){
					state=true;
					setTimeout(function(){
						$(".ullist_img").children("li").eq(l-2).find(".opcaty").css("display","none");
					},200);
				}
			});
		  }else{
			  alert("请稍候");
		  }
	  });
}
$(".input1").eq(0).blur(function(){
	if($.trim($(this).val())!='' && $.trim($(this).val())*1<2){
		$(this).val(2);
	}
});
$(".next1,.fabu").click(function(){	
if($(".zcpf").hasClass("actve")){
	var ggstate=false;
	var pfnum=[];
	var pfprice=[];
	$(".input1").each(function(){
		var v=$(this).val();
		if($.trim(v)!=''){
			pfnum.push(v);
		}
	});
	$(".input2").each(function(){
		var v=$(this).val();
		if($.trim(v)!=''){
			pfprice.push(v);
		}
	});
	if($(".sfzcyj").hasClass("actve") && $.trim($(".yjprice").val())!=''){
		var yjprice=$.trim($(".yjprice").val());
		if(pfprice.length>0){
			var maxprice=Math.max.apply(null,pfprice);
			if(maxprice*1>yjprice*1){
				ggstate=true;
			}
		}
	}
	if(ggstate){
		var prompt =  new promptFunc();
		 prompt.init({
 		   text:"批发价不能大于一件代发",
 	   })
		return false
	}
	for(var i=0;i<pfnum.length;i++){
		var oldnum=pfnum[i];
		if((+i+1)<pfnum.length){
			var newnum=pfnum[+i+1];
			if(oldnum*1>newnum*1){
				ggstate=true;
				break
			}
		}
	}
	if(ggstate){
		var prompt =  new promptFunc();
		 prompt.init({
 		   text:"请正确填写数量!",
 	   })
		return false
	}
	for(var j=0;j<pfprice.length;j++){
		var oldprice=pfprice[j];
		if((+j+1)<pfprice.length){
			var newprice=pfprice[+j+1];
			if(oldprice*1<newprice*1){
				ggstate=true;
				break
			}
		}
	}
	if(ggstate){
		var prompt =  new promptFunc();
		 prompt.init({
 		   text:"请正确填写批发价!",
 	   })
		return false
	}
}


	src.length=0;
	inv.length=0;
	wholeNums.length=0;
	wholePrices.length=0;
	title=$(".shangpname").val();//商品标题
	goodsDescribe=$(".shangpmians").val();//商品描述
	price=$(".yjprice").val();//一件代发价格
	cat=$.trim($(".select_leimu").val());
	goodNo=$.trim($(".goodno").val());
	$(".imgsrc").each(function(){
		var _src=$(this).attr("oldsrc");
		src.push(_src);
	});
	if($(".sfzcyj").hasClass("actve")){
		yijian=1;
	}
	if($(".zcpf").hasClass("actve")){
		pifa=1;
	}
	if($.trim($(".danggkc").val())!=''){
		storeNum=$.trim($(".danggkc").val());
	}
	$(".input1").each(function(){
		var num=$.trim($(this).val());
		if(num!=''){
			wholeNums.push(num);
		}
	});
	$(".input2").each(function(){
		var price=$.trim($(this).val());
		if(price!=''){
			wholePrices.push(price);
		}
	});
	if($.trim($('.yunfei').val())!=''){
		logMoney=$.trim($('.yunfei').val());
	}
    $(".duogg").children("ul").children("li").each(function(){
    	var sku=$.trim($(this).children(".txgg").val());
    	var kc=$.trim($(this).children(".kc").val());
    	if(sku!='' && kc!=''){
    		var j={};
    		j.sku_properties=sku;
    		j.pro_num=kc;
    		inv.push(j);
    	}	
    });
	//验证
	var b=0;
	if($.trim(title)==''){
		b++;
	}
	var v=0;
	$(".divalign").each(function(){
		if($(this).find(".actve").length>0){
			v++;
		}
	});
	if(v==0){
		b++;
	}
	if($(".sfzcyj").hasClass("actve") && $.trim($(".yjprice").val())==''){
		b++;
	}
	if($(".zcpf").hasClass("actve") && wholeNums.length==0 && wholePrices.length==0){
		b++
	}
	if($(".dangg").css("display")=="block" && $.trim($(".danggkc").val())==''){
		b++;
	}
	if($(".duogg").css("display")=="block" && inv.length==0){
		b++;
	}
	if($.trim($(".yunfei").val())==''){
		b++
	}
	if(src.length==0){
		b++
	}
	if(b>0){
		$(".yingying,.tips").css("display","block");
		return false
	}else{
		if($(this).hasClass("next1")){
			$(".one").css("display","none");
			$(".two").css("display","block");
		}else{
			if($.trim(pro_id)==''){
				fb();
			}else{
				fb2();
			}
		}
	}
});
$(".tipclose").click(function(){
	$(".yingying,.tips").css("display","none");
});
function fb2(){
	 $.ajax({
         type:"POST",
         url:"/yich/PhoneUpdateRelease",
         dataType:"json",
         data:{
        	 "title":title,//商品标题
             "goodsDescribe":goodsDescribe,//商品描述
             "src":JSON.stringify(src),//图片
             "yijian":yijian,//一件代发是否勾选
             "pifa":pifa,//是否支持批发
             "price":price,//一件代发价格
             "storeNum":storeNum,//单规格库存
             "inv":JSON.stringify(inv),//多规格数组
             "wholeNums":JSON.stringify(wholeNums),//批发数量
             "wholePrices":JSON.stringify(wholePrices),//批发价格
             "logMoney":logMoney,//运费
             "cat":cat,//类目
             "goodNo":goodNo,//货号
             proId:$.trim(pro_id),
         },
         success: function(data){
        	 if(typeof (data.userId)!='undefined'){
        		 func.fwh_authorize(data.userId);
        	 }
        	 if(data.result=='success'){
        		window.location.href='/yich/wapservice/dist/html/releaseSharePoster.html?where=gostore&proId='+$.trim(pro_id);
        	 }else{
        		 alert("发布失败!");
        	 }
           console.log(data);
         },
         error: function(){
             console.log('Ajax error!');
         }
     });
}
function fb(){
	 $.ajax({
         type:"POST",
         url:"/yich/PhoneReleaseServlet",
         dataType:"json",
         data:{
        	 "title":title,//商品标题
             "goodsDescribe":goodsDescribe,//商品描述
             "src":JSON.stringify(src),//图片
             "yijian":yijian,//一件代发是否勾选
             "pifa":pifa,//是否支持批发
             "price":price,//一件代发价格
             "storeNum":storeNum,//单规格库存
             "inv":JSON.stringify(inv),//多规格数组
             "wholeNums":JSON.stringify(wholeNums),//批发数量
             "wholePrices":JSON.stringify(wholePrices),//批发价格
             "logMoney":logMoney,//运费
             "cat":cat,//类目
             "goodNo":goodNo,//货号
         },
         success: function(data){
        	 if(typeof (data.userId)!='undefined'){
        		 func.fwh_authorize(data.userId);
        	 }
        	 if(data.result=='success'){
        		 var tempProId = data.proId?data.proId:'';
        		window.location.href='/yich/wapservice/dist/html/releaseSharePoster.html?where=gostore&proId='+tempProId;
        	 }else{
        		 alert("发布失败!");
        	 }
           console.log(data);
         },
         error: function(){
             console.log('Ajax error!');
         }
     });	
}
$(".select_leimu").click(function(){
	$(".listleimu").css("display","block");
});
$(document).on("click",".listleimu li",function(){
	var str=$(this).text();
	$(".listleimu").css("display","none");
	$(".select_leimu").val(str);
})
$(document).on("click",".listleimu>span",function(){
	$(".listleimu").css("display","none");
});
$(document).on("click",".clear",function(){
	$(".listleimu").css("display","none");
	$(".select_leimu").val('');
})
$(".next2").click(function(){
	$(".one").css("display","block");
	$(".two").css("display","none");
});
$(document).on("blur",".yunfei",function(){
	var val=$(this).val();
	var val2=val.match(/\d+\.?\d{0,2}/)||[''][0];
	$(this).val(val2);
	var val3=$(this).val();
	if($.trim(val3)!=''){
	var val4=val3.split('.');
	if(val4.length>1){
	    if(val4[0].length>8){
	    	var val5=val4[0].substring(0,8)+'.'+val4[1];
	    	$(this).val(val5);
	    }	
	 }else{
		 if(val4[0].length>8){
		    	var val5=val4[0].substring(0,8);
		    	$(this).val(val5);
		    }	
	 }
	} 
})

$(document).on("blur",".yjprice,.input2",function(){
	var val=$(this).val();
	var val2=val.match(/\d+\.?\d{0,2}/)||[''][0];
	$(this).val(val2);
	var val3=$.trim($(this).val());
	if(val3!='' && val3*1<=0){
		$(this).val(1);
		val3=$(this).val();
	}
	if($.trim(val3)!=''){
	var val4=val3.split('.');
	if(val4.length>1){
	    if(val4[0].length>8){
	    	var val5=val4[0].substring(0,8)+'.'+val4[1];
	    	$(this).val(val5);
	    }	
	 }else{
		 if(val4[0].length>8){
		    	var val5=val4[0].substring(0,8);
		    	$(this).val(val5);
		    }	
	 }
	} 
})

$(document).on("blur",".input1",function(){
	var val=$(this).val();
	var val2=val.match(/\d+/)||[''][0];
	$(this).val(val2);
	var val3=$(this).val();
	if($.trim(val3)!=''){
	var val4=val3.split('.');
	if(val4.length>1){
	    if(val4[0].length>8){
	    	var val5=val4[0].substring(0,8)+'.'+val4[1];
	    	$(this).val(val5);
	    }	
	 }else{
		 if(val4[0].length>8){
		    	var val5=val4[0].substring(0,8);
		    	$(this).val(val5);
		    }	
	 }
	} 
})

$(document).on("blur",".danggkc",function(){
	var val=$(this).val();
	var val2=val.match(/\d+/)||[''][0];
	$(this).val(val2);
	var val3=$(this).val();
	if($.trim(val3)!=''){
	var val4=val3.split('.');
	if(val4.length>1){
	    if(val4[0].length>8){
	    	var val5=val4[0].substring(0,6)+'.'+val4[1];
	    	$(this).val(val5);
	    }	
	 }else{
		 if(val4[0].length>8){
		    	var val5=val4[0].substring(0,6);
		    	$(this).val(val5);
		    }	
	 }
	} 
})
$(document).on("blur",".kc",function(){
	var val=$(this).val();
	var val2=val.match(/\d+/)||[''][0];
	var index=$(this).closest("li").index();
	var s=[];
	$(".duogg").children("ul").children("li").each(function(i,e){
		if(i<index){
			var g=$.trim($(this).children(".kc").val());
			s.push(g);
		}
	});
	if(s.length>0){
		var maxs=Math.max.apply(null, s);
		if(val2<=maxs){
			val2=+maxs+1;
		}
	}
	$(this).val(val2);
	var val3=$(this).val();
	if($.trim(val3)!=''){
	var val4=val3.split('.');
	if(val4.length>1){
	    if(val4[0].length>6){
	    	var val5=val4[0].substring(0,6)+'.'+val4[1];
	    	$(this).val(val5);
	    }	
	 }else{
		 if(val4[0].length>6){
		    	var val5=val4[0].substring(0,6);
		    	$(this).val(val5);
		    }	
	 }
	}
});