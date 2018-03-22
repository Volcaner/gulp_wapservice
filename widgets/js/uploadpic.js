/**
 * @date 2017/9/6
 * @author Volcaner
 * 
 * 支持单张图片上传，并预览显示
 * 传参：
 * 1. parentId 父div
 * 2. maxSize 图片最大大小，单位 Mb
 * 3. afterUploadCallback 添加图片成功后回调
 * 4. afterDelCallback 点击删除图片按钮后回调
 */

var UploadPic = function() {
	var self = this;
	self.parentId;
};

UploadPic.prototype.init = function(parentId, maxSize, afterUploadCallback, afterDelCallback) {
	self.parentId = parentId;
	var strHtml = '\
		<div class="picBox">\
			<input name="file" type="file" accept="image/*" />\
		</div>\
	';

	$("#" + self.parentId).append(strHtml);

	$(".picBox>input").on("change", function() {
		var file = $(".picBox>input")[0].files[0];

		// if size > maxSize 
		var size = file.size/(1024*1024);//单位MB
		if(size > maxSize) {
			alert('图片大小不能超过' + maxSize + 'MB');
			return;
		}

		var imgreader = new FileReader();
		imgreader.readAsDataURL(file);
		imgreader.onload = function() {
			var img = document.createElement("img");
			img.src = imgreader.result;

			img.onload = function() {
				if(img.width > img.height) {
					$("#" + self.parentId + ">.picBox").empty();
					$("#" + self.parentId + ">.picBox").append(img);
					$("#" + self.parentId + ">.picBox>img").addClass("uploadImgW");
					$("#" + self.parentId).append('<div class="delPic icon-close"></div>');
				}
				else {
					$("#" + self.parentId + ">.picBox").empty();
					$("#" + self.parentId + ">.picBox").append(img);
					$("#" + self.parentId + ">.picBox>img").addClass("uploadImgH");
					$("#" + self.parentId).append('<div class="delPic icon-close"></div>');
				}

				$("#" + self.parentId + ">.delPic").on("click", function() {
					afterDelCallback(file);
				});

				afterUploadCallback(file);
			};
		};
	});
};