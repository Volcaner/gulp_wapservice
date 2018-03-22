var AliyunUpload = null;
var htmlToImgTimer = null;
var beFileFolder = "";//案例图
//完成
function makeImgSharePoster(){
	 html2canvas(document.querySelector("#spm_touchModelBox"),{
	 	useCORS:true,
	 }).then(function (canvas) {
	 	var imageSrc = canvas.toDataURL("image/png"); //图片地址
	 	var image = new Image();
	 	//image.crossOrigin = '*';
	 	image.src = imageSrc;
	 	if($('#hideTouchModelBox').length>0){
	 		image.className = "rsp_img";
	 		image.onload = function(){
	 			$('.rsp_imgBox>a').html(image);
	 			$('#hideTouchModelBox').css("z-index","-1");
	 			$('#spm_touchModelBox').html("");
	 			$('.rsp_loading').hide();
	 			clearTimeout(htmlToImgTimer);
				htmlToImgTimer = null;
	 			isLoading();
	 		}
			
	 	}else{
	 		image.className = "sp_img";
	 		image.onload = function(){
	 			$('.sp_imgbox').html(image);
	 			$('.sharePoster>dd').show().siblings().hide();
	 			$('.rsp_loading').hide();
	 			clearTimeout(htmlToImgTimer);
	 			htmlToImgTimer = null;
	 			isLoading();
	 		}
	 	}
	 });
}
function resetcanvas(src){
	var img = new Image();
	img.src = src;
	img.crossOrigin="*";
	img.onload=function(){
		 var canvas = document.createElement("canvas");
		  canvas.getContext("2d").drawImage(img, 0, 0);;
		  var dataURL = canvas.toDataURL("image/svg+xml");
		  console.log(dataURL)
	}
	 
}
function aliyunimg(type){
	var afFileFolder = "";//镂空图
	switch(type){
		case "festival":
			beFileFolder = "hidden/sharePoster/festival/be_festival";
			afFileFolder = "hidden/sharePoster/festival/af_festival";
		break;
		case "concise":
			beFileFolder = "hidden/sharePoster/concise/be_concise";
			afFileFolder = "hidden/sharePoster/concise/af_concise";
		break;
		case "sweet":
			beFileFolder = "hidden/sharePoster/sweet/be_sweet";
			afFileFolder = "hidden/sharePoster/sweet/af_sweet";
		break;
		case "personal":
			beFileFolder = "hidden/sharePoster/personal/be_personal";
			afFileFolder = "hidden/sharePoster/personal/af_personal";
		break;
	}
	
	AliyunUpload = new $.AliyunUpload();
	reInitOss();
	/*AliyunUpload.init({
		region: 'oss-cn-hangzhou',
	    accessKeyId: 'LTAIuio3BmR3xlxV',
	    accessKeySecret: 'SaNNLqkclS0UbU0HzqtR9m0r8tyx47',
	    bucket: 'ngsimage',
	});*/
}
function reInitOssInit(){
	AliyunUpload.getList(beFileFolder + "/", function(list) {
		//console.log(list);
		var str = '';
		for(var i = 1;i<list.length;i++){
			var wh={
				w:parseInt(parseFloat(getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(136)),
				h:parseInt(parseFloat(getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(136)),
			};
			var whe="@"+wh.w+"w_"+wh.h+"h";
			var _src=imgsize(list[i],whe);
			var rename = getSharePosterName(list[i]);
			str += '<li proId="'+rename+'" prourl="'+list[i]+'"  class=""><img src="'+_src+'"></li>';
		}
		$('.sp_imgListBox').html(str);
	})
}
function  getSharePosterName(pro){
	var spArr = [],rename = '';
	if(pro){
		spArr = pro.split('/');
		rename = spArr[spArr.length-1].split('.')[0];
	}
	return rename;
}
window.clickToChoose = function(key,whopage) {
	var obj = spmList[key];
	if(obj) {
		var strHtml = '\
			<div class="spm_touchImgBox"></div>\
			<div class="spm_touchBack"></div>\
			<div class="spm_ewm">\
			</div>\
		';

		$("#spm_touchModelBox").html("");
		$("#spm_touchModelBox").removeClass();
		$("#spm_touchModelBox").append(strHtml);
		$("#spm_touchModelBox").addClass(obj.id);
		
		if(state.where == 'gogoods'){
			//二维码
			var qrcode = new QRCode($('.spm_ewm').get(0), {
			    width : 130,//设置宽高
			    height : 130,
			    correctLevel : QRCode.CorrectLevel.L,
			});
			var localtion=((window.location.href).split("yich"))[0];
			var hreflocal = localtion+'yich/wapservice/dist/html/goods_detail_resale.html?proId='+state.proId+'&userId='+state.userId;
			 qrcode.makeCode(hreflocal);
		}else{
			$('.spm_ewm').html('<img src='+state.erwCodeUrl+' crossOrigin="*">');
		}
		
		$(".spm_touchBack").css("background-image", "url(" + obj.bgSrc + ")");
		//$(".spm_touchBack>img").attr("src", obj.bgSrc);
		var sin = 0;
		var loop = function(i) {
			if(obj.imgList[i]){
				$(".spm_touchImgBox").append('<a class="spm_img' + i + '"><img src="' + obj.imgList[i] + '" crossOrigin="*"/></a>');
			}else{
				if(obj.imgList[sin]){
					$(".spm_touchImgBox").append('<a class="spm_img' + i + '"><img src="' + obj.imgList[sin] + '" crossOrigin="*"/></a>');
				}else{
					sin = 0;
					$(".spm_touchImgBox").append('<a class="spm_img' + i + '"><img src="' + obj.imgList[sin] + '" crossOrigin="*"/></a>');
				}
				sin++;
			}
			
			$(".spm_touchBack").append('<a class="spm_img' + i + '"></a>');

			var imgEl = $(".spm_touchImgBox>a.spm_img" + i + ">img");
			var aEl = $(".spm_touchImgBox>a.spm_img" + i);
			imgEl.one("load", function() {
					var iWidth = imgEl.width();
					var iHeight = imgEl.height();
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

					imgEl.attr('initscale', imgEl.width()/imgEl[0].naturalWidth);

					imgEl.get(0).style.left = (aEl.width()/2-imgEl.width()/2) + "px";
        			imgEl.get(0).style.top = (aEl.height()/2-imgEl.height()/2) + "px";
			});
		}

		for(var b = 0; b < obj.num; b++) {
			loop(b);
		}
		
		if(obj.bIsTxt) {
			$("#spm_touchModelBox").append('<textarea class="spm_text" placeholder="商品描述(限100字以内)" maxlength="100">'+obj.txt+'</textarea>');
		}

		//$(".spm_ewm>img").attr("src", obj.qrSrc);
		if(whopage && whopage == "sharePosterEdit"){
			$('.spm_touchBack>a').each(function(){
				var $targetObj = $(this);
				cat.touchjs.init($targetObj, function (left, top, scale, rotate) {}); 
				cat.touchjs.drag($targetObj, function (left, top) { }); 
				cat.touchjs.scale($targetObj, function (scale) { }); 
				cat.touchjs.rotate($targetObj, function (rotate) { });
			})
		}else if(whopage && whopage == "releaseSharePoster"){
			var tempimg = new Array()
			for(var t = 0; t < obj.num; t++){
				with({b:t}){ //图片全部加载完后执行生成图片
					tempimg[b]  = new Image();
					tempimg[b].crossOrigin = "*";
					tempimg[b].src = obj.imgList[b];
					tempimg[b].onload = function(){
						if(b == 0 && tempimg[b].complete){
							htmlToImgTimer = setTimeout(function(){
								makeImgSharePoster();
							},100)
						}
					}
				}
			}
		}
	}
};

