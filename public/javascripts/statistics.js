$(document).ready(function() {

	LineChart(['LogMod','device'],'hour',drawDeviceLine);
	LineChart(['LogMod','browser'],'hour',drawBrowserLine);
	LineChart(['LogMod','Login','Auth'],'hour',drawLoginsourceLine);
	//LineChart(['Signaling','Calling'],'hours',drawSignalingLine);
	//LineChart(['Signaling','Calling'],'hours',drawSignalingAverageLine);
	
	$('.checkbox').on('change',function(e){
        var timeZone = $('#'+$(this).parents('.checkboxArea').attr('id')+' .timezone').find('.active').attr('value');
		switch($(this).parents('.checkboxArea').attr('id') ){
			case 'deviceCheckbox':
				LineChart(['LogMod','device'],timeZone,drawDeviceLine);
				break;
			case 'browserCheckbox':
				LineChart(['LogMod','browser'],timeZone,drawBrowserLine);
				break;
			case 'loginCheckbox':
				LineChart(['LogMod','Login','Auth'],timeZone,drawLoginsourceLine);
				break;
		}

	});

	$('.timezone').on('click','.btn',function(e){
		$(this).parents('.timezone').find('.active').removeClass('active');
		$(this).addClass('active');
        var timeZone = $(e.currentTarget).attr('value');
        // console.log('timeZone',timeZone);
		switch($(this).parents('.checkboxArea').attr('id') ){
			case 'deviceCheckbox':
				LineChart(['LogMod','device'],timeZone,drawDeviceLine);
				break;
			case 'browserCheckbox':
				LineChart(['LogMod','browser'],timeZone,drawBrowserLine);
				break;
			case 'loginCheckbox':
				LineChart(['LogMod','Login','Auth'],timeZone,drawLoginsourceLine);
				break;
			//case 'signalingCheckbox':
			//	LineChart(['Signaling','Calling'],timeZone,drawSignalingLine);
			//	break;
			//case 'averageCheckbox':
			//	LineChart(['Signaling','Calling'],timeZone,drawSignalingAverageLine);
			//	break;
		}
	});
    function LineChart(type,time,callback){
        
        $.ajax({
            type: 'GET',
            url: '/admin/statistics?type='+type+'&time='+time,
            success: function(results) {
                if(!results){
                    // console.log(results);
                    return;
                }else{
                    // console.log(results);
                    switch(results.type){
                        case 'device':
                            drawDeviceLine(results);
                        break;
                        case 'browser':
                            drawBrowserLine(results);
                        break;
                        case 'Login':
                            drawLoginsourceLine(results);
                        break;
                        //case 'Calling':
                        //    drawSignalingLine(results);
                        //break;
                        //case 'Calling':
                        //    drawSignalingAverageLine(results);
                        //break;
                    }
                }
            }
        });
    }
});

var D_flag=''; // Device_flag
var B_flag=''; // Browser_flag
var L_flag=''; // Login_flag

