var option = 'PUT_AWAY';
/*$(document).ready(function(){
	option = 'PUT_AWAY';
	ajax(option,1);
});*/
$(document).on("click",".click-btn",function(){
	var operation = '';
	var proid = $(this).parent().find('.pro_id').val();
	if($(this).val() == '删除'){
		operation = 'del';
		chekMTfunc('确定删除当前商品吗？',function(){
			operate(operation,proid);
		});
	}else if($(this).val() == '上架'){
		operation = 'put';
		operate(operation,proid);
	}else if($(this).val() == '下架'){
		operation = 'out';
		operate(operation,proid);
	}
});
function operate(operation,proid){
	$.ajax({
		type: 'POST',
		url: '/yich/PhoneDeleteOrPut?operation='+operation+'&proId='+proid,
		dataType: 'json',
		success: function(res){
			 if(typeof (res.userId)!='undefined'){
	             func.fwh_authorize(res.userId);
	         }
			 var prompt = new promptFunc();
			 if(operation == 'del'&&res.result == 'deletesuccess'){
				 dropload_obj.opts.loadUpFn(dropload_obj);
			 }
			 if(operation == 'put'&&res.result == 'putsuccess'){
				 dropload_obj.opts.loadUpFn(dropload_obj);
				 prompt.init({
					type:"",
					text:"商品已上架！",
				 });
			 }
			 if(operation == 'out'&&res.result == 'outsuccess'){
				 dropload_obj.opts.loadUpFn(dropload_obj);
				 prompt.init({
					type:"",
					text:"商品已下架！",
				 });
			 }
		},
		error: function(res){
			
		}
	});
}
$("#tab").children("li").click(function(){
	$(this).addClass("active");
	$(this).siblings("li").removeClass("active");
	$(".goods").html('');

	// 监听 是否 新品排行：type=2，热销排行：type=1
	var tabType = parseInt($(this)[0].type);
	option = tabType==2?'PUT_AWAY':'WAIT_PUT_AWAY';
	/*ajax(option,1);*/
	/*func.localSetItem("localprotype" + supshopId, JSON.stringify(tabType));
	func.localSetItem("localpropage" + supshopId, JSON.stringify(1));*/
	
	dropload_obj.opts.loadUpFn(dropload_obj);
});
function ajax(option,pno){
	$.ajax({
		type: 'POST',
		url: '/yich/PhoneShopInvtoryServlet?pno='+pno+'&option='+option,
		dataType: 'json',
		success: function(res){
			 if(typeof (res.userId)!='undefined'){
	             func.fwh_authorize(res.userId);
	         }
			 if(res.list && res.list.length > 0){
				 $('.nodata').hide();
				 $('#content').show();
				 appendHtml(res);
			 }else{
				 $('#content').hide();
				 $('.nodata').show();
			 }		 
		},
		error: function(res){
			
		}
	})
}

var appendHtml = function(res){
	var strHtml = '';
	 if(res.list&&res.list.length>0){
		 for(var i=0; i<res.list.length; i++){
			 var jiage='';
			 if(res.list[i].fixedPrice*1>0){
				 jiage=(res.list[i].fixedPrice*1).toFixed(2);
			 }else{
				 jiage='0.00';
			 }
			 var jiage1=(jiage.split("."))[0]+'.';  //小数点前面的数字
			 var jiage2=(jiage.split("."))[1];   //小数点后面的数字
			 var yjdf = '';
			 if(res.list[i].type&&res.list[i].type==1){
				 yjdf = '<span class="piece">一件代发</span>';
			 }
			 var imgSrc = func.imgsize(res.list[i].src,'@200w_200h');
			 var edit = '';
			 if(res.list[i].releaseFrom&&res.list[i].releaseFrom==0){
				 edit = '<a class="click-btn edit" href="/yich/wapservice/dist/html/publishPage.html?proId='+res.list[i].proid+'">编辑商品</a>';
			 }else{
				 edit ='';
			 }
			 var shelf = '';
			 if(option == 'PUT_AWAY'){
				 shelf = '<input type="button" value="下架" class="click-btn offShelf"><a class="click-btn share" href="/yich/wapservice/dist/html/goodsManageSharePoster.html?where=gostore&proId='+res.list[i].proid+'">分享</a>';
			 }else{
				 shelf = '<input type="button" value="上架" class="click-btn shelf">';
			 }
			 strHtml+=[
			     '<div class="commodity">',
			     	'<div class="detail">',
			     		'<div class="picDiv">',
			     			'<a class="pic">',
			     				'<img src="'+imgSrc+'">',
			     			'</a>',
			     		'</div>',
			     		'<div class="details">',
			     			'<p class="title">'+res.list[i].proname+'</p>',
			     			'<p class="No">'+res.list[i].sellcode+'</p>',
			     			'<span class="RMB">￥</span><span class="money">'+jiage1+'</span><span class="decimal">'+jiage2+'</span>'+yjdf,
			     		'</div>',
			     	'</div>',
			     	'<div class="operation">',
			     		'<input type="button" value="删除" class="click-btn delete">'+shelf+edit,
			     		/*'<input type="button" value="下架" class="click-btn offShelf">',
			     		'<a class="click-btn share">分享</a>'+edit,*/
			     		'<input type="hidden" value="'+res.list[i].proid+'" class="pro_id"/>',
			     	'</div>',
			     '</div>', 
			 ].join('');
		 }
	 }
	 $('.goods').append(strHtml);
}