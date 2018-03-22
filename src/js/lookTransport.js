var state = {
	traId:decodeURI(window.location.href).split('traId=')[1]?decodeURI(window.location.href).split('traId=')[1].split('&')[0]:'',
	logNum:decodeURI(window.location.href).split('logNum=')[1]?decodeURI(window.location.href).split('logNum=')[1].split('&')[0]:'',
	imgsrc:decodeURI(window.location.href).split('imgsrc=')[1]?decodeURI(window.location.href).split('imgsrc=')[1].split('&')[0]:'',
	transportCompany:decodeURI(window.location.href).split('post=')[1]?decodeURI(window.location.href).split('post=')[1].split('&')[0]:'',
	transArr:[{name:"圆通速递",tel:"95554"},{name:"申通快递",tel:"95543"},{name:"韵达速递",tel:"95546"},
	          {name:"中通快递",tel:"95311"},{name:"汇通快递",tel:"95320"},{name:"顺丰速运",tel:"95338"},
	          {name:"天天快递",tel:"400-188-8888"},{name:"EMS",tel:"11183"},{name:"百世快递",tel:"95320"},
	          {name:"全峰快递",tel:"400-100-0001"},{name:"宅急送",tel:"400-6789-000"},{name:"国通快递",tel:"95327"},
	          {name:"EMS国际件",tel:"11183"}],
}
$(function(){
	setStarData();
	console.log(window.location.href)
})
function setStarData(){
	var wh={
			w:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(184)),
			h:parseInt(parseFloat(func.getStyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(184)),
	};
	var whe="@"+wh.w+"w_"+wh.h+"h";
	var _src=func.imgsize(state.imgsrc,whe);
	$('.imgbox').find('img').attr("src",_src);
	$.ajax({
		type:"post",
		url:"/yich/PhoneCheckLogInfo",
		dataType:"json",
		data:{traId:state.traId,logNum:state.logNum},
		success:function(data){
			if(typeof (data.userId)!='undefined'){
			    func.fwh_authorize(data.userId);
			}
			//404
			checkErrorAjax(data);
			var goodsNum = data.sum?data.sum:0;
			$('.imgbox').find('span').html(goodsNum+"个商品");
			$('.tanspNum>p').eq(0).find('span').html('暂无')
			$('.tanspNum>p').eq(1).find('span').html(state.transportCompany);
			$('.tanspNum>p').eq(2).find('span').html(state.logNum);
			if(data.result && data.result.result){
				var transData = data.result.result;
				var newpost = (transData.list && transData.list[transData.list.length-1])?(transData.list[transData.list.length-1].remark?transData.list[transData.list.length-1].remark:'暂无'):'暂无';
				var postcom = state.transportCompany?state.transportCompany:'暂无';
				var postno = transData.no?transData.no:'暂无';
				$('.tanspNum>p').eq(0).find('span').html(newpost)
				$('.tanspNum>p').eq(1).find('span').html(postcom);
				$('.tanspNum>p').eq(2).find('span').html(postno);
				for(var t in state.transArr){
					if(postcom == state.transArr[t].name){
						$('.tanspNum>p').eq(3).find('span').html(state.transArr[t].tel);
					}
				}
			}
			if(data.result && data.result.result && data.result.result.list){
				var str = '';
				var list = data.result.result.list;
				for(var i=list.length-1;i>=0;i--){
				/*for(var i in list){*/
					if(i== list.length-1){
						str +=[
								'<li>',
								'<p>'+list[i].remark+'~</p>',
								'<p>'+list[i].datetime+'</p>',
								'<div class="circle"><b class="circle"></b></div>',
								'</li>',
						      ].join('');
					}else{
						str += [
								'<li>',
								'<p>'+list[i].remark+'</p>',
								'<p>'+list[i].datetime+'</p>',
								'<i></i>',
								'<div class="circle"><b></b></div>',
								'</li>',
						      ].join('');
					}
					
				}
				$('.list').html(str);
				str = '';
			}
			func.reloading();
		},
		error:function(err){},
	})
}