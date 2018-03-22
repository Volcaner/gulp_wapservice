/**
 * @date 2017/9/6
 * @author Volcaner
 * 
 * 确定/取消 弹出框，支持 tips
 * 传参： 
 * 1. parentId 父div
 * 2. tips 提示框内容
 * 3. callback 点击确定回调
 */

var PopConfirm = function() {
	var self = this;
	self.parentId;
	self.tips;
};

PopConfirm.prototype.init = function(parentId, tips, callback) {
	self.parentId = parentId;
	self.tips = tips;
	var strHtml = '\
		<div class="pop">\
			<div class="popBox">\
				<div class="tips">' + self.tips + '</div>\
				<div class="btns">\
					<input class="cancelBtn" type="button" name="cancel" value="取消" />\
					<input class="confirmBtn" type="button" name="comfirm" value="确定" />\
				</div>\
			</div>\
		</div>\
	';
	$("#" + self.parentId).append(strHtml);

	$(".cancelBtn").click(function() {
		$(".pop").remove();
	});

	$(".confirmBtn").click(function() {
		callback();
		$(".pop").remove();
	});
};