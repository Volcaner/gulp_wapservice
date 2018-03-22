/**
 * @date 2017/9/7
 * @author Volcaner
 *
 * 支持弹出选项，并返回选项值
 * 参数：
 * 1. items 选项数组
 * 2. afterGetItemCallback 选择选项后回调
 */

var PopChoose = function() {
	var self = this;
};

PopChoose.prototype.init = function(items, afterGetItemCallback) {
	var strHtml = '<div id="popChoose" class="popChoose">\
		<div class="chooseBox">\
			<div class="chooseItem">\
				<ul></ul>\
			</div>\
			<div class="choosecCancel">\
				<p>取消</p>\
			</div>\
		</div>\
	</div>';

	// html overflow hidden
	htmlScrollPok();

	$("body").append(strHtml);

	// append
	if(items && items.length > 0) {
		$(".chooseItem").css({"border-bottom": "20px solid #757575"});
		items.forEach(function(item, index) {
			$(".chooseItem>ul").append('<li><p>' + item + '</p></li>');

			$(".chooseItem>ul>li").eq(index).on("click", function() {
				afterGetItemCallback(item);
			});
		});

		// style
		var chooseItemMaxH = parseFloat($(".chooseBox").css("height")) - parseFloat($(".choosecCancel").css("height"));
		$(".chooseItem").css({"max-height": (chooseItemMaxH)+"px"});
	}

	$(".choosecCancel").on("click", function() {
		closePop();
	});

	$("#popChoose").on("click", function(e) {
		if(e.target == e.currentTarget) {
			closePop();
		}
	});
};

PopChoose.prototype.close = function() {
	closePop();
};

function htmlScrollOk() {
	var htmlTop = parseFloat($('html').css("top"));
	$('html').css({overflow: "auto", position: "absolute", top: "0px"});
	$('body').scrollTop(Math.abs(htmlTop));
};

function htmlScrollPok() {
	var scrollTop = document.body.scrollTop;
	$('html').css({overflow: "hidden", position: "fixed", top: -scrollTop+"px"});
};

// close
function closePop() {
	$("#popChoose").remove();

	// html overflow hidden
	htmlScrollOk();
};