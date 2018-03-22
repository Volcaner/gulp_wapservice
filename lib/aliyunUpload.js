(function($) {
	$.AliyunUpload = function() {
		var self = this;
		//var client;

		// options;
		this.options = undefined;

		self.init = function(options) {
			// aliyun
			// var re='oss-cn-hangzhou';
			// var KeyId='LTAIuio3BmR3xlxV';
			// var KeySecret='SaNNLqkclS0UbU0HzqtR9m0r8tyx47';
			// var bu='ngsimage';
		/*	client = new OSS.Wrapper({
			    region: options.region,
			    accessKeyId: options.accessKeyId,
			    accessKeySecret: options.accessKeySecret,
			    bucket: options.bucket,
			});

			self.options = options;*/
		}

		var _showTime = function() {
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

		/**
		 * [upload 上传单张图片]
		 * @param  {[type]}   fileFolder [description]
		 * @param  {[type]}   file       [description]
		 * @param  {Function} callback   [description]
		 * @return {[type]}              [description]
		 */
		self.upload = function(fileFolder, file, callback, progress) {
		    console.log(fileFolder);
		    console.log(file.name);
		    var newname = stripscript(file.name);

		    var rs = '';
		    for (var i = 0; i < newname.length; i++) {
		        rs = rs + newname.substr(i, 1).replace(' ', '');
		    }
		    var __src = fileFolder + _showTime() + "_" + rs;
		    console.log(client);
		    client.multipartUpload(__src, file, {
		        progress: function*(val) {
		            if (progress) {
		                progress(val);
		            }
		        }
		    }).then(function(res) {
		        var imgurl = "http://ngsimage.oss-cn-hangzhou.aliyuncs.com/" + __src;
		        callback({
		            url: imgurl,
		            name: rs,
		        });
		    }).catch(function(err) {
		        console.log(err);
		        reInitOss();
		    });
		};

		var stripscript = function(s) { 
			var pattern = new RegExp("[`~!@#$^&*()=|{}':%;',\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]") 
			var rs = ""; 
			for (var i = 0; i < s.length; i++) { 
				rs = rs+s.substr(i, 1).replace(pattern, ''); 
			} 
			return rs;
		};

		/**
		 * [createList 创建文件夹（虚拟）]
		 * @param  {[type]}   fileFolder [description]
		 * @param  {Function} callback   [description]
		 * @return {[type]}              [description]
		 */
		self.createList = function(fileFolder, callback) {
			client.put(fileFolder + "/", new OSS.Buffer(""))
				.then(function(object) {
					callback(object);
				}).catch(function(error) {
					console.log(error);
					 reInitOss();
				});  // new Buffer()
		};

		/**
		 * [getList 获取 文件夹下 所有文件]
		 * @param  {[type]}   fileFolder [description]
		 * @param  {Function} callback   [description]
		 * @return {[type]}              [description]
		 */
		self.getList = function(fileFolder, callback) {
			client.list({
				prefix: fileFolder,
   				delimiter: '/'
			}).then(function(res) {
				var arrObj = [];
				if(res.objects) {
					res.objects.forEach(function(item, index) {
						arrObj.push((item.url));
					});
				}
				callback(arrObj);
			}).catch(function(error) {
				console.log(error);
				 reInitOss();
			});
		};
		self.getList2 = function(fileFolder, callback) {
			client.list(fileFolder).then(function(res) {
				var arrObj = [];
				if(res.objects) {
					res.objects.forEach(function(item, index) {
						arrObj.push((item.url));
					});
				}
				callback(arrObj);
			}).catch(function(error) {
				console.log(error);
				 reInitOss();
			});
		};

		/**
		 * [delete 删除单个文件]
		 * @param  {[type]}   fileName [description]
		 * @param  {Function} callback [description]
		 * @return {[type]}            [description]
		 */
		self.delete = function(fileName, callback) {
			client.delete(fileName, {quiet: false})
				.then(function(object) {
					callback(object);
				}).catch(function(error) {
					console.log(error);
					 reInitOss();
				});
		};

		/**
		 * [deleteMulti 删除多个文件数组]
		 * @param  {[type]} arrFileNames [description]
		 * @return {[type]}              [description]
		 */
		self.deleteMulti = function(arrFileNames, callback) {
			client.deleteMulti(arrFileNames)
				.then(function(object) {
					callback(object);
				}).catch(function(error) {
					console.log(error);
					 reInitOss();
				});
		};
	};
})(Zepto);