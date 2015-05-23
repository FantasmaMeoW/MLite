$(document).ready(function() {



	var page=0;
	var totalpage;
	changepage();
	// totalnum();


	$('.daterange').datepicker().on('changeDate', function(e){ 
        $('.daterange').datepicker('hide');
    });

    $('.startdate').datepicker().on('changeDate', function(e){ 
        
        // var startdate = $('.startdate').val();
        var endDate = $('.enddate').val();

        var endTime = new Date(endDate).getTime(); 

        // console.log(e.date.valueOf());
        // console.log(endTime);

        if (e.date.valueOf() > endTime){
            console.log('The Start date must be before the End date.');
            $(".startdate").val('');
        } 
    });

    $('.enddate').datepicker().on('changeDate', function(e){ 
        
        var startDate = $('.startdate').val();
        // var endDate = $('.enddate').val();

        var startTime = new Date(startDate).getTime(); 

        // console.log(e.date.valueOf());
        // console.log(startTime);

        if (e.date.valueOf() < startTime){
            console.log('The End date must be after the Start date.');
            $(".enddate").val('');
        } 
    });

	$('#roomList>table').on('click','tr',function(e){
		var conversationID = $(this).attr('con_ID');
		$('#roomList>table').find('.active').removeClass('active');
		$(this).addClass('active');

		$.ajax({
			type: 'GET',
			url: '/admin/conversationmsg/'+conversationID ,
			success: function(data) {
				$("#conversation_list").empty();
				$("#participants").empty();
				$("#participantsMem ").empty();

				if(data[1]){
					var num=data[1].length;
					$("#participants").append(num);
					$("#participants").append('</br>');
					var participantstring=num.toString();
					
					data[1].forEach(function(item) {
						var jid = item.bareJID;
						jid=jid.replace("@ciaocom","");
						var img = stickerBox.createImg(jid);
						// participantstring=participantstring.concat(img+'</br>'+jid);
						img.classList.add('avatar');
						$("#participantsMem ").append(img);
						$("#participantsMem ").append(jid);
						$("#participantsMem ").append('</br>');
					});
					
				}
				// if(fromJID.indexOf("@conference.ciaocom")!=-1){
				// 	participantstring=fromJID;
				// } else if (toJID.indexOf("@conference.ciaocom")!=-1){
				// 	participantstring=toJID;
				// } else {
				// 	participantstring=fromJID+'  ,</br> '+toJID;
				// }

				// $("#participants").html(participantstring);
				// $("#participants").html(participantstring);
				$("#MSGcount").html(data[0][0].messageCount);
				$("#MSGtime").html(trans_timestamp(data[0][0].sentDate));

				if(data[0]){
					data[0].forEach(function(item) { 
						$("#conversation_list").append('<tr ><th>'+trans_timestamp_time(item.sentDate)+'</th><th>'+item.fromJID+'</th><th>'+ msgAttrMapper(item.body) +'</th></tr>');

					});
				}
			

			}
		});
	});


	$('#participantShow').on('click',function(e){
		var value = $('#participant').val();
		if( !$(e.target).hasClass('close') ){
			$('#participant').focus();
			$(this).hide();
		} else{
			var targetText ='';
			var targetEQ = $(e.target).parents('.partis').children('.partisVal').index('.partisVal');
			$('.partisVal').each(function(e){
				if( $(this).index('.partisVal') != targetEQ ){
					targetText = targetText + $(this).text() + ',';
				}
			});
			value = targetText.substring(0,targetText.length-1);
			$('#participant').val(value);			
			if( $('#participantShow').find('.partisVal').length == 1){
				 $('#participantShow').css('opacity','0');
			}
		}
		$('#inputArea>div').eq(0).height( $('#participantShow').height());
	});
	$('#participant').on('keypress',function(e){
		if( e.which == 13 ){
			$(this).trigger('blur');
			}
	});

	$('#participant').on('blur',function(e){
		var value = $(this).val();		
		if( value =='' ){ $('#participantShow').css('opacity','0').show(); }
		else{ $('#participantShow').css('opacity','1').show(); generateSpan(value);}
		$('#participantShow').show();
		$('#inputArea>div').eq(0).height( $('#participantShow').height() );
	});

	function generateSpan(value){
		var people = value.split(',');
		var spanHtml='' ;
		var sampleHtml = '<div class="alert alert-info alert-dismissable partis">' +
										  '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span class="partisVal">';
										
		for( var i = 0 ; i< people.length;i++ ){
			if( people[i] != '' ){
				spanHtml = spanHtml + sampleHtml +  people[i] + '</span></div> ';
			}
		}
		$('#participantShow').html(spanHtml);
		
	}
    $("#First").click(function() {
        page=0;
        changepage();
    });

    $("#Previous").click(function() {
        if(page>0){
            page--;   
			changepage();            
        }
    });

    $("#Latest").click(function() {
        page= $('#Page span').text()-1;
        changepage();
    });

    $("#Next").click(function() {
		if( page < parseInt($('#Page span').text()-1) ){
			page++;
			changepage();
		}
    });

	$('#emptyAll').on('click',function(e){
		$('.searchInput').val('');
		$('#participant').trigger('blur');
		$('#searchSubmit').trigger('click');
	});
	
	$('#searchSubmit').on('click',function(e){
				$("#conversation_list").empty();
				$("#participants").empty();
				$("#participantsMem ").empty();
				$("#MSGcount ").empty();
				$("#MSGtime ").empty();
		var targetText ='';
		$('.partisVal').each(function(e){
			targetText = targetText + $(this).text() + ',';
		});
		targetText = targetText.substring(0,targetText.length-1);
		page=0;
		changepage();
	});

	$('.searchInput').on( "keypress" , function(e) {
		if( e.which == 13 ){
			if($('.searchInput').val() != ""){
               $("#searchSubmit").trigger('click');
			}
		}
	});

	function msgAttrMapper(inputbody){
	    var string;
	    var body = $('<div>' + inputbody + '</div>').text();

	    try{
	        var body=JSON.parse(body);
            if(body.v != 1){
            	return inputbody;
            }
            
            if(body.m){
            	body.m = body.m.replace(/(\b(https?):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z0-9+&@#\/%=~_|])/ig, function($0) {
            	    return "<a href='" + $0 + "' target='_blank'>" + $0 + "</a>";
            	})
            }
          

            if(body.t=='notice'){
            	string="<b>Type: </b>"+body.t+" </br><b>Text: </b>"+body.m;
            } else if(body.t=='broadcast'){
            	string="<b>Type: </b>"+body.t+" </br><b>Text: </b>"+body.m;
            } else if(body.t=='text'){
            	string="<b>Type: </b>"+body.t+" </br><b>Text: </b>"+body.m;
            } else if(body.t=='call'){
            	string="<b>Type: </b>"+body.t+" </br><b>CallTime: </b>"+body.ct;
            } else if (body.t=='sticker') {
            	string="<b>Type: </b>"+body.t+" </br><b>StickerID: </b>"+body.sid;
            } else if (body.t=='file') {
            	string="<b>Type: </b>"+body.t+" </br><b>Filename: </b> <a download="+body.fn+" href='/admin/ccr/gridfs/downloadall?t="+body.fid+"'> "+body.fn+"";
            } else if (body.t=='voice') {
        		string="<b>Type: </b>"+body.t+" </br><b>AudioID: </b>"+body.fid;
            } else {
            	string="None";
            }
	    }catch(e){
	    	if(body !== null){
		    	var regex=/<img.*img>/; 
				var final_string = body.replace(regex,'');
				final_string = final_string.replace('<div>','<div class="glyphicon glyphicon-paperclip"/>  ');
				final_string = final_string.replace('/ccr','/admin/ccr');
				string = final_string;
	    	} else {
	    		string=body;
	    	}
	    	
	    }

	   

	   // <a download="{{fileName}}" href="/ccr/gridfs/downloadall?t={{fileID}}">
	    return string;
	}

	function changepage() {


		var participant = $('#participant').val();
		participant = (participant.length) ? participant : null;
		var startdate = $('.startdate').val();
		startdate = (startdate.length) ? startdate : null;
		var enddate = $('.enddate').val();
		enddate = (enddate.length) ? enddate : null;
		var searchData = {
            participant: participant,
            startdate: startdate,
            enddate: enddate,
            page: page,
        };

		$.ajax({
			type: 'GET',
			url: '/admin/historysearch',
			data:searchData,
			success: function(data) {
			$("#history_list").empty();
			if(data[0][0].count){
				totalpage= (data[0][0].count % 15 == 0) ? parseInt(data[0][0].count/15) : parseInt(data[0][0].count/15)+1;
				$('#Page span').text(totalpage);
			} else {
				$('#Page span').text(1);
			}
			

			if(data[1]){
				data[1].forEach(function(item) { 
					var string=item.toJID;
					if(string.indexOf("@conference.ciaocom")!=-1){
						$("#history_list").append('<tr con_ID='+item.conversationID+' id='+item.sentDate+'><td> '+trans_timestamp(item.sentDate)+'<td><div class="talk_participant"> <li>Group Chat: '+item.toJID+'</li> </div> <div ="talk_participant"> </div></td> </td></tr>');
						// $("#history_list").append('<tr con_ID='+item.conversationID+' id='+item.sentDate+'><td> '+trans_timestamp(item.sentDate)+'<td><div class="talk_participant"> <li>Group Chat: '+item.toJID+'</li> </div> <div ="talk_participant"> <li>Participant: </li> </div></td> </td></tr>');
					} else {
						$("#history_list").append('<tr con_ID='+item.conversationID+' id='+item.sentDate+'><td> '+trans_timestamp(item.sentDate)+'<td><div class="talk_participant"> <li>'+item.fromJID+'</li> </div> <div ="talk_participant"> <li>'+item.toJID+'</li> </div></td> </td></tr>');
					}
				});
			}

			$('#Page input').val(page+1);
			}
		});
	}

	function trans_timestamp(timestamp) {

	    var d = new Date(timestamp);
	    var yearstr = d.getFullYear();
	    var monthstr = ((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1); //補0
	    var datestr = (d.getDate() < 10 ? '0' : '') + d.getDate();
	    var hourstr = (d.getHours() < 10 ? '0' : '') + d.getHours();
	    var minutestr = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
	    var secondstr = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();

	    var timestring = yearstr+'/'+monthstr+'/'+datestr+' '+hourstr+':'+minutestr+':'+secondstr;

	    return timestring;
	}

	function trans_timestamp_time(timestamp) {

	    var d = new Date(timestamp);
	    // var yearstr = d.getFullYear();
	    // var monthstr = ((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1); //補0
	    // var datestr = (d.getDate() < 10 ? '0' : '') + d.getDate();
	    var hourstr = (d.getHours() < 10 ? '0' : '') + d.getHours();
	    var minutestr = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
	    var secondstr = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();

	    var timestring = hourstr+':'+minutestr+':'+secondstr;

	    return timestring;
	}

	




});
