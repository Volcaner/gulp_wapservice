/*
 *海报编辑页
 */
$(function(){
	startImgAjax();
	aliyunimg('festival');
	startpage();
	window.addEventListener("popstate", function() {
		startpage();
	});

	$('.sp_finishBtn').click(function(){
		var newUrl = window.location.href+'&nextpage=1';
		history.pushState(null,null,newUrl);
		$('.rsp_loading').show();
		makeImgSharePoster();
		isLoading(15000);
	})
	$('body').click(function(){
		$('.checkImgListBox').hide();
	})
	$(document).on('click','.spm_touchBack>a',function(event){
		event.preventDefault();
		var classId = this.classList[0];
		var _cthis = $('.spm_touchImgBox').find('.'+classId);
		_cthis.addClass('addImgActive').siblings().removeClass('addImgActive');
		$('.checkImgListBox').show();
	})
	$(document).on('click','.checkImgList>li',function(){
		$('.checkImgListBox').show();
		$(this).addClass('checkimgActive').siblings().removeClass('checkimgActive');
		var src = $(this).find('a').attr('imgsrc');
		reSetImgSize(src);
		//$('.spm_touchImgBox>.addImgActive').find('img').attr('src',src);
		
	})
	$(document).on('click','.sp_imgListBox>li',function(){
		var imgsrc = '',reurl='',proid = '';
		$(this).addClass('imgActive').siblings().removeClass('imgActive');
		reurl = $(this).attr('prourl');
		proid = $(this).attr('proId');
		if(reurl){
			
			imgsrc = reurl.replace('be_','af_');
			var image = new Image();
			image.crossOrigin = '*';
			image.src = imgsrc;
			image.onload = function(){
			    spmList[proid].bgSrc =  image.src;
			    spmList[proid].imgList = state.imgarr;
				clickToChoose(proid,'sharePosterEdit');
			}
		}
	})
	$('.sp_kindsListBox>li').click(function(){
		$(this).addClass('kindsActive').siblings().removeClass('kindsActive');
		var kind = $(this).attr('kind');
		aliyunimg(kind);
	})

})
function startImgAjax(){
	$.ajax({
        type:"POST",
        url:"/yich/WeChatGetPictures",
        dataType:"json",
        data:{
            "proId":state.proId,
        },
        success: function(data){
            state.userId=data?data.userId:'';
            state.supShopId = data.supShopId?data.supShopId:'';
            state.erwCodeUrl = data.codeSrc?data.codeSrc:'';
            var obj;
            if((typeof data).toLowerCase()=='string'){
            	obj=eval("("+data+")");
            }else{
            	obj=data;
            }
        	if(typeof (obj.productList)!='undefined' && typeof (obj.productList.shopInvtory)!='undefined' && obj.productList.shopInvtory.length>0){
        		var arr = obj.productList.shopInvtory;
        		var arrlength=arr.length;
        		var str = "";
        		for(var i=0;i<arrlength;i++){
        			var wh1={
        					w:(parseInt(parseFloat(getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(690))),
        					h:parseInt(parseFloat(getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(690)),
        				};
    				var whe1="@"+wh1.w+"w_"+wh1.h+"h";
    				var _src1=imgsize(arr[i].src,whe1);
    				state.imgarr.push(_src1);
        			var wh={
    					w:parseInt(parseFloat(getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(100)),
    					h:parseInt(parseFloat(getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(100)),
    				};
    				var whe="@"+wh.w+"w_"+wh.h+"h";
    				var _src=imgsize(arr[i].src,whe);
        			 str+=[
							'<li class="">',
							'<a imgsrc="'+_src1+'"><img src="'+_src+'"></a>',
							'</li>',
       			      ].join('');
        		}
        		$('.checkImgList').html(str);
        		editCheckImgSharePoster('festival11');//初始
        	}
        },
        error: function(){
            console.log('Ajax error!');
        }
    });

}
function editCheckImgSharePoster(type){
	if(spmList[type]){
		var imgsrc = "http://ngsimage.oss-cn-hangzhou.aliyuncs.com/hidden/sharePoster/festival/af_festival/"+type+".png"
		var image = new Image();
		image.crossOrigin = '*';
		image.src = imgsrc;
		image.onload = function(){
		    spmList[type].bgSrc =  image.src;
		    spmList[type].imgList = state.imgarr;
			clickToChoose(type,'sharePosterEdit');
		}
		
	}
}
function startpage(){
	var newUrl = '';
	if(_getReg("nextpage") == '1'){
		$('.sharePoster>dt').hide().siblings().show();
	}else{
		$('.sharePoster>dd').hide().siblings().show();
	}
	if(newUrl){
		history.replaceState(null,null,newUrl);
	}
	
}
function reSetImgSize(src){
	var imgEl = $(".spm_touchImgBox>.addImgActive>img");
	var aEl = $(".spm_touchImgBox>.addImgActive");
	var te_img = new Image();
	te_img.src = src;
	te_img.onload = function(){
		var iWidth = te_img.width;
		var iHeight = te_img.height;
		var sWidth = aEl.width();
		var sHeight = aEl.height();

		if(iWidth > iHeight) {
			var newWH = sWidth>sHeight?sWidth:sHeight;
			imgEl.css({"width": "","height": newWH + "px"});
		}
		else {
			var newWH = sWidth>sHeight?sWidth:sHeight;
			imgEl.css({"width": newWH + "px","height": ""});
		}
		imgEl.attr('src',src);

		imgEl.one("load", function() {
			imgEl.attr('initscale', imgEl.width()/imgEl[0].naturalWidth);
			imgEl.get(0).style.left = (aEl.width()/2-imgEl.width()/2) + "px";
			imgEl.get(0).style.top = (aEl.height()/2-imgEl.height()/2) + "px";
		});
	}
}