var  drawDeviceLine = function (result){
	var ctx = $("#deviceLine").get(0).getContext("2d");
	var phoneDatasets , tabletDatasets , notebookDatasets ,
				pcDatasets ,phoneData,tabletData,notebookData,pcData ;
	var timeZone = $('#device .timezone').find('.active').attr('value');

	labels = gettimeZone(timeZone,result.timestamp);
    
    phoneData = result.data.phone?result.data.phone:[];
    tabletData =  result.data.tablet?result.data.tablet:[];
	notebookData =  result.data.notebook?result.data.notebook:[];
	pcData =  result.data.desktop?result.data.desktop:[];

	
	var D_array = [];
	// if timeZone change initial all type
	if(D_flag!==timeZone){
		$('#deviceCheckbox .checkbox').each(function(e,item){
			var val=$(item).find("input").val();
			$('#deviceCheckbox .checkbox').find("input[value="+val+"]").prop('disabled',false);
			$('#deviceCheckbox .checkbox').find("input[value="+val+"]").prop('checked',true);
		});
	}
	

	// if no Data disable button
	if(!phoneData.length){
		$('#deviceCheckbox .checkbox').find("input[value='phoneDatasets']").prop('checked',false);
		$('#deviceCheckbox .checkbox').find("input[value='phoneDatasets']").prop('disabled',true);
	} else if ($('#deviceCheckbox .checkbox').find("input[value='phoneDatasets']").prop("checked")) {
		D_array=D_array.concat(phoneData);
	}

	if(!tabletData.length){
		$('#deviceCheckbox .checkbox').find("input[value='tabletDatasets']").prop('checked',false);
		$('#deviceCheckbox .checkbox').find("input[value='tabletDatasets']").prop('disabled',true);
	} else if ($('#deviceCheckbox .checkbox').find("input[value='tabletDatasets']").prop("checked")){
		D_array=D_array.concat(tableData);
	}

	if(!notebookData.length){
		$('#deviceCheckbox .checkbox').find("input[value='notebookDatasets']").prop('checked',false);
		$('#deviceCheckbox .checkbox').find("input[value='notebookDatasets']").prop('disabled',true);
	} else  if ($('#deviceCheckbox .checkbox').find("input[value='notebookDatasets']").prop("checked")){
		D_array=D_array.concat(notebookData);
	}
	
	if(!pcData.length){
		$('#deviceCheckbox .checkbox').find("input[value='pcDatasets']").prop('checked',false);
		$('#deviceCheckbox .checkbox').find("input[value='pcDatasets']").prop('disabled',true);
	} 
	else if ($('#deviceCheckbox .checkbox').find("input[value='pcDatasets']").prop("checked")){
		D_array=D_array.concat(pcData);
	}

	D_array.sort(function(a, b) {return a - b;});
	var D_max = D_array.pop();
	if (D_max>10){
		D_max=Math.round(D_max/10)+1;
	} else {
		D_max=1;
	}

	//switch(timeZone){
	//	case 'hour':			
	//		phoneData =  [65,59,90,81,56,55];
	//		tabletData =  [45,80,85,54,15,4];
	//		notebookData =  [5,9,18,65,45,11];
	//		pcData =  [33,52,40,66,85,21];
	//		break;
	//		
	//	case 'day':
	//		phoneData =  [65,59,90,81,56,55,45,65,59,90,81,56,55,45];
	//		tabletData =  [45,54,80,85,54,15,4,45,54,80,85,54,15,4];
	//		notebookData =   [5,9,70,18,65,45,11,5,9,70,18,65,45,11];
	//		pcData = [33,52,40,74,66,85,21,33,52,40,74,66,85,21];
	//		break;
	//	case 'week':
	//		phoneData =  [65,59,90,81,56,55,45];
	//		tabletData = [45,54,80,85,54,15,4];
	//		notebookData =   [5,9,70,18,65,45,11];
	//		pcData = [33,52,40,74,66,85,21];
	//		break;
	//}

	phoneDatasets ={ 
		fillColor : "rgba(250,250,250,0.1)",strokeColor : "#379E5F",pointColor : "#379E5F",
		data : phoneData};
	tabletDatasets ={ 
		fillColor : "rgba(250,250,250,0.1)",strokeColor : "#35BBEA",pointColor : "#35BBEA",
		data : tabletData};
	notebookDatasets ={ 
		fillColor : "rgba(250,250,250,0.1)",strokeColor : "rgba(241,115,127,1)",pointColor : "rgba(241,115,127,1)",
		data : notebookData};
	pcDatasets ={ 
		fillColor : "rgba(250,250,250,0.1)",strokeColor : "#EA8F35",pointColor : "#EA8F35",
		data : pcData};
	
	var DeviceChosen = [];
	$('#deviceCheckbox .checkbox').each(function(e){
		if($(this).find('input').is(':checked')){
			if(  $(this).find('input').attr('value') == 'phoneDatasets' ){
				if(phoneDatasets.data.length>0) DeviceChosen.push(phoneDatasets);
			} else if( $(this).find('input').attr('value') == 'tabletDatasets'  ){
				if(tabletDatasets.data.length>0) DeviceChosen.push(tabletDatasets);
			} else if( $(this).find('input').attr('value') == 'notebookDatasets'  ){
				if(notebookDatasets.data.length>0) DeviceChosen.push(notebookDatasets);
			} else if( $(this).find('input').attr('value') == 'pcDatasets'  ){
				if(pcDatasets.data.length>0) DeviceChosen.push(pcDatasets);
			}
		}
	});
	var data = {
		labels :labels,
		datasets : DeviceChosen
	};
	var option={
		datasetStrokeWidth:3,
		scaleOverride: true,
		scaleSteps: 10,
		scaleStepWidth: D_max,
		scaleStartValue: 0
	};
	new Chart(ctx).Line(data,option);
	D_flag=timeZone;
}

