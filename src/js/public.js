$(function(){
	func.reloading();
})
function Stringlength(str,size){
  	var name='';
  	var b=0;
  var re=/[\u4E00-\u9FA5]|\s/;
  var bb=0;
  if(str.match(re)){
   var aa=str.match(re);
   bb=aa.length;
  }
  var numstr=bb*0.5+(str.length-bb);
  for(var h=0;h<str.length;h++){

           if(!re.test(str[h])){
                 b+=0.5*1;
           }else{		
           	b+=1*1;
           }
           
           if(b<=size){
           	name+=str[h];
           	
           }else{
           
           }
      }
  return name;
}; 
function strlengh(string){
	var name='';
  	var b=0;
  var re=/[\u4E00-\u9FA5]|\s/;
  var bb=0;
  var str=string;
  if(str.match(re)){
   var aa=str.match(re);
   bb=aa.length;
  }
  var numstr=bb*0.5+(str.length-bb);
  for(var h=0;h<str.length;h++){

           if(!re.test(str[h])){
                 b+=0.5*1;
           }else{		
           	b+=1*1;
           }
      }
 var n=Math.ceil(b);
 return n;
}
func = {
setTime:null,//延时Id
//可视区加载图片
showimg:function(){
	var img = document.querySelectorAll(".loading_bg");
    for(var i=0;i<img.length;i++){
    	var src=img[i].getAttribute("data-ks-lazyload");
    	var clients = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
   	var heardheight=document.getElementById("header")?document.getElementById("header").offsetHeight:0;
    	var footerheight=document.getElementById("footer")?document.getElementById("footer").offsetHeight:0;
    	var imgtop=img[i].getBoundingClientRect().top;
    	var h=(clients-footerheight-(parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(20))))
    	if(src && imgtop<=h){
    		img[i].setAttribute("src",src);
    		img[i].removeAttribute("data-ks-lazyload");
    	}
    }
},
reloading:function(){
	if(func.setTime){
		clearTimeout(func.setTime);
		func.setTime = null;
	}
func.setTime = setTimeout(function(){
		$('#pageloading').hide();
	},500)
},
//localStorage
localadd:function(o,str){
	if(window.localStorage && (window.localStorage)[o]){
		var obj = localStorage.getItem(o);
		var arr=eval("("+obj+")");
		if(arr.length>200){
			localStorage.removeItem(o);
		}
	}
	if(window.localStorage && (window.localStorage)[o]){
		var obj = localStorage.getItem(o);
		var arr=eval("("+obj+")");
		var arrsz=[];
		var arrconcat=[];
		for(var j=0;j<arr.length;j++){
			arrconcat.push(JSON.stringify(arr[j]));
			arrsz.push(arr[j].pro_id);
		}
		var obj=eval("("+str+")");
		if(arrsz.indexOf(obj.pro_id)==-1){
			arrconcat.push(str);
   	    }
		
		localStorage.setItem(o,'['+arrconcat+']');
	}else{
		var sz=[];
		sz.push(str);
		localStorage.setItem(o,'['+sz+']');
	};
},
localremove:function(o,str){
	if(window.localStorage && (window.localStorage)[o]){
		var obj = localStorage.getItem(o);
		var arr=eval("("+obj+")");
		var arrsz=[];
		var obj=eval("("+str+")");
		for(var j=0;j<arr.length;j++){
			if(arr[j].pro_id==obj.pro_id){
				arr.splice(j,1);
				break
			}
		}
		for(var k=0;k<arr.length;k++){
			arrsz.push(JSON.stringify(arr[k]));
		}
		localStorage.setItem(o,'['+arrsz+']');
	}

},
claddcount:function(){
	if (localStorage['clcount_'+supshopId]){
		localStorage['clcount_'+supshopId]=Number(localStorage['clcount_'+supshopId]) +1;
	}else{
		localStorage['clcount_'+supshopId]=1;
	}
	clcont();
},
//重新授权
authorize:function(userId,supshopId){
 if((typeof userId=='undefined') || (!userId)){
	  window.location.href= "/yich/ClickWechatButton?supshopId="+supshopId;
  }
},
fwh_authorize:function(userId){
	if((typeof userId=='undefined') || (!userId)){
		  window.location.href= "/yich/PhoneClickWechatButton";
	  }
},
//采录个数
claddcount:function(){
	if (localStorage['fwhclcount_'+supshopId]){
		localStorage['fwhclcount_'+supshopId]=Number(localStorage['fwhclcount_'+supshopId]) +1;
	}else{
		localStorage['fwhclcount_'+supshopId]=1;
	}
	//clcont();
},
//img-size
imgsize:function(src,size){
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
},
getStyle:function(obj, attr)
{
	if(obj.currentStyle)
	{
		return obj.currentStyle[attr];
	}
	else
	{
		return getComputedStyle(obj, false)[attr];
	}
}
}
//404
window.checkErrorAjax=function(data){
 if(data){
   if(data.exceptionValue=='1'){
      window.location.href='/yich/wap/src/html/404.html';
    }
  }
}
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
/*提示模态框*/
var konwsMTfunc = (function(){
    var text = '';
    var btnName = "知道了";
    var single = null;
    function getsingle(txt,name){
        if(single == null){
            text = txt;
            btnName = name?name:"知道了";
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
            konwmt_box.parentNode.removeChild(konwmt_box);
        },false);
        konwmt_box.addEventListener('touchmove',function(ev){
        	ev.preventDefault();
        },false);
    };

    return getsingle;
})();
/*选择模态框*/
var chekMTfunc = (function(){
    var text = "";
    var btnName = "确定";
    var surefunc=null;
    var single = null;
    function getsingle(txt,sure,name){
        if(single == null){
            text = txt;
            btnName = name?name:"确定";
            surefunc = sure;
            single = new init();
        }
        return single;
    };
    function init(){
        var checkmt_box = document.createElement('div');
        var checkmt_conbox = document.createElement('dl');
        var checkmt_text = document.createElement('dt');
        var checkmt_btn = document.createElement('dd');
        var cancel_btn = document.createElement('input');
        var sure_btn = document.createElement('input');
        checkmt_btn.appendChild(cancel_btn);
        checkmt_btn.appendChild(sure_btn);
        checkmt_conbox.appendChild(checkmt_text);
        checkmt_conbox.appendChild(checkmt_btn);
        checkmt_box.appendChild(checkmt_conbox);
        cancel_btn.type="button";
        sure_btn.type="button";
        cancel_btn.value = "取消";
        sure_btn.value = btnName;
        checkmt_box.id = "checkmt_box";
        document.body.appendChild(checkmt_box);

        checkmt_text.innerHTML = text;
        sure_btn.addEventListener('touchstart',sureTouch,false);
        cancel_btn.addEventListener('touchstart',cancelTouch,false);
        checkmt_box.addEventListener('touchmove',function(ev){
        	ev.preventDefault();
        },false);
    };
    function sureTouch(event){
        event.preventDefault();
        if(surefunc){
            surefunc();
        }
        removeCell();
    };
    function cancelTouch(event){
        event.preventDefault();
        removeCell();
    };
    function removeCell(){
        var el = document.getElementById('checkmt_box');
        text = '';
        surefunc = null;
        single = null;
        $('body').css('overflow','auto')
        el.parentNode.removeChild(el);
    };

    return getsingle;
})();
/*付款键盘*/
window.keyBoardPay = (function(){
    var MobileKeyBoard = function(){
            this.thisType = "payment";/*payment是付款键盘 & paygood是确认收货接盘*/
            this.func = null;
            this.single = null;
            this.passwordArr = [];
            
        };
    MobileKeyBoard.prototype = {
        init:function(params){
            this.single = document.getElementById('payKeyboard');
            this.type = params.type;
            this.func = params.func;
            this.money = params.money?params.money:0;
            this.balance = params.balance?params.balance:0;
            if(this.single){
                document.body.removeChild(this.single);
            }
            this.binEvent(this.type);
        },
        binEvent:function(type){
            var _self = this;
            function domData(){
                var typeDom = {
                        "payment":[
                                '<li><i id="key_cancel">×</i>请输入交易密码</li>',
                                '<li id="key_ispay">￥'+parseFloat(_self.money).toFixed(2)+'</li>',
                                '<li id="key_overprice">余额:￥'+parseFloat(_self.balance).toFixed(2)+'</li>',
                                ].join(''),
                        "paygood":[
                                '<li><i id="key_cancel">×</i>确认收货</li>',
                                '<li id="key_ispay">￥'+parseFloat(_self.money).toFixed(2)+'</li>',
                                '<li id="key_overprice">请输入交易密码</li>',
                                ].join(''),
                    };
                var keyboardbox = document.createElement('div'); 
                keyboardbox.id = "payKeyboard";
                keyboardbox.className ="slideInUp";
                keyboardbox.innerHTML = '<div id="paycon">'+
                    '<ul class="p_price">'+
                        ''+typeDom[type]+''+
                        '<li id="password">'+
                            '<span></span>'+
                            '<span></span>'+
                            '<span></span>'+
                            '<span></span>'+
                            '<span></span>'+
                            '<span></span>'+
                        '</li>'+
                    '</ul>'+
                    '<ul class="p_key">'+
                        '<li class="keyboard_mm" num="1">1</li>'+
                        '<li class="keyboard_mm" num="2">2</li>'+
                        '<li class="keyboard_mm" num="3">3</li>'+
                        '<li class="keyboard_mm" num="4">4</li>'+
                        '<li class="keyboard_mm" num="5">5</li>'+
                        '<li class="keyboard_mm" num="6">6</li>'+
                        '<li class="keyboard_mm" num="7">7</li>'+
                        '<li class="keyboard_mm" num="8">8</li>'+
                        '<li class="keyboard_mm" num="9">9</li>'+
                        '<li num=""></li>'+
                        '<li class="keyboard_mm" num="0">0</li>'+
                        '<li class="delnum" num=""><i class="icon-delete icon-font-nomal" id="delkey"></i></li>'+
                    '</ul>'+
                '</div>';
                document.body.appendChild(keyboardbox);
                var clickNum = document.getElementsByClassName('keyboard_mm');
                var cancelNum = document.getElementsByClassName('delnum')[0];
                var keyBoardCancel = document.getElementById('key_cancel');
                for (var i=0;i<clickNum.length;i++) {
                    clickNum[i].addEventListener('touchstart',clickNumStart,false);
                }
                cancelNum.addEventListener('touchstart',cancelNumStart,false);
                keyBoardCancel.addEventListener('touchstart',keyBoardCancelStart,false);
                keyboardbox.addEventListener('touchmove',function(ev){
                	ev.preventDefault();
                },false);
            };
            //点击添加password
            function clickNumStart(event){
                event.preventDefault();
                var _this = this;
                var num = _this.getAttribute('num');
                _this.classList.add("active");
                setTimeout(function(){
                    _this.classList.remove("active");
                },100)
                if(_self.passwordArr.length<6){
                    _self.passwordArr.push(num);
                }
                addnum();
            };
            //点击删除password
            function cancelNumStart(){
                event.preventDefault();
                _self.passwordArr.splice((_self.passwordArr.length-1),1);
                renum();
            };
            //添加password
            function addnum(){
                var str ='<i></i>';
                var leng = _self.passwordArr.length-1;
                var pwd = document.getElementById('password');
                pwd.getElementsByTagName('span')[leng].innerHTML = str;
                if(_self.passwordArr.length == 6){
                    if(_self.func){
                    _self.func(_self.passwordArr.join(""));
                    }
                    keyBoardCancelStart();
                }
            };
            //删除password
            function renum(){
                var leng = _self.passwordArr.length;
                var pwd = document.getElementById('password');
                pwd.getElementsByTagName('span')[leng].innerHTML = "";
            };
            //移除
            function keyBoardCancelStart(){
                event.preventDefault();
                var keyboard = document.getElementById('payKeyboard');
                _self.single = null;
                _self.passwordArr = [];
                keyboard.parentNode.removeChild(keyboard);
            };
            //dom执行
            domData();

        },
        
    }
    return MobileKeyBoard;
})();

