function fwh_authorize(userId){
	if((typeof userId=='undefined') || (!userId)){
		  window.location.href= "/yich/PhoneClickWechatButton";
	  }
}
$(document).ready(function(){
	var purchaseorderCount = 0;
	if(window.localStorage){
		var szarr=[];
		for(var i=localStorage.length - 1 ; i >=0; i--){
			if(localStorage.key(i).indexOf('localobject_')!=-1&&localStorage.getItem(localStorage.key(i)).indexOf('supplierShop')!=-1){
				purchaseorderCount += JSON.parse(localStorage.getItem(localStorage.key(i))).length;
			}
		}
	}
	$('.PurchaseorderCount').text(purchaseorderCount);
	$.ajax({
		type: 'POST',
		url: '/yich/PhoneMerchantCenter',
		dataType: 'json',
		success: function(res){
			if(typeof (res.userId)!='undefined'){
			    fwh_authorize(res.userId);
			}
			if(res.user_data){
				if(res.user_data.map_five.business.name){
					$('.name').text(res.user_data.map_five.business.name);
				}
				if(res.user_data.Librarycollection){
					$('.LibrarycollectionCount').text(res.user_data.Librarycollection);
				}
				if(res.user_data.Attentionstorage){
					$('.Attentionstorage').text(res.user_data.Attentionstorage);
				}
				if(res.user_data.SC){
					$('.SCCount').text(res.user_data.SC);
				}
				if(res.user_data.map_one.nopay_count){
					$('.nopayCount').text(res.user_data.map_one.nopay_count);
				}
				if(res.user_data.map_one.nosend_count){
					$('.nosendCount').text(res.user_data.map_one.nosend_count);
				}
				if(res.user_data.map_one.has_send){
					$('.sendedCount').text(res.user_data.map_one.has_send);
				}
				if(res.user_data.map_one.returning){
					$('.returningCount').text(res.user_data.map_one.returning);
				}
				if(res.user_data.map_one.changing){
					$('.changingCount').text(res.user_data.map_one.changing);
				}
				if(res.user_data.map_five.business.head){
					$('.head').attr('src',res.user_data.map_five.business.head);
				}
			}
		},
		error: function(res){
			
		}
	});
});

//获取采购单数量
cgdcount();
function cgdcount(){
	var hqcaigoucont=0;
	var count=0;
	var c=0;
	if(window.localStorage){
		 for(localkey in window.localStorage) {
	          if(localkey.indexOf("localobject_") == 0) {
	        	  c += JSON.parse(window.localStorage[localkey]).length;
	          }
	        }
		 if(c>99){
				count=99+"+";
			}else{
				count=c;
			}
	var counthtml=document.getElementById("countcg");
	if(count*1>0){
		if(counthtml){
			counthtml.innerHTML=count;
			counthtml.style.display='block';
		}
	}else{
		if(counthtml){
			counthtml.style.display='none';
		}
		
	}
  }else{
	  alert("浏览暂不支持localStorage")
  }
};