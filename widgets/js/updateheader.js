/**
 * @date 2017/9/6
 * @author Volcaner
 * 
 * 支持头像上传：
 * 1. 选择图片 或 拍照
 * 2. 返回 base64 图片数据
 * 3. 传参： afterGetPicCallback
 */

var UpdateHeader = function() {
	var self = this;
	self.can;
	self.can2;
	self.cxt; 
	self.cxt2; 
};

UpdateHeader.prototype.init = function(afterGetPicCallback) {
	var strHtml = '\
		<div id="changeIcon" class="changeIcon">\
			<div class="updateHeadpic">\
				<div class="confirm clearfix">\
					<input class="cancelBtn_cls btn" id="cancelBtn" type="button" name="btn" value="取消">\
					<input class="postBtn_cls btn" id="postBtn" type="button" name="btn" value="确定">\
				</div>\
				<div class="canBox clearfix">\
					<canvas id="canvas1" class="canvas1"></canvas>\
					<canvas id="canvas2" class="canvas2"></canvas>\
				</div>\
				<div class="files">\
					<p>选择图片</p>\
					<input class="fileBtn_cls" accept="image/*" type="file" name="files" value="">\
				</div>\
			</div>\
		</div>\
	';
	$("body").append(strHtml);
 
 	// init canvas
	function initCan() {
		self.can = document.getElementById('canvas1');
		self.can2 = document.getElementById('canvas2');
		self.cxt = self.can.getContext("2d"); 
		self.cxt2 = self.can2.getContext("2d"); 
		var canvasW = self.can.width;
		var canvasH = self.can.height = canvasW;
		self.can2.width = 200; 
		self.can2.height = 200;

		self.can.addEventListener("touchmove", function(touche) {
			touche.preventDefault();
		});

		// clear
		self.cxt.clearRect(0, 0, canvasW, canvasW);
		self.cxt2.clearRect(0, 0, 200, 200);
	};

	// file change
	function fileChange() {
		var can = self.can;
		var can2 = self.can2;
		var cxt = self.cxt;
		var cxt2 = self.cxt2;
		var canvasW = self.can.width;
		var canvasH = self.can.height;
		var file = document.querySelector('input[type=file]');

		// img: width height & absolute: x y
		var imgDrawW;
		var imgDrawH;
		var imgDrawX;
		var imgDrawY;

		// abs
		var dis_abs = {};

		// get drawImage obj
		var imgByDr;

		// img: bis width > height =>  radio > 1 ?
		var bIsRadio = false;

		// bis double figer touch
		var bIsDouTouch = false;

		// scale record
		var lastDis;
		var nowDis;

		clearCanvas();

		if(file.files[0]){
			// if size > 2M ?
			var size = file.files[0].size/(1024*1024);//单位MB
			if(size > 10) {
				alert('图片大小不能超过10MB');
				return;
			}

			// main
			var imgreader = new FileReader();
			imgreader.readAsDataURL(file.files[0]);
			imgreader.onload = function(e) {
				// draw img to canvas
				var img = new Image();
				img.src = imgreader.result;
				img.onload = function(){

					// init img
					var imgW = img.width;
					var imgH = img.height;
					var ratio = parseFloat(imgW/imgH).toFixed(2);
					if(ratio <= 1) {
						bIsRadio = true;
						var imgX = canvasW*0.5 - canvasW*0.5;
						var imgY = canvasH*0.5 - canvasH/ratio*0.5;
						imgDrawW = canvasW;
						imgDrawH = canvasH/ratio;
						imgDrawX = imgX;
						imgDrawY = imgY;

						clearCanvas();
						cxt.drawImage(img, imgX, imgY, imgDrawW, imgDrawH);
					}
					else if(ratio > 1) {
						bIsRadio = false;
						var imgX = canvasW*0.5 - canvasW*ratio*0.5;
						var imgY = canvasH*0.5 - canvasH*0.5;
						imgDrawW = canvasW*ratio;
						imgDrawH = canvasH;
						imgDrawX = imgX;
						imgDrawY = imgY;

						clearCanvas();
						cxt.drawImage(img, imgX, imgY, imgDrawW, imgDrawH);
					}

					// touch 1: move
					var moveEvent = function(touche, img) {
						var touch1X = touche.targetTouches[0].clientX - can.offsetLeft;
						var touch1Y = touche.targetTouches[0].clientY - can.offsetTop;

						if(touch1X < imgDrawX){
							var x = touch1X + dis_abs.dis_x;
						}else{
							var x = touch1X - dis_abs.dis_x;
						}

						if(touch1Y < imgDrawY){
							var y = touch1Y + dis_abs.dis_Y;
						}else{
							var y = touch1Y - dis_abs.dis_Y;
						}
						
						// record the absolute x y of img
						imgDrawX = x;
						imgDrawY = y;

						clearCanvas();
						cxt.drawImage(img, x, y, imgDrawW, imgDrawH);
					};

					// touch 2: sacle
					var scaleEvent = function(touche, img) {
						// alert(touche.targetTouches[1].scale);
						var touch1X = touche.targetTouches[0].clientX;
						var touch1Y = touche.targetTouches[0].clientY;
						var touch2X = touche.targetTouches[1].clientX;
						var touch2Y = touche.targetTouches[1].clientY;
						var disX1_2 = touch1X - touch2X;
						var disY1_2 = touch1Y - touch2Y;
						if(isNaN(lastDis) || null == lastDis || undefined == lastDis){
							lastDis = Math.pow((disX1_2*disX1_2 + disY1_2*disY1_2), 0.5);
						}

						nowDis = Math.pow((disX1_2*disX1_2 + disY1_2*disY1_2), 0.5);
						var disRadio = nowDis/lastDis;
						lastDis = nowDis;

						if(disRadio > 1) {
							imgDrawW = imgDrawW * (1 + (disRadio - 1) * 0.5);
							imgDrawH = imgDrawH * (1 + (disRadio - 1) * 0.5);
						}else {
							imgDrawW = imgDrawW * (1 - (1 - disRadio) * 0.5);
							imgDrawH = imgDrawH * (1 - (1 - disRadio) * 0.5);
						}

						
						

						clearCanvas();
						cxt.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH);
					};

					can.addEventListener("touchmove", function(touche) {
						// alert(touche.targetTouches.length);
						if(1 == touche.targetTouches.length){
							if(!bIsDouTouch){
								moveEvent(touche, img);
							}
							
						}else if(2 == touche.targetTouches.length){
							bIsDouTouch = true;
							scaleEvent(touche, img);
						}
					}, false);

					can.addEventListener("touchstart", function(touche) {
						// abs the distance between touche and img
						var dis_x = Math.abs(touche.targetTouches[0].clientX - can.offsetLeft - imgDrawX);
						var dis_Y = Math.abs(touche.targetTouches[0].clientY - can.offsetTop - imgDrawY);
						dis_abs = {"dis_x": dis_x, "dis_Y": dis_Y};

						// clear lastDis when touch start
						lastDis = null;
					}, false);

					can.addEventListener("touchend", function(touche) {
						setTimeout(function(){
							bIsDouTouch = false;
						}, 500)
					}, false);
				};
			}
		}
	}

	// clearCanvas
	function clearCanvas() {
		var canvasW = self.can.width;
		var canvasH = self.can.height;
		self.cxt.clearRect(0, 0, canvasW, canvasH);
	}

	// post
	function postPic() {
		var can = self.can;
		var can2 = self.can2;
		var cxt = self.cxt;
		var cxt2 = self.cxt2;
		var canvasW = self.can.width;
		var canvasH = self.can.height;

		// get img data
		var dataCache = can.toDataURL("image/jpeg", 1);
		var cache4img = new Image();
		cache4img.src = dataCache;
		cache4img.onload = function() {
			// img result
			can2 = document.getElementById('canvas2');
			cxt2 = can2.getContext("2d"); 
			cxt2.drawImage(cache4img, 0, 0, 200, 200);
			imgData = can2.toDataURL("image/jpeg", 0.6);

			// 返回 base64 图片数据
			afterGetPicCallback(imgData);
		}
	};

	initCan();

	$(".cancelBtn_cls").on("click", function() {
		$("#changeIcon").remove();
	});

	$(".postBtn_cls").on("click", function() {
		postPic();
	});

	$(".fileBtn_cls").on("change", function() {
		fileChange();
	});
};

UpdateHeader.prototype.cancel = function() {
	$("#changeIcon").remove();
};