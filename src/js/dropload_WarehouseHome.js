var dropload_obj = null;
$(function(){
    // 页数
  //  var page = 0;
    // dropload
    dropload_obj=$('#content').dropload({
        bIsAutoLoad: true,
        scrollArea : window,
        domUp : {
            domClass   : 'dropload-up',
            domRefresh : '<div class="dropdownload-refresh"><span class="icon iconfont iconspan iconfontsize">&#xe693;</span><span class="lable">下拉刷新</span></div>',
            domUpdate  : '<div class="dropload-update"><span class="icon iconfont iconspan iconfontsize">&#xe693;</span><span class="lable">释放更新</span></div>',
            domLoad    : '<div class="dropdownload-load"><span class="loadingspan"><span class="loading"></span></span><span class="lable">加载中</span></div>'
        },
        domDown : {
            domClass   : 'dropload-down',
            domRefresh : '<div class="dropupload-refresh">上拉加载更多</div>',
            domLoad    : '<div class="dropupload-load">加载中</div>',
            domNoData  : '<div class="dropload-noData">货物已经展示完了</div>'
        },
        loadUpFn : function(me){
            $.ajax({
                type:"POST",
                url:"/yich/PhoneAllSellGoods",
                dataType:"json",
                data:{
                	 "supShopId":supShopId,
                     "page":1,
                     "option":option,
                     "type":type,
                     "key":key,
                },
                success: function(json){
                	func.reloading();
                	if(typeof (json.userId)!='undefined'){
                	    func.fwh_authorize(json.userId);
                	}
                    strdom(json,true);
                    // 重置页数，重新获取loadDownFn的数据
                    page = 1;
                    // 解锁loadDownFn里锁定的情况
                    me.noData(false);
                    // 每次数据加载完，必须重置
                    me.resetload();
                    me.unlock();
                },
                error: function(){
                    console.log('Ajax error!');
                }
            });	
        },
        loadDownFn : function(me){
            page++;
            // 拼接HTML
            $.ajax({
                type:"POST",
                url:"/yich/PhoneAllSellGoods",
                dataType:"json",
                data:{
                	 "supShopId":supShopId,
                     "page":page,
                     "option":option,
                     "type":type,
                     "key":key,
                },
                success: function(json){
                	if(typeof (json.userId)!='undefined'){
                	    func.fwh_authorize(json.userId);
                	}
                    var arrLen = json.list.length;
                   // console.log(arrLen);
                    if(arrLen > 0){
                        strdom(json);
                    // 如果没有数据
                    }else{
                        // 锁定    
                        me.lock();
                        // 无数据
                        me.noData();
                    }
                    me.resetload();
                   
                },
                error: function(){
                    console.log('Ajax error!');
                }
            });
        }
    });
});