//~ 
var drawBrowserLine = function (result){
	var ctx = $("#browserLine").get(0).getContext("2d");
	var chromeDatasets , firefoxDatasets , ieDatasets , operaDatasets,safariDatasets,otherDatasets
				,chromeData,firefoxData,iebookData,operaData, safariData, otherData ;
	var timeZone = $('#browser .timezone').find('.active').attr('value');
    labels = gettimeZone(timeZone,result.timestamp);
    chromeData =  result.data.chrome?result.data.chrome:[];
    firefoxData =  result.data.firefox?result.data.firefox:[];
    iebookData =  result.data.iexplore?result.data.iexplore:[];
    operaData =  result.data.opera?result.data.opera:[];
    safariData =  result.data.safari?result.data.safari:[];
    otherData =  result.data.other?result.data.other:[];


    // if timeZone change initial all type
    if(B_flag!==timeZone){
    	$('#browserCheckbox .checkbox').each(function(e,item){
    		var val=$(item).find("input").val();
    		$('#browserCheckbox .checkbox').find("input[value="+val+"]").prop('disabled',false);
    		$('#browserCheckbox .checkbox').find("input[value="+val+"]").prop('checked',true);
    	});
    }


    var B_array = [];

	if (!chromeData.length) {
		$('#browserCheckbox .checkbox').find("input[value='chromeDatasets']").prop('checked', false);
		$('#browserCheckbox .checkbox').find("input[value='chromeDatasets']").prop('disabled', true);
	} else if($('#browserCheckbox .checkbox').find("input[value='chromeDatasets']").prop("checked")){
		B_array = B_array.concat(chromeData);
	}

	if (!firefoxData.length) {
		$('#browserCheckbox .checkbox').find("input[value='firefoxDatasets']").prop('checked', false);
		$('#browserCheckbox .checkbox').find("input[value='firefoxDatasets']").prop('disabled', true);
	} else if($('#browserCheckbox .checkbox').find("input[value='firefoxDatasets']").prop("checked")){
		B_array = B_array.concat(firefoxData);
	} 

	if (!iebookData.length) {
		$('#browserCheckbox .checkbox').find("input[value='ieDatasets']").prop('checked', false);
		$('#browserCheckbox .checkbox').find("input[value='ieDatasets']").prop('disabled', true);
	} else if ($('#browserCheckbox .checkbox').find("input[value='ieDatasets']").prop("checked")){
		B_array = B_array.concat(iebookData);
	}

	if (!operaData.length) {
		$('#browserCheckbox .checkbox').find("input[value='operaDatasets']").prop('checked', false);
		$('#browserCheckbox .checkbox').find("input[value='operaDatasets']").prop('disabled', true);
	} else if ($('#browserCheckbox .checkbox').find("input[value='operaDatasets']").prop("checked")){
		B_array = B_array.concat(operaData);
	}

	if (!safariData.length) {
		$('#browserCheckbox .checkbox').find("input[value='safariDatasets']").prop('checked', false);
		$('#browserCheckbox .checkbox').find("input[value='safariDatasets']").prop('disabled', true);
	} else if($('#browserCheckbox .checkbox').find("input[value='safariDatasets']").prop("checked")){
		B_array = B_array.concat(safariData);
	}

	if (!otherData.length) {
		$('#browserCheckbox .checkbox').find("input[value='otherDatasets']").prop('checked', false);
		$('#browserCheckbox .checkbox').find("input[value='otherDatasets']").prop('disabled', true);
	} else if ($('#browserCheckbox .checkbox').find("input[value='otherDatasets']").prop("checked")){
		B_array = B_array.concat(otherData);
	}

    // if()
    // $(this).find("input[value='phoneDatasets']").prop('checked',false);
	// $(this).find("input[value='phoneDatasets']").prop('disabled',true);

	// switch(timeZone){
	// 	case 'hour':			
	// 		chromeData =  [65,59,90,81,56,55];
	// 		firefoxData =  [0,0,0,0,0,0];
	// 		iebookData =  [5,9,18,65,45,11];
	// 		operaData =  [33,52,40,66,85,21];
	// 		safariData =  [38,2,1,6,5,2];
	// 		otherData =  [83,42,30,46,65,1];
	// 		break;
			
	// 	case 'day':
	// 		chromeData =  [65,59,90,81,56,55,65,59,90,81,56,55];
	// 		firefoxData =  [45,80,85,54,15,4,45,80,85,54,15,4];
	// 		iebookData =  [5,9,18,65,45,11];
	// 		operaData =  [33,52,40,66,85,21];
	// 		safariData =  [38,2,1,6,5,2];
	// 		otherData =  [83,42,30,46,65,1];
	// 		break;
	// 	case 'week':
	// 		chromeData =  [65,59,90,81,56,55,65,59,90,81,56,55];
	// 		firefoxData =  [45,80,85,54,15,4,45,80,85,54,15,4];
	// 		iebookData =  [5,9,18,65,45,11];
	// 		operaData =  [33,52,40,66,85,21];
	// 		safariData =  [38,2,1,6,5,2];
	// 		otherData =  [83,42,30,46,65,1];
	// 		break;
	// }

	B_array.sort(function(a, b) {return a - b;});
	var B_max = B_array.pop();
	if (B_max>10){
		B_max=Math.round(B_max/10)+1;
	} else {
		B_max=1;
	}

 
	chromeDatasets ={ 
		fillColor : "rgba(250,250,250,0.1)",strokeColor : "#379E5F",pointColor : "#379E5F",
		data : chromeData};
	firefoxDatasets ={ 
		fillColor : "rgba(250,250,250,0.1)",strokeColor : "#35BBEA",pointColor : "#35BBEA",
		data : firefoxData};
	ieDatasets ={ 
		fillColor : "rgba(250,250,250,0.1)",strokeColor : "rgba(241,115,127,1)",pointColor : "rgba(241,115,127,1)",
		data : iebookData};
	operaDatasets ={ 
		fillColor : "rgba(250,250,250,0.1)",strokeColor : "#EA8F35",pointColor : "#EA8F35",
		data : operaData};
	safariDatasets ={ 
		fillColor : "rgba(250,250,250,0.1)",strokeColor : "#EA35B3",pointColor : "#EA35B3",
		data : safariData};
	otherDatasets ={ 
		fillColor : "rgba(250,250,250,0.1)",strokeColor : "#9B35EA",pointColor : "#9B35EA",
		data : otherData};
	
	var BroserChosen = [];
	$('#browserCheckbox .checkbox').each(function(e){
		if($(this).find('input').is(':checked')){
			if(  $(this).find('input').attr('value') == 'chromeDatasets' ){
				if(chromeDatasets.data.length>0) BroserChosen.push(chromeDatasets);
			} else if( $(this).find('input').attr('value') == 'firefoxDatasets'  ){
				if(firefoxDatasets.data.length>0) BroserChosen.push(firefoxDatasets);
			} else if( $(this).find('input').attr('value') == 'ieDatasets'  ){
				if(ieDatasets.data.length>0) BroserChosen.push(ieDatasets);
			} else if( $(this).find('input').attr('value') == 'operaDatasets'  ){
				if(operaDatasets.data.length>0) BroserChosen.push(operaDatasets);
			} else if( $(this).find('input').attr('value') == 'safariDatasets'  ){
				if(safariDatasets.data.length>0) BroserChosen.push(safariDatasets);
			} else if( $(this).find('input').attr('value') == 'otherDatasets'  ){
				if(otherDatasets.data.length>0) BroserChosen.push(otherDatasets);
			}
		}
	});
	var data = {
		labels :labels,
		datasets : BroserChosen
	};

	// $(this).find("input[value='phoneDatasets']").prop('checked',false);
	// $(this).find("input[value='phoneDatasets']").prop('disabled',true);
	
	var option={
		datasetStrokeWidth:3,
		scaleOverride: true,
		scaleSteps: 10,
		scaleStepWidth: B_max,
		scaleStartValue: 0

	};
	new Chart(ctx).Line(data,option);
	B_flag=timeZone;
}	
var drawLoginsourceLine = function (result){
	var ctx = $("#loginsourceLine").get(0).getContext("2d");
	var ccDatasets , fbDatasets , gpDatasets , ccData,fbData,gpData ;
	var timeZone = $('#loginsource .timezone').find('.active').attr('value');
    labels = gettimeZone(timeZone,result.timestamp);
    ccData =  result.data.ciaocom?result.data.ciaocom:[];
    fbData =  result.data.google?result.data.google:[];
    gpData =  result.data.facebook?result.data.facebook:[];

    var L_array = [];

    // if timeZone change initial all type
    if(L_flag!==timeZone){
    	$('#loginCheckbox .checkbox').each(function(e,item){
    		var val=$(item).find("input").val();
    		$('#loginCheckbox .checkbox').find("input[value="+val+"]").prop('disabled',false);
    		$('#loginCheckbox .checkbox').find("input[value="+val+"]").prop('checked',true);
    	});
    }


  
    if(!ccData.length){
    	$('#loginCheckbox .checkbox').find("input[value='ccDatasets']").prop('checked',false);
    	$('#loginCheckbox .checkbox').find("input[value='ccDatasets']").prop('disabled',true);
    } else if($('#loginCheckbox .checkbox').find("input[value='ccDatasets']").prop("checked")){
		L_array = L_array.concat(ccData);
	}

    if(!fbData.length){
    	$('#loginCheckbox .checkbox').find("input[value='fbDatasets']").prop('checked',false);
    	$('#loginCheckbox .checkbox').find("input[value='fbDatasets']").prop('disabled',true);
    } else if($('#loginCheckbox .checkbox').find("input[value='fbDatasets']").prop("checked")){
		L_array = L_array.concat(fbData);
	}

    if(!gpData.length){
    	$('#loginCheckbox .checkbox').find("input[value='gpDatasets']").prop('checked',false);
    	$('#loginCheckbox .checkbox').find("input[value='gpDatasets']").prop('disabled',true);
    } else if($('#loginCheckbox .checkbox').find("input[value='gpDatasets']").prop("checked")){
		L_array = L_array.concat(gpData);
	}

	ccDatasets ={ 
		fillColor : "rgba(250,250,250,0.1)",strokeColor : "#379E5F",pointColor : "#379E5F",
		data : ccData};
	fbDatasets ={ 
		fillColor : "rgba(250,250,250,0.1)",strokeColor : "#35BBEA",pointColor : "#35BBEA",
		data : fbData};
	gpDatasets ={ 
		fillColor : "rgba(250,250,250,0.1)",strokeColor : "rgba(241,115,127,1)",pointColor : "rgba(241,115,127,1)",
		data : gpData};

	L_array.sort(function(a, b) {return a - b;});
	var L_max = L_array.pop();
	if (L_max>10){
		L_max=Math.round(L_max/10)+1;
	} else {
		L_max=1;
	}

	var LoginChosen = [];
	$('#loginCheckbox .checkbox').each(function(e){
		if($(this).find('input').is(':checked')){
			if(  $(this).find('input').attr('value') == 'ccDatasets' ){
				if(ccDatasets.data.length>0) LoginChosen.push(ccDatasets);
			} else if( $(this).find('input').attr('value') == 'fbDatasets'  ){
				if(fbDatasets.data.length>0) LoginChosen.push(fbDatasets);
			} else if( $(this).find('input').attr('value') == 'gpDatasets'  ){
				if(gpDatasets.data.length>0) LoginChosen.push(gpDatasets);
			}
		}
	});
	var data = {
		labels :labels,
		datasets : LoginChosen
	};	var option={
		datasetStrokeWidth:3,
		scaleOverride: true,
		scaleSteps: 10,
		scaleStepWidth: L_max,
		scaleStartValue: 0
	};
	new Chart(ctx).Line(data,option);
	L_flag=timeZone;
}	
var drawSignalingLine = function (data){
	var ctx = $("#signalingLine").get(0).getContext("2d");

	var timeZone = $('#signaling .timezone').find('.active').attr('value');
	labels = gettimeZone(timeZone);

	switch(timeZone){
		case 'hour':			
			timedata =  [65,59,90,81,56,55];
			break;
			
		case 'day':
			timedata =  [45,80,85,54,15,4];
			break;
		case 'week':
			timedata = [5,9,18,65,45,11];
			break;
	}


	var data = {
		labels : labels,
		datasets : [
			{
				fillColor : "rgba(220,220,220,0.1)",
				strokeColor : "rgba(87,153,87,1)",
				pointColor : "rgba(87,153,87,1)",
				pointStrokeColor : "#fff",
				data : timedata
			},
		]
	};
	var option={datasetStrokeWidth:3};
	new Chart(ctx).Line(data,option);
}	
var drawSignalingAverageLine = function (data){
	var ctx = $("#signalingAverageLine").get(0).getContext("2d");

	var timeZone = $('#signalingAverage .timezone').find('.active').attr('value');
	labels = gettimeZone(timeZone);

	var data = {
		labels : labels,
		datasets : [
			{
				fillColor : "rgba(220,220,220,0.1)",
				strokeColor : "rgba(87,153,87,1)",
				pointColor : "rgba(87,153,87,1)",
				pointStrokeColor : "#fff",
				data : [65,59,90,81,56,55]
			},
		]
	};
	var option={datasetStrokeWidth:3};
	new Chart(ctx).Line(data,option);
}
/*Time Selector
 -----------------------------------------------------*/
