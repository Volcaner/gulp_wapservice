var cat = window.cat || {}; 
cat.touchjs = { 
  left: 0, 
  top: 0, 
  scaleVal: 1,  //缩放 
  rotateVal: 0,  //旋转 
  curStatus: 0,  //记录当前手势的状态, 0:拖动, 1:缩放, 2:旋转 
  //初始化 
  init: function ($targetObj, callback) { 
    touch.on($targetObj, 'touchstart', function (ev) { 
      cat.touchjs.curStatus = 0;
      var _brothis = $targetObj.get(0).classList[0];
      var _this = $('.spm_touchImgBox').find('.'+_brothis).children('img');
      /*cat.touchjs.left = _this.get(0).offsetLeft;
      cat.touchjs.top = _this.get(0).offsetTop;*/
      cat.touchjs.left = _this.get(0).style.left?parseFloat(_this.get(0).style.left.split('px')[0]):0;
      cat.touchjs.top = _this.get(0).style.top?parseFloat(_this.get(0).style.top.split('px')[0]):0;
      cat.touchjs.scaleVal = _this.attr('initscale')?parseFloat(_this.attr('initscale')):1;
    }); 
    touch.on($targetObj, 'touchmove', function (ev) { 
    	ev.preventDefault();//阻止默认事件 
      }); 
    if (!window.localStorage.cat_touchjs_data) 
      callback(0, 0, 1, 0); 
    else { 
      var jsonObj = JSON.parse(window.localStorage.cat_touchjs_data); 
      cat.touchjs.left = parseFloat(jsonObj.left), cat.touchjs.top = parseFloat(jsonObj.top), cat.touchjs.scaleVal = parseFloat(jsonObj.scale), cat.touchjs.rotateVal = parseFloat(jsonObj.rotate); 
      callback(cat.touchjs.left, cat.touchjs.top, cat.touchjs.scaleVal, cat.touchjs.rotateVal); 
    } 
  }, 
  //拖动 
  drag: function ($targetObj, callback) { 
     touch.on($targetObj, 'dragstart', function (ev) { 
      var _brothis = $targetObj.get(0).classList[0];
      var _this = $('.spm_touchImgBox').find('.'+_brothis).children('img');
      /*cat.touchjs.left = _this.get(0).offsetLeft;
      cat.touchjs.top = _this.get(0).offsetTop;*/
      cat.touchjs.left = _this.get(0).style.left?parseFloat(_this.get(0).style.left.split('px')[0]):0;
      cat.touchjs.top = _this.get(0).style.top?parseFloat(_this.get(0).style.top.split('px')[0]):0;
      callback(cat.touchjs.left, cat.touchjs.top); 
    }); 

    touch.on($targetObj, 'drag', function (ev) { 
    	var _brothis = $targetObj.get(0).classList[0];
      var _this = $('.spm_touchImgBox').find('.'+_brothis).children('img');
      _this.css("left", cat.touchjs.left + ev.x).css("top", cat.touchjs.top + ev.y); 
    }); 

    touch.on($targetObj, 'dragend', function (ev) {  
      var fHeight = $targetObj.height();
      var fWidth = $targetObj.width();
      var _brothis = $targetObj.get(0).classList[0];
      var _this = $('.spm_touchImgBox').find('.'+_brothis).children('img');

      var cHeight = _this.height();
      var cWidth = _this.width();
      var initalWidth = cWidth/cat.touchjs.scaleVal;
      var initalHeight = cHeight/cat.touchjs.scaleVal;
      var _thisTop = _this.get(0).offsetTop - (initalHeight - _this.height())/2;  // +(cHeight-cHeight/cat.touchjs.scaleVal)/2
      var _thisLeft = _this.get(0).offsetLeft - (initalWidth - _this.width())/2;  // +(cWidth-cWidth/cat.touchjs.scaleVal)/2
      // var _thisTop = cat.touchjs.top;
      // var _thisLeft = cat.touchjs.left;
      var _thisScaleVal = _this.attr('initscale')?parseFloat(_this.attr('initscale')):1;
      if((_thisTop<0 && Math.abs(_thisTop)+(cHeight-cHeight/_thisScaleVal)/2>=(cHeight)) 
        || _thisTop-(cHeight-cHeight/_thisScaleVal)/2>fHeight
        || (_thisLeft<0 && Math.abs(_thisLeft)+(cWidth-cWidth/_thisScaleVal)/2>=(cWidth))
        || _thisLeft-(cWidth-cWidth/_thisScaleVal)/2>fWidth
      ){
        _this.get(0).style.left = (fWidth/2-cWidth/2) + "px";
        _this.get(0).style.top = (fHeight/2-cHeight/2) + "px";
      } 
    });  
  }, 
  //缩放 
  scale: function ($targetObj, callback) { 
    var initialScale = cat.touchjs.scaleVal || 1; 
    var currentScale; 

    touch.on($targetObj, 'pinch', function (ev) { 
      if (cat.touchjs.curStatus == 2) { 
        return; 
      } 
      var _brothis = $targetObj.get(0).classList[0];
      var _this = $('.spm_touchImgBox').find('.'+_brothis).children('img');
      
      var naturalWidth = _this[0].naturalWidth;
      var naturalHeight = _this[0].naturalHeight;

      cat.touchjs.curStatus = 1; 
      currentScale = ev.scale - 1; 
      initialScale = _this.attr('initscale')?parseFloat(_this.attr('initscale')):1;
      currentScale = initialScale + currentScale; 
      var distScale = currentScale - cat.touchjs.scaleVal;
      cat.touchjs.scaleVal = currentScale;
      // cat.touchjs.scaleVal = cat.touchjs.scaleVal > 1.5?1.5:cat.touchjs.scaleVal;
      
      cat.touchjs.left = _this.get(0).style.left?parseFloat(_this.get(0).style.left.split('px')[0]):0;
      cat.touchjs.top = _this.get(0).style.top?parseFloat(_this.get(0).style.top.split('px')[0]):0;

      var newLeft = cat.touchjs.left - (naturalWidth*distScale)/2;
      var newTop = cat.touchjs.top - (naturalHeight*distScale)/2;

      _this.css({"width": naturalWidth*cat.touchjs.scaleVal+"px", "height": naturalHeight*cat.touchjs.scaleVal+"px", "left": newLeft + "px", "top": newTop + "px"});

      // var transformStyle = 'rotate(' + cat.touchjs.rotateVal + 'deg)';
      // _this.css("transform", transformStyle).css("-webkit-transform", transformStyle); 

      callback(cat.touchjs.scaleVal); 
    }); 

    touch.on($targetObj, 'pinchend', function (ev) { 
      if (cat.touchjs.curStatus == 2) { 
        return; 
      } 
      var _brothis = $targetObj.get(0).classList[0];
      var _this = $('.spm_touchImgBox').find('.'+_brothis).children('img');
      initialScale = currentScale; 
      cat.touchjs.scaleVal = currentScale; 
      // cat.touchjs.scaleVal = cat.touchjs.scaleVal > 1.5?1.5:cat.touchjs.scaleVal;
      callback(cat.touchjs.scaleVal); 
      _this.attr('initscale',cat.touchjs.scaleVal);//保存当前scaleVal;
    }); 
  },
  /**
    // scale: function ($targetObj, callback) { 
    //   var initialScale = cat.touchjs.scaleVal || 1; 
    //   var currentScale; 

    //   touch.on($targetObj, 'pinch', function (ev) { 
    //     if (cat.touchjs.curStatus == 1) { 
    //       return; 
    //     } 
    //     var _brothis = $targetObj.get(0).classList[0];
    //     var _this = $('.spm_touchImgBox').find('.'+_brothis).children('img');
    //     cat.touchjs.curStatus = 2; 
    //     currentScale = ev.scale - 1; 
    //     currentScale = initialScale + currentScale; 
    //     cat.touchjs.scaleVal = currentScale;
    //     var transformStyle = 'scale(' + cat.touchjs.scaleVal + ') rotate(' + cat.touchjs.rotateVal + 'deg)';  scale(' + cat.touchjs.scaleVal + ') 
    //     _this.css("transform", transformStyle).css("-webkit-transform", transformStyle); 
    //     callback(cat.touchjs.scaleVal); 
    //   }); 

    //   touch.on($targetObj, 'pinchend', function (ev) { 
    //     if (cat.touchjs.curStatus == 1) { 
    //       return; 
    //     } 
    //     var _brothis = $targetObj.get(0).classList[0];
  	 //    var _this = $('.spm_touchImgBox').find('.'+_brothis).children('img');
    //     initialScale = currentScale; 
    //     cat.touchjs.scaleVal = currentScale; 
    //     callback(cat.touchjs.scaleVal); 
    //     _this.attr('initscale',cat.touchjs.scaleVal);//保存当前scaleVal;
    //   }); 
    // }, 
  **/
  //旋转 
  rotate: function ($targetObj, callback) { 
    var angle = cat.touchjs.rotateVal || 0; 
    touch.on($targetObj, 'rotate', function (ev) { 
     //  if (cat.touchjs.curStatus == 2) { 
     //    return; 
     //  } 
     //  var _brothis = $targetObj.get(0).classList[0];
	    // var _this = $('.spm_touchImgBox').find('.'+_brothis).children('img');
     //  cat.touchjs.curStatus = 1; 
     //  var totalAngle = angle + ev.rotation; 
     //  if (ev.fingerStatus === 'end') { 
     //    angle = angle + ev.rotation; 
     //  } 
     //  cat.touchjs.rotateVal = totalAngle; 
     //  var transformStyle = 'rotate(' + cat.touchjs.rotateVal + 'deg)'; 
     //  _this.css("transform", transformStyle).css("-webkit-transform", transformStyle); 

      // var naturalWidth = _this.width()/cat.touchjs.scaleVal;
      // var naturalHeight = _this.height()/cat.touchjs.scaleVal;
      // _this.css({"width": naturalWidth*cat.touchjs.scaleVal+"px", "height": naturalHeight*cat.touchjs.scaleVal+"px"});

      // _this.attr('data-rotate', cat.touchjs.rotateVal); 
      // callback(cat.touchjs.rotateVal); 
    }); 
  }
};
