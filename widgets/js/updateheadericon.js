/**
 * 
 */

var UpdateHeaderIcon = function() {
	var self = this;
	self.can;
	self.can2;
	self.cxt; 
	self.cxt2; 
};

UpdateHeaderIcon.prototype.init = function(obj, callback) {
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
		var file = obj.file;

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

		// touchList
		var touchList = [];

		clearCanvas();

		if(file){
			// if size > 2M ?
			var size = file.size/(1024*1024);//单位MB
			if(size > 10) {
				alert('图片大小不能超过10MB');
				return;
			}

			// main
			var imgreader = new FileReader();
			imgreader.readAsDataURL(file);
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
							var x = (touch1X + dis_abs.dis_x);
						}else{
							var x = (touch1X - dis_abs.dis_x);
						}

						if(x >= can.offsetLeft) {
							x = can.offsetLeft;
						}
						if(x + imgDrawW <= can.offsetLeft + canvasW) {
							x = can.offsetLeft + canvasW - imgDrawW;
						}

						if(touch1Y < imgDrawY){
							var y = (touch1Y + dis_abs.dis_Y);
						}else{
							var y = (touch1Y - dis_abs.dis_Y);
						}

						if(y >= can.offsetTop) {
							y = can.offsetTop;
						}
						if(y + imgDrawH <= can.offsetTop + canvasH) {
							y = can.offsetTop + canvasH - imgDrawH;
						}
						
						// record the absolute x y of img
						imgDrawX = x;
						imgDrawY = y;

						// console.log(x + "___________" + y);

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
						// touchList
						if(touchList.length < 2) {
							touchList.push(touche.targetTouches[0]);
						}

						// abs the distance between touche and img
						var dis_x = Math.abs(touche.targetTouches[0].clientX - can.offsetLeft - imgDrawX);
						var dis_Y = Math.abs(touche.targetTouches[0].clientY - can.offsetTop - imgDrawY);
						dis_abs = {"dis_x": dis_x, "dis_Y": dis_Y};

						// console.log(dis_abs);

						// clear lastDis when touch start
						lastDis = null;
					}, false);

					can.addEventListener("touchend", function(touche) {
						// ratio
						var ratio = parseFloat(imgDrawW/imgDrawH).toFixed(2);
						
						// touchList
						if(touchList.length == 1) {
							// moveend
								
						}
						else if(touchList.length == 2) {
							// scale
							 
							setTimeout(function() {
								// b. 当图片左边或上边距离大于canvas，or右边或下边距离小于canvas
								var canL = self.can.getBoundingClientRect().left;
								var canT = self.can.getBoundingClientRect().top;
								if(imgDrawX > canL) {
									var speedMove1 = (imgDrawX-canL)/5;
									var moveSetInter1 = setInterval(function() {
										imgDrawX -= speedMove1;

										clearCanvas();
										cxt.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH);

										if(imgDrawX <= canL) {
											imgDrawX = canL;

											clearCanvas();
											cxt.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH);

											clearInterval(moveSetInter1);
										}
									}, 10);
								}

								if(imgDrawY > canT) {
									var speedMove2 = (imgDrawY-canT)/5;
									var moveSetInter2 = setInterval(function() {
										imgDrawY -= speedMove2;

										clearCanvas();
										cxt.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH);

										if(imgDrawY <= canT) {
											imgDrawY = canT;

											clearCanvas();
											cxt.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH);

											clearInterval(moveSetInter2);
										}
									}, 10);
								}

								if(imgDrawX + imgDrawW < canL + canvasW) {
									var speedMove3 = (canL + canvasW - imgDrawX - imgDrawW)/5;
									var moveSetInter3 = setInterval(function() {
										imgDrawX += speedMove3;

										clearCanvas();
										cxt.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH);

										if(imgDrawX + imgDrawW >= canL + canvasW) {
											imgDrawX = canL + canvasW - imgDrawW;

											clearCanvas();
											cxt.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH);

											clearInterval(moveSetInter3);
										}
									}, 10);
								}

								if(imgDrawY + imgDrawH < canT + canvasH) {
									var speedMove4 = (canT + canvasH - imgDrawY - imgDrawH)/5;
									var moveSetInter4 = setInterval(function() {
										imgDrawY += speedMove4;

										clearCanvas();
										cxt.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH);

										if(imgDrawY + imgDrawH >= canT + canvasH) {
											imgDrawY = canT + canvasH - imgDrawH;

											clearCanvas();
											cxt.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH);

											clearInterval(moveSetInter4);
										}
									}, 10);
								}
							}, 50);
						}
						else {
							// do nothing
						}

						// a. 当图片宽或高小于canvas   imgDrawW < canvasW || imgDrawH < canvasH
						if(imgDrawW > imgDrawH) {
							if(imgDrawH < canvasH) {
								var speedScale = (canvasH-imgDrawH)/5;
								var scaleSetInter = setInterval(function() {
									imgDrawH += speedScale;
									imgDrawW = imgDrawH*ratio;

									clearCanvas();
									cxt.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH);

									if(imgDrawH >= canvasH) {
										imgDrawH = canvasH;
										imgDrawW = imgDrawH*ratio;

										clearCanvas();
										cxt.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH);

										clearInterval(scaleSetInter);
									}
								}, 10);
							}
						}
						else {
							if(imgDrawW < canvasW) {
								var speedScale = (canvasW-imgDrawW)/5;
								var scaleSetInter = setInterval(function() {
									imgDrawW += speedScale;
									imgDrawH = imgDrawW/ratio;

									clearCanvas();
									cxt.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH);

									if(imgDrawW >= canvasW) {
										imgDrawW = canvasW;
										imgDrawH = imgDrawW/ratio;

										clearCanvas();
										cxt.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH);

										clearInterval(scaleSetInter);
									}
								}, 10);
							}
						}

						// touchList
						touchList.forEach(function(item, index) {
							if(touche.changedTouches[0].identifier == item.identifier) {
								touchList.splice(index, 1);

							}
						}); 

						// abs the distance between touche and img
						if(touche.targetTouches[0]) {
							var dis_x = Math.abs(touche.targetTouches[0].clientX - can.offsetLeft - imgDrawX);
							var dis_Y = Math.abs(touche.targetTouches[0].clientY - can.offsetTop - imgDrawY);
							dis_abs = {"dis_x": dis_x, "dis_Y": dis_Y};
						}
						
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
			callback(imgData);
		}
	};

	initCan();

	fileChange();

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

UpdateHeaderIcon.prototype.close = function() {
	$("#changeIcon").remove();
};