$(document).ready(function() {
    // setTimeout("location.reload();",30000);
    var type='name';
    var sort='ASC';
    var entries=10;
    var pages=0;

    var jid = $("#userloglist").attr("class");
    getusernum();
    changepage(pages);
    function getusernum(){
		var totalpage = 20;
		$('#Page span').text(totalpage);
        //~ $.ajax({
            //~ type: 'GET',
            //~ url: '/admin/usernum',
            //~ success: function(data) {
                //console.log(data + '  ' + parseInt(data/10 +1));
                //~ totalpage =  parseInt(data/10 +1);
                //~ $('#Page span').text(totalpage);
            //~ }
        //~ });
    }

    $("#logState").on('click','#logOut',function(e){
		window.location.href="/logout";
    });
        
	$('.timemenu').on('click','li',function(){
		var dom = $(this).parents('.timemenu');
		var text = $(this).find('a').text();
		dom.find('i').remove();
		$(this).find('a').append('<i class="glyphicon glyphicon-ok"></i>');
		$('#logtimestamp').text(text);

        console.log(text);

        if( text == 'Timestamp'){
            $('#log_list tr').each(function(){
                var timestamp = $(this).children('td:first-child').attr('timestamp');
                $(this).removeAttr('timestamp');
                console.log(timestamp);
                $(this).children('td:first-child').text(timestamp);
            });
        }else if( text == 'Date'){
            $('#log_list tr').each(function(){
                var timestamp = $(this).children('td:first-child').text();
                var timeString = trans_timestamp(parseInt(timestamp));
                $(this).children('td:first-child').attr('timestamp',timestamp).html(timeString);
            });
        }


		});
	$('.searchInput').on('change',function(){
		if($('.searchInput').val() != ""){
			$("#dosearch").trigger('click');
		} else{
			pages=1;        
			changepage();    
		}
		$(this).blur();
	});

    $("#dosearch").on('click',function(){
        var type=$("#searchtype").val();
        var query=$(".searchInput").val();

        if($('.searchInput').val() != ""){
           
        }
    });

    $("#attached").on('click','button',function(e){
		var now =  $(this).attr('class') ;
		if( $(this).hasClass( 'active') ){
			$(this).find('i').hide();
		} else {
			$(this).find('i').show();
		}
    });


    $("#First").click(function() {
        if($('#Page input').val()!=='1'){
            pages = 0;
            changepage(pages);
        }
        
    });

    $("#Previous").click(function() {
        console.log(pages)
        if(pages>0){
            pages--;
            changepage(pages);
        }
    });

    $("#Latest").click(function() {
        if( $('#Page input').val() !== $('#Page span').text()){
            pages=  parseInt($('#Page span').text())-1;
            changepage(pages);
        }
    });

    $("#Next").click(function() {
		if( pages < parseInt($('#Page span').text())-1 ){
			pages++;
			changepage(pages);
		}
    });

	$('#Page').on('click',function(){
		$('#Page input').focus().select();
	});

	$( "#Page" ).bind('mousewheel DOMMouseScroll', function(e) {
		e.preventDefault();
		if (e.type == 'mousewheel') {
			if(e.originalEvent.wheelDelta > 0 ){
				$("#Next").trigger('click');
			}
			else{
				$("#Previous").trigger('click');
			}
		}
		else if (e.type == 'DOMMouseScroll') {
			if(e.originalEvent.detail > 0 ){
				$("#Next").trigger('click');
			}
			else{
				$("#Previous").trigger('click');
			}
		}
	});
	
	$('#Page input').on( "keypress" , function(e) {
		if( e.which == 13 ){
			$(this).trigger('blur');
		}
	});
	$('#Page input').on( "blur" , function(e) {
		var val = parseInt($('#Page input').val()) - 1;
		var totalpage = parseInt($('#Page span').text());
		if(  val != pages  ){
			if( val >= 0 && val <= totalpage){
				pages = val;
				changepage(pages);         
			} else if( val > totalpage){
				pages = totalpage;
				changepage(pages);
			} else if( val < 0 ){
				pages = 1;
				changepage(pages);
			} else{
				 $('#Page input').val(pages);
			}
		}
	});

    $('.attached button').on('click',function(e){
		if($(e.target).hasClass('clicked')){
			if( $(e.target).attr('id') == 'AllLogCall' ){return;}
			$(e.target).removeClass('clicked active');
		} else {
			$(e.target).addClass('clicked active');
		}
		if($(e.target).attr('id') == 'AllLogCall'){
			$('#attached_single button').addClass('clicked active');
		} else{
			$('#AllLogCall').removeClass('clicked active');
		}

			
        var pages=$('#Page input').val();
        pages=pages-1;
        console.log(pages)
        
        // var lastclick = $(e.target).val();
        // console.log(string);
        // string = string.concat("usertype="+lastclick);
        // console.log(string);
        // console.log(lastclick);
        changepage(pages);

    }); 

    function trans_timestamp(timestamp) {

        var d = new Date(timestamp);
        var yearstr = d.getFullYear();
        var monthstr = ((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1); //補0
        var datestr = (d.getDate() < 10 ? '0' : '') + d.getDate();
        var hourstr = (d.getHours() < 10 ? '0' : '') + d.getHours();
        var minutestr = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
        var secondstr = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();

        var timestring = yearstr+'/'+monthstr+'/'+datestr+' </br> '+hourstr+':'+minutestr+':'+secondstr;

        return timestring;
    }

    function renderdata(timestamp,userjid,msg) {
        var account;
        var timeType=$("#logtimestamp").text();
        var msgstring=String(msg);
        var calltype;

        console.log(userjid);
         console.log(">>>>>>>"+timestamp);
        if(userjid==jid){
            if(msgstring.search('Login') + 1){
                type='Login';
                calltype = msgstring;
                var msgsplit = msgstring.split(jid);
                calltype=msgsplit[1];
                var msgsplit2=calltype.split('[');
                calltype=msgsplit2[0];
                time = '';
            } else {
                type='Logout';
                calltype = msgstring;
                var msgsplit = msgstring.split(jid);
                calltype=msgsplit[1];
                var msgsplit2=calltype.split('[');
                calltype=msgsplit2[0];
                time = '';
            }

            if (timeType === 'Timestamp') {

               

                $("#log_list").append('<tr ><td timestamp="' + timestamp + '">' + timestamp +
                    '</td><td>' + type +
                    '</td><td> ' + calltype +
                    '</td><td>' + '' +
                    '</td></tr>');
            } else {
                $("#log_list").append('<tr ><td timestamp="' + timestamp + '">' + trans_timestamp(timestamp) +
                    '</td><td>' + type +
                    '</td><td> ' + calltype +
                    '</td><td>' + '' +
                    '</td></tr>');
            }

            console.log(">>>>>>>same"+timestamp);
        } else {

                    $.ajax({
                        type: 'GET',
                        url: "/admin/searchaccount/" + userjid,
                        success: function(data) {

                            if (msgstring.search('caller') + 1 || msgstring.search('callee') + 1) {
                                var string = msg.split('[');
                                var JObj = JSON.parse(string[0]);
                                var time = JObj.totalTime.split(':');
                                var logTime =  (time[0] < 10 ? '0' : '')+time[0]  + ':' +
                                                            (time[1] < 10 ? '0' : '')+time[1]  + ':'  +
                                                            (time[2] < 10 ? '0' : '')+time[2] ;
                                if (jid === JObj.caller) {
                                    type='Caller';
                                    calltype = 'To: ' + data+' ('+JObj.callee+') </br> Time: [ '+logTime +' ]' ;
                                } else {
                                    type='Callee'
                                    calltype = 'From: ' +data+' ('+JObj.caller+') </br> Time: [ '+logTime +' ]' ;
                                }
                            } else {
                                if(msgstring.search('Login') + 1){
                                    type='Login';
                                    calltype = msgstring;
                                    var msgsplit = msgstring.split(jid);
                                    calltype=msgsplit[1];
                                    var msgsplit2=calltype.split('[');
                                    calltype=msgsplit2[0];
                                    time = '';
                                } else {
                                    type='Logout';
                                    calltype = msgstring;
                                    var msgsplit = msgstring.split(jid);
                                    calltype=msgsplit[1];
                                    var msgsplit2=calltype.split('[');
                                    calltype=msgsplit2[0];
                                    time = '';
                                }
                            }

                            account = data;
                            if (timeType === 'Timestamp') {
                                console.log("<<<<<<<"+timestamp);
                                $("#log_list").append('<tr ><td timestamp="' + timestamp + '">' + timestamp +
                                    '</td><td>' + type +
                                    '</td><td> ' + calltype +
                                    '</td><td>' + '' +
                                    '</td></tr>');
                            } else {
                                $("#log_list").append('<tr ><td timestamp="' + timestamp + '">' + trans_timestamp(timestamp) +
                                    '</td><td>' + type +
                                    '</td><td> ' + calltype +
                                    '</td><td>' + '' +
                                    '</td></tr>');
                            }

                        }
                    });

        }


        

       

    }

   function changepage(pages) {

        var string = '/admin/log?type=INFO&entries=10&page='+pages+'&attach=all&jid='+jid+'&';
        var flags = [];
        $('#attached_single > button.clicked').each(function(index, item) {
				flags.push("usertype=" + $(item).val() + "&");
        });
        for (var i = 0; i < flags.length; i++){
            string = string.concat(flags[i]);
        }

		console.log('changepage');
        var timeType=$("#logtimestamp").text();
        console.log(string);
       
        $.ajax({
            type: 'GET',
            url: string,
            success: function(data) {
                $("#log_list").empty();
                console.log(JSON.stringify(data));

                if (data[0]){
                    var totalNum = parseInt( JSON.stringify(data[0]));
                    var totalPage = parseInt ( totalNum/ 10) +1; 
                } else {
                    var totalPage=1;
                }
                $('#Page span').text( totalPage );
                var calltype;
                var userjid;

                
                if (data) {
                    if (data.length && data[1].length) {
                        data[1].forEach(function(item) {
                            var msg = item.msg;
                            if (msg.search("caller") + 1) {
                                var string = msg.split('[');
                                var JObj = JSON.parse(string[0]);
                                if (jid === JObj.caller) {
                                    userjid = JObj.callee;
                                } else {
                                    userjid = JObj.caller;
                                }
                            } else {
                                userjid = jid;
                            }
                            renderdata(item.timestamp, userjid, msg);
                        });
                    }
                }                
            }
        });
        console.log(pages);
		$('#Page input').val(parseInt(pages)+1);

    }
   
});

