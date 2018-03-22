/*手机操作-提示框*/
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

            },20000);
}
	}
	return MobileTishi;
})();