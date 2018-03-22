var flag="week";
var data='';
function getstyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr]
		}
		else{
			return getComputedStyle(obj,false)[attr]
			}
	}
wh();
function wh(){
	var myChart=document.getElementById("myChart");
	var myChart2=document.getElementById("myChart2");
	var wh={
			w:parseInt(parseFloat(getstyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(250)),
			h:parseInt(parseFloat(getstyle(document.getElementsByTagName('html')[0],"fontSize"))*hotcss.px2rem(250)),
	};
	myChart.width=wh.w;
	myChart.height=wh.h;
	myChart2.width=wh.w;
	myChart2.height=wh.h;
};
$(function(){
	$(".more").click(function(){
		if(!$(".listtype").hasClass("slidown")){
			$(".listtype").addClass("slidown");
			$(this).children("i").html("&#xe638;");
		}else{
			$(".listtype").removeClass("slidown");
			$(this).children("i").html("&#xe600;");
		}
	});
//数据
    $.ajax({
        type:"POST",
        url:"/yich/PhoneTraDataServlet",
        dataType:"json",
        data:{
        	 "option":'user',
        },
        success: function(json){
        if(json.count == 0){
        	$('.tub').hide();
        }
         data=json;
         dom(data);
        },
        error: function(){
            console.log('Ajax error!');
        }
    });	
})

function dom(data){
   var ddzje=0;//订单总金额
   var dds=0;//订单数
   var cgcs=0;//采购次数
   var ddjj=0;//订单均价
   var kdj=0;//客单价
   var ztkje=0;//总退款金额
   var ztks=0;//总退款数
   var ztkl=0;//总退款率
   var jtkje=0;//仅退款金额
   var jtkbs=0;//仅退款笔数
   var jtkl=0;//仅退款率
   var tkje=0;//退款金额
   var ths=0;//退货数
   var thl=0;//退货率
   var hhs=0;//换货数
   var hhl=0;//换货率
   var jfl=0;//纠纷率
  /* data.loglist=[
                 {
                     "logName":"邮政快递包裹5公斤内",
                     "logRate":0,
                     "logTime":139
                 },
                 {
                     "logName":"松溪汇通3公斤内",
                     "logRate":0,
                     "logTime":51
                 },
                 {
                     "logName":"EMS 0.5公斤内",
                     "logRate":0,
                     "logTime":23
                 },
                 {
                     "logName":"政和汇通3.01-4.8公斤",
                     "logRate":0,
                     "logTime":6
                 },
                 {
                     "logName":"松溪EMS 2公斤内",
                     "logRate":0,
                     "logTime":3
                 },
                 {
                     "logName":"其他",
                     "logRate":1,
                     "logTime":10
                 }
             ];
   data.plist=[
               {
                   "logRate":0,
                   "logTime":34,
                   "province":"广东省"
               },
               {
                   "logRate":0,
                   "logTime":23,
                   "province":"浙江省"
               },
               {
                   "logRate":0,
                   "logTime":16,
                   "province":"山东省"
               },
               {
                   "logRate":0,
                   "logTime":12,
                   "province":"江苏省"
               },
               {
                   "logRate":0,
                   "logTime":12,
                   "province":"福建省"
               },
               {
                   "logRate":1,
                   "logTime":135,
                   "province":"其他"
               }
           ];*/
   if(flag=="week"){
	   if(typeof data.traData!='undefined' && typeof data.traData.weekMoney!='undefined'){
		   ddzje=data.traData.weekMoney;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.weekTraNum!='undefined'){
		   dds=data.traData.weekTraNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.weekPayNum!='undefined'){
		   cgcs=data.traData.weekPayNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.weekMoney!='undefined' && typeof data.traData.weekTraNum!='undefined' && data.traData.weekTraNum*1>0){
		   ddjj=((data.traData.weekMoney)/(data.traData.weekTraNum)).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.weekMoney!='undefined' && typeof data.traData.weekPayNum!='undefined' && data.traData.weekPayNum*1>0){
		   kdj=((data.traData.weekMoney)/(data.traData.weekPayNum)).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.weekRetMoney!='undefined'){
		   ztkje=(data.traData.weekRetMoney).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.weekRetNum!='undefined'){
		   ztks=data.traData.weekRetNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.weekRetNum!='undefined' && typeof data.traData.weekTraNum!='undefined' && data.traData.weekTraNum*1>0){
		   ztkl=((data.traData.weekRetNum)/(data.traData.weekTraNum)*100).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.weekOnlyRetMoney!='undefined'){
		   jtkje=data.traData.weekOnlyRetMoney;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.weekRetGoodNum!='undefined'){
		   jtkbs=data.traData.weekOnlyRetNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.weekRetGoodNum!='undefined' && typeof data.traData.weekTraNum!='undefined' && data.traData.weekTraNum*1>0){
		   jtkl=((data.traData.weekOnlyRetNum)/(data.traData.weekTraNum)*100).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.weekRetGoodMoney!='undefined'){
		   tkje=data.traData.weekRetGoodMoney;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.weekRetGoodNum!='undefined'){
		   ths=data.traData.weekRetGoodNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.weekRetGoodNum!='undefined' && typeof data.traData.weekTraNum!='undefined' && data.traData.weekTraNum*1>0){
		   thl=((data.traData.weekRetGoodNum)/(data.traData.weekTraNum)*100).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.weekChangeNum!='undefined'){
		   hhs=data.traData.weekChangeNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.weekChangeNum!='undefined' && typeof data.traData.weekTraNum!='undefined' && data.traData.weekTraNum*1>0){
		   hhl=((data.traData.weekChangeNum)/(data.traData.weekTraNum)*100).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.weekArtNum!='undefined' && typeof data.traData.weekTraNum!='undefined' && data.traData.weekTraNum*1>0){
		   jfl=((data.traData.weekArtNum)/(data.traData.weekTraNum)*100).toFixed(2);
	   }
   }
   
   if(flag=="month"){
	   if(typeof data.traData!='undefined' && typeof data.traData.monthMoney!='undefined'){
		   ddzje=data.traData.monthMoney;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.monthTraNum!='undefined'){
		   dds=data.traData.monthTraNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.monthPayNum!='undefined'){
		   cgcs=data.traData.monthPayNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.monthMoney!='undefined' && typeof data.traData.monthTraNum!='undefined' && data.traData.monthTraNum*1>0){
		   ddjj=((data.traData.monthMoney)/(data.traData.monthTraNum)).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.monthMoney!='undefined' && typeof data.traData.monthPayNum!='undefined' && data.traData.monthPayNum*1>0){
		   kdj=((data.traData.monthMoney)/(data.traData.monthPayNum)).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.monthRetMoney!='undefined'){
		   ztkje=(data.traData.monthRetMoney).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.monthRetNum!='undefined'){
		   ztks=data.traData.monthRetNum;
	   }
	   
	   if(typeof data.traData!='undefined' && typeof data.traData.monthRetNum!='undefined' && typeof data.traData.monthTraNum!='undefined' && data.traData.monthTraNum*1>0){
		   ztkl=((data.traData.monthRetNum)/(data.traData.monthTraNum)*100).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.monthOnlyRetMoney!='undefined'){
		   jtkje=data.traData.monthOnlyRetMoney;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.monthRetGoodNum!='undefined'){
		   jtkbs=data.traData.monthOnlyRetNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.monthRetGoodNum!='undefined' && typeof data.traData.monthTraNum!='undefined' && data.traData.monthTraNum*1>0){
		   jtkl=((data.traData.monthOnlyRetNum)/(data.traData.monthTraNum)*100).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.monthRetGoodMoney!='undefined'){
		   tkje=data.traData.monthRetGoodMoney;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.monthRetGoodNum!='undefined'){
		   ths=data.traData.monthRetGoodNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.monthRetGoodNum!='undefined' && typeof data.traData.monthTraNum!='undefined' && data.traData.monthTraNum*1>0){
		   thl=((data.traData.monthRetGoodNum)/(data.traData.monthTraNum)*100).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.monthChangeNum!='undefined'){
		   hhs=data.traData.monthChangeNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.monthChangeNum!='undefined' && typeof data.traData.monthTraNum!='undefined' && data.traData.monthTraNum*1>0){
		   hhl=((data.traData.monthChangeNum)/(data.traData.monthTraNum)*100).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.monthArtNum!='undefined' && typeof data.traData.monthTraNum!='undefined' && data.traData.monthTraNum*1>0){
		   jfl=((data.traData.monthArtNum)/(data.traData.monthTraNum)*100).toFixed(2);
	   }
   }
   
   if(flag=="threemonth"){
	   if(typeof data.traData!='undefined' && typeof data.traData.threeMonthMoney!='undefined'){
		   ddzje=data.traData.threeMonthMoney;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.threeMonthTraNum!='undefined'){
		   dds=data.traData.threeMonthTraNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.threeMonthPayNum!='undefined'){
		   cgcs=data.traData.threeMonthPayNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.threeMonthMoney!='undefined' && typeof data.traData.threeMonthTraNum!='undefined' && data.traData.threeMonthTraNum*1>0){
		   ddjj=((data.traData.threeMonthMoney)/(data.traData.threeMonthTraNum)).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.threeMonthMoney!='undefined' && typeof data.traData.threeMonthPayNum!='undefined' && data.traData.threeMonthPayNum*1>0){
		   kdj=((data.traData.threeMonthMoney)/(data.traData.threeMonthPayNum)).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.threeMonthRetMoney!='undefined'){
		   ztkje=(data.traData.threeMonthRetMoney).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.threeMonthRetNum!='undefined'){
		   ztks=data.traData.threeMonthRetNum;
	   }
	   
	   if(typeof data.traData!='undefined' && typeof data.traData.threeMonthRetNum!='undefined' && typeof data.traData.threeMonthTraNum!='undefined' && data.traData.threeMonthTraNum*1>0){
		   ztkl=((data.traData.threeMonthRetNum)/(data.traData.threeMonthTraNum)*100).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.threeMonthOnlyRetMoney!='undefined'){
		   jtkje=data.traData.threeMonthOnlyRetMoney;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.threeMonthRetGoodNum!='undefined'){
		   jtkbs=data.traData.threeMonthOnlyRetNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.threeMonthRetGoodNum!='undefined' && typeof data.traData.threeMonthTraNum!='undefined' && data.traData.threeMonthTraNum*1>0){
		   jtkl=((data.traData.threeMonthOnlyRetNum)/(data.traData.threeMonthTraNum)*100).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.threeMonthRetGoodMoney!='undefined'){
		   tkje=data.traData.threeMonthRetGoodMoney;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.threeMonthRetGoodNum!='undefined'){
		   ths=data.traData.threeMonthRetGoodNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.threeMonthRetGoodNum!='undefined' && typeof data.traData.threeMonthTraNum!='undefined' && data.traData.threeMonthTraNum*1>0){
		   thl=((data.traData.threeMonthRetGoodNum)/(data.traData.threeMonthTraNum)*100).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.threeMonthChangeNum!='undefined'){
		   hhs=data.traData.threeMonthChangeNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.threeMonthChangeNum!='undefined' && typeof data.traData.threeMonthTraNum!='undefined' && data.traData.threeMonthTraNum*1>0){
		   hhl=((data.traData.threeMonthChangeNum)/(data.traData.threeMonthTraNum)*100).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.threeMonthArtNum!='undefined' && typeof data.traData.threeMonthTraNum!='undefined' && data.traData.threeMonthTraNum*1>0){
		   jfl=((data.traData.threeMonthArtNum)/(data.traData.threeMonthTraNum)*100).toFixed(2);
	   }
   }
   if(flag=="all"){
	   if(typeof data.traData!='undefined' && typeof data.traData.totalMoney!='undefined'){
		   ddzje=data.traData.totalMoney;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.traNum!='undefined'){
		   dds=data.traData.traNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.payNum!='undefined'){
		   cgcs=data.traData.payNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.totalMoney!='undefined' && typeof data.traData.traNum!='undefined' && data.traData.traNum*1>0){
		   ddjj=((data.traData.totalMoney)/(data.traData.traNum)).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.totalMoney!='undefined' && typeof data.traData.payNum!='undefined' && data.traData.payNum*1>0){
		   kdj=((data.traData.totalMoney)/(data.traData.payNum)).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.retMoney!='undefined'){
		   ztkje=(data.traData.retMoney).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.retNum!='undefined'){
		   ztks=data.traData.retNum;
	   }
	   
	   if(typeof data.traData!='undefined' && typeof data.traData.retNum!='undefined' && typeof data.traData.traNum!='undefined' && data.traData.traNum*1>0){
		   ztkl=((data.traData.retNum)/(data.traData.traNum)*100).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.onlyRetMoney!='undefined'){
		   jtkje=data.traData.onlyRetMoney;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.retGoodNum!='undefined'){
		   jtkbs=data.traData.onlyRetNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.retGoodNum!='undefined' && typeof data.traData.traNum!='undefined' && data.traData.traNum*1>0){
		   jtkl=((data.traData.onlyRetNum)/(data.traData.traNum)*100).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.retGoodMoney!='undefined'){
		   tkje=data.traData.retGoodMoney;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.retGoodNum!='undefined'){
		   ths=data.traData.retGoodNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.retGoodNum!='undefined' && typeof data.traData.traNum!='undefined' && data.traData.traNum*1>0){
		   thl=((data.traData.retGoodNum)/(data.traData.traNum)*100).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.changeNum!='undefined'){
		   hhs=data.traData.changeNum;
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.changeNum!='undefined' && typeof data.traData.traNum!='undefined' && data.traData.traNum*1>0){
		   hhl=((data.traData.changeNum)/(data.traData.traNum)*100).toFixed(2);
	   }
	   if(typeof data.traData!='undefined' && typeof data.traData.artNum!='undefined' && typeof data.traData.traNum!='undefined' && data.traData.traNum*1>0){
		   jfl=((data.traData.artNum)/(data.traData.traNum)*100).toFixed(2);
	   }
   }
   
   //订单总金额
   $(".ddje").text(ddzje);
   //订单数
   $(".dds").text(dds);
   //采购次数
   $(".cgcs").text(cgcs);
   //订单均价
   $(".ddjj").text(ddjj);
   //客单价
   $(".kdj").text(kdj);
   //总退款金额
   $(".ztkje").text(ztkje);
   //总退款数
   $(".ztks").text(ztks);
   //总退款率
   $(".ztkl").text(ztkl+'%');
   //仅退款金额
   $(".jtkje").text(jtkje);
   //仅退款笔数
   $(".jtkbs").text(jtkbs);
   //仅退款率
   $(".jtkl").text(jtkl+'%');
   //退款金额
   $(".tkje").text(tkje);
   //退货数
   $(".ths").text(ths);
   //退货率
   $(".thl").text(thl+'%');
   //换货数
   $(".hhs").text(hhs);
   //换货率
   $(".hhl").text(hhl+'%');
   //纠纷率
   $(".jfl").text(jfl+'%');
  //近30天物流分析
   var fhbgs=0;//发货包裹数
   var wlgss=0;//物流公司数
   var shdztj='';//收货地址统计
   var fhsc=0;//发货时长
   var qssc=0;//签收时长
   if(typeof data.count!='undefined'){
	   fhbgs=data.count;
   }
   if(typeof data.logNum!='undefined'){
	   wlgss=data.logNum;
   }
   if(typeof data.traadd!='undefined'){
	   shdztj=data.traadd;
   }
   if(typeof data.deliverTime!='undefined'){
	   fhsc=data.deliverTime;
   }
   if(typeof data.completedTime!='undefined'){
	   qssc=data.completedTime;
   }
   if(typeof data.traadd!='undefined'){
	   shdztj=data.traadd;
   }
   $(".fhbgs").text(fhbgs);
   $(".wlgss").text(wlgss);
   $(".fhsc").text(fhsc);
   $(".qssc").text(qssc);
   var strarr=shdztj.split("省");
   var shi=strarr[1].split("市");
   $(".sheng").text(strarr[0]);
   $(".shi").text(shi[0]);
   var ys=['#bb55cc','#db64ef','#4aa5ff','#3dd690','#fec006','#ee4488'];
   //快递图表
   if(typeof data.loglist!='undefined' && data.loglist.length>0){
	   var l=data.loglist.length;
	   var str='';
	   var zkdcs=0;
	   for(var j=0;j<l;j++){
		   zkdcs+=(data.loglist)[j].logTime*1;
	   }
	   var d=[];
	   for(var i=0;i<l;i++){
		   var bl=0;
		   if(zkdcs>0){
		   bl=(((data.loglist)[i].logTime*1)/zkdcs*100).toFixed(2);
		   }
		   str+=[
				'<li>',
				'<i class="itype" style="background:'+ys[i]+'"></i>',
				'<span class="s1 kdname">'+(data.loglist)[i].logName+'</span>',
				'<span class="s2">'+(data.loglist)[i].logTime+'次</span>',
				'<span class="s3">占比'+bl+'%</span>',
				'</li>',
		         ].join('');
		   var obj={};
		   obj['value']=(data.loglist)[i].logTime;
		   obj['color']=ys[i];
		   d.push(obj);
	   }
	  $(".kdlist").html(str);
	var ctx = document.getElementById("myChart").getContext("2d");
    var myNewChart = new Chart(ctx).Doughnut(d);
   }
   //地区图表
   if(typeof data.plist!='undefined' && data.plist.length>0){
	   console.log(data.plist);
	   var pl=data.plist.length;
	   var plstr='';
	   var plzkdcs=0;
	   for(var p=0;p<pl;p++){
		   plzkdcs+=(data.plist)[p].logTime*1;
	   }
	   
	   var dd=[];
	   for(var k=0;k<pl;k++){
		   var plbl=0;
		   if(plzkdcs>0){
		   plbl=((data.plist)[k].logTime*1/plzkdcs*100);
		   }
		   plstr+=[
					'<li>',
					'<i class="itype" style="background:'+ys[k]+'"></i>',
					'<span class="s1">'+(data.plist)[k].province+'</span>',
					'<span class="s2">'+(data.plist)[k].logTime+'次</span>',
					'<span class="s3">占比'+plbl+'%</span>',
					'</li>',
			         ].join('');
		   var obj={};
		   obj['value']=(data.plist)[k].logTime;
		   obj['color']=ys[k];
		   dd.push(obj);
	   }
	 $(".dq").html(plstr);  
	 var ctx = document.getElementById("myChart2").getContext("2d");
     var myNewChart = new Chart(ctx).Doughnut(dd);
   }
}
$(".openclose,.yingying").click(function(){
	$(".yingying,.opendiv").css("display","none");
	_htmlScrollOk();
});
$(".jysjright").click(function(){
	$(".yingying,.opendiv").css("display","block");
	_htmlScrollPok();
});
$(".listselect").children("li").click(function(){
	flag=$(this).attr("type");
	$(".tubmychart").html('<canvas id="myChart" class="myChart" width="370" height="370"></canvas>');
	$(".tubmychart2").html('<canvas id="myChart2" class="myChart" width="370" height="370"></canvas>');
	wh();
	dom(data);
	$(".yingying,.opendiv").css("display","none");
	_htmlScrollOk();
	var text=$(this).text();
	$(".selectwb").text(text);
});
function fun_date(str,aa){
    var date1 = new Date();
    var time1=date1.getFullYear()+"-"+tozero(date1.getMonth()+1)+"-"+tozero(date1.getDate());//time1表示当前时间
    var date2 = new Date(date1);
    date2.setDate(date1.getDate()+aa);
    var time2 = date2.getFullYear()+"-"+tozero(+date2.getMonth()+1)+"-"+tozero(date2.getDate());
    return (str+"("+time1+"-"+time2+")");
}
$(".qi,.selectwb").text(fun_date('近7日累计',-7))//7天前的日期
$(".sanshi").text(fun_date('近30日累计',-30))//30天前的日期
$(".jiushi").text(fun_date('近90日累计',-90))//90天前的日期
 function tozero(t){
	 return (t*1<10)?'0'+t:t;
 }