//采录个数
function clcont(){
	var countclhtml=document.getElementById("countcl");
	if(localStorage['fwhclcount_'+supshopId] && localStorage['fwhclcount_'+supshopId]>0){
		var c=localStorage['fwhclcount_'+supshopId];
		var count=0;
		if(c*1>99){
			count=99+'+';
		}else{
			count=c;
		}
		if(countclhtml){
			countclhtml.innerHTML=count;
			countclhtml.style.display='block';
		}else{
			if(countclhtml){
			countclhtml.style.display='none';
			}
		}
	}else{
		if(countclhtml){
		countclhtml.style.display='none';
		}
	}
};

//获取采购单数量
cgdcount();
function cgdcount(){
	var hqcaigoucont=0;
	var count=0;
	var c=0;
	if(window.localStorage){
		 for(localkey in window.localStorage) {
	          if(localkey.indexOf("localobject_") == 0) {
	        	  c += JSON.parse(window.localStorage[localkey]).length;
	          }
	        }
		 if(c>99){
				count=99+"+";
			}else{
				count=c;
			}
	var counthtml=document.getElementById("countcg");
	if(count*1>0){
		if(counthtml){
			counthtml.innerHTML=count;
			counthtml.style.display='block';
		}
	}else{
		if(counthtml){
			counthtml.style.display='none';
		}
		
	}
  }else{
	  alert("浏览暂不支持localStorage")
  }
};
//加入采购单循环判断
function pdcgd(id){
	var a=localStorage.getItem("localobject_"+supshopId);
	if($.trim(a)!=''){
		var arr=eval("("+a+")");
		var idarr=[];
		if(arr.length>0){
			 for(var i=0;i<arr.length;i++){
				 idarr.push(arr[i].pro_id);
				 }
			 if(idarr.indexOf(id)!==-1){
				  return true
			     }else{
				  return false
			   }
		 }
	}else{
		return false;
	}
};
//截取超链接数据
function _getReg(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null) return  unescape(r[2]); return '';
}
//关闭fixed组件放开其后面的组件滑动
function _htmlScrollOk(){
	/*var inBrowser = typeof window !== 'undefined';
	var UA = inBrowser && window.navigator.userAgent.toLowerCase();
	var isAndroid = UA && UA.indexOf('android') > 0;
	var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);*/
	var htmlEl = document.querySelector('html');
    var htmlTop = parseFloat(htmlEl.getBoundingClientRect().top);
    htmlEl.style.overflow = "auto";
    htmlEl.style.position = "initial";
    htmlEl.style.top = "0px";
    document.body.scrollTop = Math.abs(htmlTop);
    /*if(isIOS || isAndroid){
    	document.body.scrollTop = Math.abs(htmlTop);
    }else{
    	document.documentElement.scrollTop = Math.abs(htmlTop);
    }*/
};
//弹出fixed组件禁止其后面的组件滑动
function _htmlScrollPok(){
	var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
	var htmlEl = document.querySelector('html');
    htmlEl.style.top = -scrollTop+"px";
    htmlEl.style.overflow = "hidden";
    htmlEl.style.position = "fixed";
};