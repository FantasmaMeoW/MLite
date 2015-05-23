$(document).ready(function() {
	
	var interval;
	var adminView = Backbone.View.extend({
		initialize: function () {
			

			// TODO: Display connecting to message service.
			
			//~ init
			// var href = location.href;
			// console.log(href);
			// var nowhref = href.split('/');
			// var subhref = nowhref[nowhref.length -1].split('#');
			// var pagehref = href.split('#');

			// if( subhref == 'admin' ){

				initInfo();
				interval=setInterval(initInfo, 5000);
				// initInfo();
				// initCPUPie();		
				// initMemoryPie();		
				// initDiskUsagePie();		
				var currentTimeDate =  new Date();
				var currentTime = currentTimeDate.toString();
				$( '#currentTime' ).text(currentTime);
				
				setInterval(function(){
					var tcurrentTimeDate =  new Date();
					var tcurrentTime = tcurrentTimeDate.toString();
					$( '#currentTime' ).text(tcurrentTime);
				},1000);
			// if( pagehref.length > 1 ){
			// 	var where = href.split('/admin#');
			// 	// console.log(where);
			// 	where=where[1].split('/');
			// 	// console.log(where);
			// 	where=where[0];
			// 	var theTitle = $('#' +where).text();
			// 	// console.log(where);
			// 	$('#iframePageID').attr('src', '/admin/'+where);
			// 	$('#adminHomeContent .breadcrumb').html(
			// 		'<li>'+
			// 		'<a href="/admin">Home</a> <span class="divider">/</span>'+
			// 		'</li>'+
			// 		'<li>'+
			// 		'<a href="#'+ where +'" class="ajax-link">' + theTitle + '</a>' +
			// 		'</li>');
			// 	$('#serverStatus').hide();
			// 	$('#iframeDiv').show();	
			// } 
		},

		el: 'html',
		events: {
			"click .ajax-link":"getLink",
			"click #iframePage":'where',
			
		},
		getLink: function(e) {
			console.log("GGGGGGGGGGGGGGGGGGg");
			// window.clearInterval(interval);
			// var theTitle = $(e.currentTarget).text();
			// var where = String($(e.currentTarget).attr('href')).slice(1);
			// var toWhere = '/admin/' + where;
			// // console.log('+++++++++++++   '+ theTitle + '  ' + $('#iframePageID').attr('src'));
			// // console.log( toWhere );
			// $('#iframePageID').attr('src',toWhere);
			// $('#adminHomeContent .breadcrumb').html(
			// 	'<li>'+
			// 	'<a href="/admin">Home</a> <span class="divider">/</span>'+
			// 	'</li>'+
			// 	'<li>'+
			// 	'<a href="#'+ where +'" class="ajax-link">' + theTitle + '</a>' +
			// 	'</li>');
			// $('#serverStatus:visible').hide();
			// $('#iframeDiv').show();

		},
		
		where: function(e) {
			console.log('SSSSSSSSSSSSSSSS ' + $('#iframePageID').attr('src'));

		},
	});

	var view = new adminView();


});

var upload_array=[];
var download_array=[];

function initInfo(){
	
	$.ajax({
		type: 'GET',
		url: '/admin/info' ,
		success: function(data) {
			console.log(data);
			initMemoryPie(data[1][0].per);
			initDiskUsagePie(data[1][1].disk_total[4]);	
			initCPUPie(data[1][2]);

			var download=data[1][6].RX;
			var upload=data[1][6].TX;
			console.log(JSON.stringify(data));
			console.log(data[1][6]);
			// $("#userID").html(data[0]);
			$("#memoryUsage .statusDec").html(data[1][0].used +'MB of '+data[1][0].total+'MB ('+data[1][0].per+'%) used');
			
			

			// MB of  (<span class='disk_per'></span>) used
			$("#diskUsage .statusDec").html(data[1][1].disk_total[2]+" of  "+data[1][1].disk_total[1]+" ("+data[1][1].disk_total[4]+") used");
			$("#cpuLoading .statusDec").html("Loading: "+data[1][2]+"% CPU Usage");
			 // <div id='lastUptime'>started: <br> </div>
			$("#lastUptime").html("<b>STARTED FROM</b> - "+data[0]);
			$("#uptimeDay").html("<span>"+data[1][3].uptime.d+"</span>days");
			$("#uptimeHourMin").html(data[1][3].uptime.h+"hours,"+data[1][3].uptime.m+"  minutes, "+data[1][3].uptime.s+" seconds");
			$(".hostName").html(data[1][3].host_name);
			$(".linuxVer").html(data[1][3].server_ver);
			$(".NodejsVer").html(data[1][3].nodejs_ver);
            $('.openfireVer').html('3.8.2');
			$("#onlineUser .userNum").html(data[1][4]);
			$("#currentUsers .userNum").html(data[1][5]);
			$("#totoalVisited .userNum").html(data[1][8]);
			$(".mysqlVer").html(data[1][7][0]);
			$(".mongoVer").html(data[1][7][1]);
			$(".upload").html("Upload: <span>"+upload+"KB/s</span>");
			if(upload_array.length>11){
				upload_array.pop();
			}
			upload_array.unshift(parseInt(upload));
			$(".download").html("Download: <span>"+download+"KB/s</span>");
			if(download_array.length>11){
				download_array.pop();
			}
			download_array.unshift(parseInt(download));
            $('#topareaTable').empty();
            var table ='';
            data[1][9].forEach(function(item){
               table = table+'<tr>';
               item.trim().split(/\s+/).forEach(function(item2,key){
				    if(key==0){item2 = item2 + '%';}
                    table = table + '<td>'+item2 +'</td>';
               });
               table = table+'</tr>';
            });
            //table = table + '</tr>';
            $('#topareaTable').append(table);

			console.log(download_array);
			console.log(upload_array);
			
			initDownloadLine(upload_array,download_array);
			//         mysql_ver:results[7][0],
			//         momgo_ver:results[7][1],

		}
	});

}

