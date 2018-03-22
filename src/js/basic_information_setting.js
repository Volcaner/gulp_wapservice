$(document).ready(function(){
	var prompt = new promptFunc();
	$.ajax({
		type: 'POST',
		url: '/yich/PhoneUserBasicInforServlet',
		dataType: 'json',
		success: function(res){
			if(typeof (res.userId)!='undefined'){
			    func.fwh_authorize(res.userId);
			}
			if(res.business){
				if(res.business.head){
					$('.headPortrait').attr('src',res.business.head);
				}
				if(res.business.name){
					$('.name').text(res.business.username);
				}
				if(res.business.username){
					$('.nameInput').val(res.business.name);
				}
				if(res.business.gender){
					$('.sex').text(res.business.gender);
				}else{
					$('.sex').text('请选择');
				}
				if(res.business.birthday){
					var datesArr =  res.business.birthday.split(':');
					if(datesArr[1].length == 1){
						datesArr[1] = '0' + datesArr[1];
					}
					if(datesArr[2].length == 1){
						datesArr[2] = '0' + datesArr[2];
					}
					$('.dates').text(datesArr[0]+'年'+datesArr[1]+'月'+datesArr[2]+'日');
				}else{
					$('.dates').text('请选择');
				}
				if(res.business.qq){
					$('.QQInput').val(res.business.qq);
				}
				if(res.business.address){
					var addressArr = res.business.address.split(':');
					$('.addressInput').val(addressArr[0]+' '+addressArr[1]+' '+addressArr[2]);
					if(addressArr[3]){
						$('.streetInput').val(addressArr[3]);
					}
				}else{
					$('.addressInput').val('请选择');
				}
			}
		},
		error: function(res){
			
		}
	});
	//日期插件
	var calendar = new datePicker();
	calendar.init({
		'trigger': '.birthday', /*按钮选择器，用于触发弹出插件*/
		'type': 'date',/*模式：date日期;*/
		'minDate':'1900-1-1',/*最小日期*/
		'maxDate':'2100-12-31',/*最大日期*/
		'onSubmit':function(){/*确认时触发事件*/
			var theSelectData=calendar.value;
			var dataArr = calendar.value.split('-');
			$('.dates').text(dataArr[0]+'年'+dataArr[1]+'月'+dataArr[2]+'日');
		},
		'onClose':function(){/*取消时触发事件*/
		}
	});
	//城市插件
	var area1 = new LArea();
	area1.init({
	    'trigger': '#address', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
	    'cityName': '#cityname',
	    'valueTo': '#value1', //选择完毕后id属性输出到该位置
	    'keys': {
	        id: 'id',
	        name: 'name'
	    }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
	    'type': 1, //数据源类型
	    'data': LAreaData //数据源
	});
	area1.value=[0,0,0];//控制初始位置，注意：该方法并不会影响到input的value
	$('.sexChoose').click(function(){
        var popChooseObj = new PopChoose();
        var items = [
        	'男',
        	'女',
        	'保密',
        ];
        popChooseObj.init(items, function(item) {
        	$('.sex').text(item);
        	$("#popChoose").remove();
        });
	});
	$('.save').click(function(){
		var year = '';
		var month = '';
		var day = '';
		var province = '';
		var city = '';
		var area = '';
		if($('.dates').text()){
			year = $('.dates').text().split('年')[0];
			month = $('.dates').text().split('年')[1].split('月')[0];
			day = $('.dates').text().split('年')[1].split('月')[1].split('日')[0];
		}
		if($('.addressInput').val()){
			province = $('.addressInput').val().split(' ')[0];
			city = $('.addressInput').val().split(' ')[1];
			area = $('.addressInput').val().split(' ')[2];
		}
		$.ajax({
			type: 'POST',
			url: '/yich/PhoneUserBasicInforModifyServlet',
			dataType: 'json',
			data: {option:'info',name:$('.nameInput').val(),gender:$('.sex').text(),YYYY:year,MM:month,DD:day,qq:$('.QQInput').val(),
				   province:province,city:city,area:area,street:$('.streetInput').val()},
			success: function(res){
				if(typeof (res.userId)!='undefined'){
				    func.fwh_authorize(res.userId);
				}
				prompt.init({
					type:"",
					text:"保存成功",
				});
				setTimeout(function(){
					window.location.replace('/yich/wapservice/dist/html/business_center_setting.html');
				},1000);
			},
			error: function(res){
				prompt.init({
					type:"",
					text:"保存失败",
				});
			}
		});
	});
	$("input[type=file]").on("change", function(e) {
		showUpdateHeader(e);
	});
	function showUpdateHeader(e) {
		var updateHeaderIconObj = new UpdateHeaderIcon();
		var obj = {
			file: e.currentTarget.files[0],
		};
		var name = e.currentTarget.files[0].name.split('.')[0];
		updateHeaderIconObj.init(obj, function(imageData) {
			console.log(imageData);

			// base64 to file
			var arr = imageData.split(',');
			var type = arr[0].match(/:(.*?);/)[1];
			var bstr = window.atob(arr[1]);   
			var fileExt = type.split('/')[1];
			var n = bstr.length;
			var u8arr = new Uint8Array(n);
			while(n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			var fileResult = new File([u8arr],name+"."+fileExt,{type:type});

			// aliyun
			var re='oss-cn-hangzhou';
			var KeyId='LTAIuio3BmR3xlxV';
			var KeySecret='SaNNLqkclS0UbU0HzqtR9m0r8tyx47';
			var bu='ngsimage';
			var client = new OSS.Wrapper({
			    region: re,
			    accessKeyId: KeyId,
			    accessKeySecret: KeySecret,
			    bucket: bu
			});

			client.multipartUpload(showTime()+fileResult.name, fileResult).then(function (result) {
				var imgurl = result.url;
				$.ajax({
					type: 'POST',
					url: '/yich/PhoneUserBasicInforModifyServlet',
					dataType: 'json',
					data: {option:'head',head:imgurl},
					success: function(res){
						if(typeof (res.userId)!='undefined'){
						    func.fwh_authorize(res.userId);
						}
						$('.headPortrait').attr('src',imgurl);
					},
					error: function(res){
					
					}
				});
				updateHeaderIconObj.close();
			}).catch(function (err) {
				console.log(err);
			});
		});
	};

	function showTime(){
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		var str=(year+''+month+''+day+''+hour+''+minute+''+second);
		return str;
	};
})