var TIMER = null;//计时15秒后
var state = {
		proId:'',
		userId:'',
		supShopId:'',
		erwCodeUrl:'',//后台返回二维码地址
		imgarr:[],//图片数据
		kindsStyle:'festival',
		where:'',//gostore:生成仓储首页二维码，gogoods:生成商品详情页二维码
}
/*提示模态框*/
window.konwsMTfunc = (function(){
    var text = '';
    var btnName = "知道了";
    var single = null;
    var func = null;
    function getsingle(txt,name,fun){
        if(single == null){
            text = txt;
            btnName = name?name:"知道了";
            func = fun?fun:null;
            single = new init();
        }
        return single;
    };
    function init(){
        var konwmt_box = document.createElement('div');
        var konwmt_conbox = document.createElement('dl');
        var konwmt_text = document.createElement('dt');
        var konwmt_btn = document.createElement('dd');
        
        konwmt_conbox.appendChild(konwmt_text);
        konwmt_conbox.appendChild(konwmt_btn);
        konwmt_box.appendChild(konwmt_conbox);
        konwmt_box.id = "konwmt_box";
        document.body.appendChild(konwmt_box);

        konwmt_text.innerHTML = text;
        konwmt_btn.innerHTML = btnName;
        konwmt_btn.addEventListener('touchstart',function(event){
            event.preventDefault();
            text = '';
            single = null;
            if(func){
            	func();
            }
            konwmt_box.parentNode.removeChild(konwmt_box);
        },false);
    };

    return getsingle;
})();
/*提示框*/
window.promptFunc = (function(){
	var MobileTishi = function(){
		this.thisType = "";/*""默认的,没有图标 & suc:成功,有图标 & war:警告,有图标 & err:失败,有图标*/
		this.func = null;//回调
		this.text = ""; //文本
		this.single = null;
		this.istop = null;//布局结构(默认:左右&上下)
		this.timer = null;//延时
	};
	MobileTishi.prototype = {
		init:function(params){
			this.single = document.getElementById('mt_prompt_leftbox')?document.getElementById('mt_prompt_leftbox'):document.getElementById('mt_prompt_topbox');
			this.type = params.type?params.type:"";
			this.func = params.func;
			this.text = params.text;
			this.istop = params.istop;
			if(this.single){
				document.body.removeChild(this.single);
			}
			this.binEvent(this.type);
		},
		binEvent:function(type){
			var _self = this;
			var mt_box = document.createElement('div');
            var mt_icon = document.createElement('i');
            var mt_text = document.createElement('p');
            mt_box.appendChild(mt_icon);
            mt_box.appendChild(mt_text);
            mt_box.id = _self.istop == null ? "mt_prompt_leftbox" : "mt_prompt_topbox";
            document.body.appendChild(mt_box);
            switch(type){
                case "suc":
                    mt_icon.className = "icon-checked";
                break;
                case "war":
                    mt_icon.className = "icon-warning";
                break;
                case "err":
                    mt_icon.className = "icon-error";
                break;
                case "":
                    mt_box.removeChild(mt_icon);
                break;
            }
            mt_text.innerHTML = _self.text;
            	_self.timer = setTimeout(function(){
            	_self.single = null;
                _self.timer = null;
                _self.istop = null;
            	clearTimeout(_self.timer);
            	if(mt_box.parentNode){
            		mt_box.parentNode.removeChild(mt_box);
            	}
               	if(_self.func){
               		_self.func();
               	}

            },2000);
}
	}
	return MobileTishi;
})();
//img-size
window.imgsize = function(src,size){
	if((src).indexOf('http://ngsimage')==-1){
		var imgsrc=(src);
		return imgsrc;
	}else{
		var oss_img='';
		var src_oss=(src).split(".");
		src_oss.splice(src_oss.length-1,1);
		var left_ossimg=src_oss.join('.');
		var srclast_oss=src.split('.');
		srclast_oss=srclast_oss[srclast_oss.length-1];
		var a_oss=srclast_oss.split("jpg").length
		var c_oss=srclast_oss.split("png").length
		var e_oss=srclast_oss.split("jpeg").length
		var g_oss=srclast_oss.split("JPG").length
		var i_oss=srclast_oss.split("PNG").length
		var k_oss=srclast_oss.split("JPEG").length
		var o_oss=srclast_oss.split("gif").length
		var m_oss=srclast_oss.split("GIF").length
		if(a_oss>1){
			oss_img=left_ossimg+'.jpg'
		}else if(c_oss>1){
			oss_img=left_ossimg+'.png'
		}else if(e_oss>1){
			oss_img=left_ossimg+'.jpeg'
		}else if(g_oss>1){
			oss_img=left_ossimg+'.JPG'
		}else if(i_oss>1){
			oss_img=left_ossimg+'.PNG'
		}else if(k_oss>1){
			oss_img=left_ossimg+'.JPEG'
		}else if(o_oss>1){
			oss_img=left_ossimg+'.gif'
		}else if(m_oss>1){
			oss_img=left_ossimg+'.GIF'
		}else{
			oss_img=(src);
		}
		var imgsrc=oss_img.replace("oss-","img-");
		imgsrc=imgsrc+size;
	    return imgsrc;
	}
};
window.getStyle = function(obj, attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj, false)[attr];
	}
}
window._getReg = function(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null) return  unescape(r[2]); return null;
}
window.isLoading = function(time){
	if(time){
		TIMER = setTimeout(function(){
			if($('.rsp_loading').css('display')=='none'){
				clearTimeout(TIMER);
				TIMER = null;
			}else{
				var str = "海报居然走丢啦!请您稍后再试哦~";
				konwsMTfunc(str,'',function(){//提示框
					$('.rsp_loading').hide();
				});
			}
		},time);
	}else{
		clearTimeout(TIMER);
		TIMER = null;
	}
}
state.proId = _getReg("proId");
state.where = _getReg("where")?_getReg("where"):'gostore';
//解决跨域问题
/*function resetImgSrc(image){
	var createObjectURL = function(blob){
	     return window[window.webkitURL ? 'webkitURL' : 'URL']['createObjectURL'](blob);
	};
	var dataURLtoBlob = function(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
	var getBase64Image = function(img) {
	    var canvas = document.createElement("canvas");
	    canvas.width = img.width;
	    canvas.height = img.height;
	    var ctx = canvas.getContext("2d");
	    ctx.drawImage(img, 0, 0, img.width, img.height);
	    var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
	    var dataURL = canvas.toDataURL("image/"+ext);
	    return dataURL;
	}
	var base64 = getBase64Image(image);
	return window.URL.createObjectURL(dataURLtoBlob(base64));
};*/