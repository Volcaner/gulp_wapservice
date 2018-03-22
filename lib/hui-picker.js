/*
hui 选择器组件
作者 : 深海  5213606@qq.com
官网 : http://hui.hcoder.net/
*/
var HUI_PickerTimer = null, HUI_PickerId = 1;
function huiPickerHide(id){
	$('#hui-pickerBox').remove();
    //配合其他插件
	$('html').removeClass('noscroll');
}
function huiPicker(selector, callBack){
	this.pickerBtn    = $(selector);
	this.pickerId     = 'HUI_PickerMain';
	this.relevance    = true; 
	var huiPickerMain = document.createElement('div');
	huiPickerMain.setAttribute('class','hui-pickerBox');
	huiPickerMain.setAttribute('id','hui-pickerBox');
	huiPickerMain.innerHTML = '<div id="'+this.pickerId+'" class="hui-picker slideInUp zhuans_opendiv"><div class="hui-picker-menu">'+
	'<div class="hui-fl hui-button-small" onclick="huiPickerHide();">取消</div>'+
	'<div class="hui-fr hui-button-small hui-primary" id="HUI_PickerConfirm">确定</div>'+
'</div>'+
'<div class="hui-picker-list-inbox ulskulists"><div class="hui-picker-list-in"></div>'+
'<div class="hui-picker-line"></div></div></div>';
	document.body.appendChild(huiPickerMain);
	this.pickerMain   = $('#'+this.pickerId);
	this.listAll = null; this.level = 1; var thisObj = this;
	$('#HUI_PickerConfirm').click(function(){
		huiPickerHide(thisObj.pickerId);
		if(callBack){callBack();}
	});
	this.bindRelevanceData = function(data){
		this.dataSave = data;
		//加载选项列表
		var lists = this.pickerMain.find('.hui-picker-list');
		if(lists.length < 1){
			var listsHtml = '';
			var cWidth = parseInt(100 / this.level) + '%';
			for(var i = 0; i < this.level; i++){
				listsHtml += '<div class="hui-picker-list" huiseindex="0" huisevalue="0" huisetext="" levelNumber="'+i+'" style="width:'+cWidth+';"></div>';
			}
			this.pickerMain.find('.hui-picker-list-in').eq(0).html(listsHtml);
		}
		this.listAll = this.pickerMain.find('.hui-picker-list');
		//循环设置选项
		var newData = data;
		for(var i = 0; i < this.level; i++){
			if(i >= 1){
				if(newData[0].children){newData = newData[0].children;}else{newData = new Array();}
			}
			this.listAll.eq(i).html('');
			var html = '';
			for(var ii = 0; ii < newData.length; ii++){html += '<div class="yich-hui-list" pickVal="'+newData[ii].value+'">'+newData[ii].text+'</div>';}
			this.listAll.eq(i).html('<div style="height:4.352rem;"><input type="hidden" value="0" /></div>' + html + '<div style="height:4.352rem;"></div>');
			this.listAll.eq(i).get(0).addEventListener('scroll', this.scrollFun);
			//默认第一个被选中
			//this.listAll.eq(i).find('div').eq(1).css({color:'#636363', 'fontSize':'0.7rem'});
			if(typeof(newData[0]) != 'undefined'){
				this.listAll.eq(i).attr('huisevalue', newData[0].value);
				this.listAll.eq(i).attr('huisetext', newData[0].text);
			}
		}
	}
	this.scrollFun = function(){
		if(HUI_PickerTimer != null){clearTimeout(HUI_PickerTimer);}
		var scTop = this.scrollTop, scObj = this;
		HUI_PickerTimer = setTimeout(function(){thisObj.scrollDo(scTop, scObj);}, 200);
	}
	this.scrollDo = function(scTop, scObj){
		scObj.removeEventListener('scroll', this.scrollFun);
		var scHeight = parseFloat(thisObj.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(66);
		var cList = $(scObj), index = Math.round(scTop / scHeight), oldIndex = scObj.getAttribute('huiseindex');
		scObj.setAttribute('huiseindex', index);
		var selectDom   = cList.find('div').eq(index + 1);
		scObj.setAttribute('huisevalue', selectDom.attr('pickVal'));
		scObj.setAttribute('huisetext', selectDom.html());
		scObj.scrollTop = index * scHeight;
		//cList.find('div').css({color:'#9E9E9E', 'fontSize':'0.7rem'});
		//cList.find('div').eq(index + 1).css({color:'#636363', 'fontSize':'0.7rem'});
		var levelNumber = Number(scObj.getAttribute('levelNumber'));
		if(levelNumber < this.level - 1 && thisObj.relevance){
			if(oldIndex != index){this.nextReBind(index, levelNumber + 1);}
		}
		setTimeout(function(){scObj.addEventListener('scroll', thisObj.scrollFun);}, 300);
	}
	
	this.nextReBind = function(index, level){
		var allList  = this.pickerMain.find('.hui-picker-list');
		var bindList = allList.eq(level);
		bindList.html('');
		var html = '', newData = this.dataSave;
		//向上逐层寻找
		for(var k = 0; k < level; k++){
			var pIndex = allList.eq(k).attr('huiseindex');
			if(newData[pIndex].children){
				newData = newData[pIndex].children;
			}else{
				newData = new Array();
			}
		}
		if(newData.length > 0){
			for(var ii = 0; ii < newData.length; ii++){html += '<div class="yich-hui-list" pickVal="'+newData[ii].value+'">'+newData[ii].text+'</div>';}
			bindList.html('<div style="height:4.352rem;"></div>' + html + '<div style="height:4.352rem;"></div>');
			bindList.get(0).scrollTop = 0;
			bindList.get(0).setAttribute('huiseindex', 0);
			bindList.get(0).setAttribute('huisevalue', newData[0].value);
			bindList.get(0).setAttribute('huisetext', newData[0].text);
		}else{
			bindList.get(0).setAttribute('huiseindex', 0);
			bindList.get(0).setAttribute('huisevalue', 0);
			bindList.get(0).setAttribute('huisetext', '');
		}
		//allList.eq(level).find('div').eq(1).css({color:'#000000', 'fontSize':'0.7rem'});
		if(level < this.level - 1){this.nextReBind(0, level + 1);}
	}
	
	this.getVal  = function(index){
		if(!index){index = 0;}
		return this.pickerMain.find('.hui-picker-list').eq(index).attr('huisevalue');
	}
	this.getText = function(index){
		if(!index){index = 0;}
		return this.pickerMain.find('.hui-picker-list').eq(index).attr('huisetext');
	}
	this.getStyle = function(obj, attr){
		if(obj.currentStyle){
			return obj.currentStyle[attr];
		}
		else{
			return getComputedStyle(obj, false)[attr];
		}
	}
}