function gettimeZone(timeZone,timestamp){
	var currentTimeDate =  new Date(timestamp);
	
	//~ console.log( currentTimeDate.getMonth()  );
	//~ console.log( currentTimeDate.getDay()  );
	//~ console.log( currentTimeDate.getDate()  );
	//~ console.log( currentTimeDate.getHours()  );
	//~ console.log( currentTimeDate.getMinutes()  );
	
	
	switch(timeZone){
		case 'hour':
			var now = currentTimeDate.getHours()  ;
			var min = currentTimeDate.getMinutes();
			var thisMin = parseInt(min/10)*10 ;
			labels = [] ;			
			for(var  i=1; i<=6;i++){
				var thisMin = (thisMin > 9)?  thisMin : '0' + thisMin;
				labels[6-i] = now + ':' + thisMin ;
				thisMin = parseInt(thisMin) - 10 ;
				if( thisMin < 0 ){ now = (now-1>=0)?now-1:24-1; thisMin = 50; };
			}		
			break;
		case 'day':
			var now = currentTimeDate.getHours()  ;
			var min = '00';
			labels = [] ;
			for(var  i=1; i<=24;i++){
				var hour = (now > 9)?  now : '0' + now;
				labels[24-i] = hour + ':' + min ;
				now = parseInt(now) - 1 ;
				if( now == 0 ){ now = 24 };
			}
			break;
		case 'week':
			var now = currentTimeDate.getDay();
			labels = [] ;
			var week =  ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] ;
			for(var  i=1; i<=7;i++){
				var todayM = currentTimeDate.getMonth() + 1 ;
				var toDay = currentTimeDate.getDate()  ;
				var today = week[now];
				labels[7-i] = todayM + "/"  + toDay + '(' + today  + ')' ;
				now = parseInt(now) - 1 ;
				currentTimeDate.setDate(toDay - 1);
				if( now < 0 ){ now = 6 };
			}
			break;

	}
	return labels;
}

