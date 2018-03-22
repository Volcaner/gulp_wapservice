/*
 * 发布成功分享海报
 * 商品管理分享海报
 */
$(function(){
	startImgAjax();
	aliyunimg(state.kindsStyle);
	//编辑
	$('.editPosterBtn').click(function(){
		window.location.href="/yich/wapservice/dist/html/sharePosterEdit.html?where="+state.where+"&proId="+state.proId;
	})
	//换风格
	$('.chageStyleBtn').click(function(){
		switch(state.kindsStyle){
		case 'festival':
			state.kindsStyle = 'concise';
			break;
		case 'concise':
			state.kindsStyle = 'sweet';
			break;
		case 'sweet':
			state.kindsStyle = 'personal';
			break;
		case 'personal':
			state.kindsStyle = 'festival';
			break;
		}
		aliyunimg(state.kindsStyle);
	})
	$(document).on('click','.rsp_imgListBox>li',function(){
		var reurl='',proid = '';
		$(this).addClass('imgActive').siblings().removeClass('imgActive');
		$('.rsp_loading').show();
		reurl = $(this).attr('prourl');
		proid = $(this).attr('proId');
		setImgSharePoster(proid,reurl);
		$('.rsp_imgBox>a').html("");	
		$('#hideTouchModelBox').css("z-index","1");
		isLoading(15000);
	})
})
function startImgAjax(){
	//发布成功页面链接赋值
	if($('.rsp_goodsDetailBtn').length>0){//商品详情页
		$('.rsp_goodsDetailBtn').attr('href','/yich/wapservice/dist/html/goods_detail_page.html?proId='+state.proId);
	}
	$.ajax({
        type:"POST",
        url:"/yich/WeChatGetPictures",
        dataType:"json",
        data:{
            "proId":state.proId,
        },
        success: function(data){
            state.userId = data.userId?data.userId:'';
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
        					w:parseInt(parseFloat(getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(690)),
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
        		checkImgSharePoster(state.imgarr);
        		//console.log(state.imgarr)
        	}
        },
        error: function(){
            console.log('Ajax error!');
        }
    });
	isLoading(15000);
}
function setImgSharePoster(proId,reurl){
	var imgsrc = '';
	if(proId && reurl){
		imgsrc = reurl.replace('be_','af_');
		var image = new Image();
		image.crossOrigin = '*';
		image.src = imgsrc;
		image.onload = function(){
		    spmList[proId].bgSrc =  image.src;
		    spmList[proId].imgList = state.imgarr;
			clickToChoose(proId,'releaseSharePoster');
		}
	}
}
function checkImgSharePoster(imgarr){
	var isStop = false;
	var leng = imgarr.length;
	for(var i=leng;i>0;i--){
		for(var j=1;j<=leng;j++){
			var tempkey = "festival"+i+""+j;
			if(spmList[tempkey]){
				var imgsrc = "http://ngsimage.oss-cn-hangzhou.aliyuncs.com/hidden/sharePoster/festival/af_festival/"+tempkey+".png"
				var image = new Image();
				image.crossOrigin = '*';
				image.src = imgsrc;
				image.onload = function(){
				    spmList[tempkey].bgSrc =  image.src;
				    spmList[tempkey].imgList = imgarr;
					clickToChoose(tempkey,'releaseSharePoster');
				}
				isStop = true;
				break;
			}
		}
		if(isStop){
			break;
		}
	}
}