function initCPUPie(cpuLoading){
	var ctx = $("#CPUPie").get(0).getContext("2d");
	// var cpuLoading = $('#cpuLoading').find('.cpu_loading').text() ;

	var usage = parseInt(cpuLoading) ;
	var free = 100 - usage;
	var useColor = "#FFB544";
	if( usage > 80 ){ useColor = "#EC5555"; $('.disk_used').css('color','#EC5555'); };
	
	var data = [
	{
		value : usage,
		color : useColor
	},
	{
		value : free,
		color : "#8FBF80"
	}];

	var options = {animation : false};
	new Chart(ctx).Doughnut(data,options);
}
function initDiskUsagePie(diskUsage){
	var ctx = $("#diskPie").get(0).getContext("2d");
	// var diskUsage = $('#diskUsage').find('.disk_per').text() ;

	diskUsage = diskUsage.replace('%','');

	var usage = parseInt(diskUsage) ;
	var free = 100 - usage;
	var useColor = "#FFB544";
	if( usage > 80 ){ useColor = "#EC5555"; $('.disk_used').css('color','#EC5555'); };
	
	var data = [
	{
		value : usage,
		color : useColor
	},
	{
		value : free,
		color : "#8FBF80"
	}];

	var options = {animation : false};
	new Chart(ctx).Doughnut(data,options);
}
function initMemoryPie(mem_per){
	var ctx = $("#MemoryPie").get(0).getContext("2d");
	
	// var mem_per = $('#memoryUsage').find('.mem_per').text() ;

	var usage = parseInt(mem_per) ;
	var free = 100 - usage;
	var useColor = "#FFB544";
	if( usage > 80 ){ useColor = "#EC5555"; $('.disk_used').css('color','#EC5555'); };
	
	var data = [
	{
		value : usage,
		color : useColor
	},
	{
		value : free,
		color : "#8FBF80"
	}];

	var options = {animation : false};
	new Chart(ctx).Doughnut(data,options);
}
function initDownloadLine( upload_array,download_array){
	// console.log(upload_array);
	// console.log(download_array);
	var ctx = $("#uploadLine").get(0).getContext("2d");
	var data = {
		labels : ["5s","10s","15s","20s","25s","30s","35s","40s","45s","50s","55s","60s"],
		datasets : [
			{
				/* Download */
				fillColor : "rgba(220,220,220,0.1)",
				strokeColor : "rgba(87,153,87,1)",
				pointColor : "rgba(87,153,87,1)",
				pointStrokeColor : "#fff",
				// data : [28,48,40,19,96,27]
				// data : ["900","59","90"]
				data : download_array
			},
			{
				/* Upload */
				fillColor : "rgba(151,187,205,0.1)",
				strokeColor : "rgba(241,115,127,1)",
				pointColor : "rgba(241,115,127,1)",
				pointStrokeColor : "#fff",
				// data : [28,48,40,19,96,27]
				data: upload_array
			}
		]
	};

	var option={ 
		bezierCurve : false,
		datasetStrokeWidth:3,
		animation:false,
		scaleOverride: true,
		scaleSteps: 10,
		scaleStepWidth: 1000,
		scaleStartValue: 0
	};
	// var option = {bezierCurve : false};
	new Chart(ctx).Line(data,option);
}		
