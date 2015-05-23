$(document).ready(function() {
	var setting =  {'entries':'100', 'seeAll':'true', 'DEBUG':'true', 'INFO':'true',
								'WARN':'true' , 'ERROR':'true','attach_true': 'true', 'attach_false':'true', 'timestampState':'Timestamp' };
								
    initSetting();

	function initSetting(){
		 if( window.localStorage.getItem('setting') == null ){
			window.localStorage.setItem('setting' , JSON.stringify(setting));
		 } 
		 var selectedHtml = "<i class='glyphicon glyphicon-ok'></i>";
		
		 //~ entries
		 var optionText =   JSON.parse( window.localStorage.getItem('setting') ).entries;
		 $('#entries .num-' + optionText ).find('a').append(selectedHtml);
		 $('#entries .entriesnum').text(optionText);	

		 //~ timestamp  >>  .timestamp or .date
		 var timestampState =  JSON.parse( window.localStorage.getItem('setting') ).timestampState;
		 $('#logtimestamp .' + timestampState ).find('a').append(selectedHtml);
		 $('#logtimestamp .timeshowtype').text(timestampState);

		if( $('#searchtype').val() == 'Timestamp'){
			$('.searchInput').attr('placeholder','Start Time ~ End Time');
		}
		url_string = '/admin/log?type=DEBUG&type=INFO&type=WARN&type=ERROR&entries=' + optionText +'&page=0&sort=1&attach=all';	
		initlogpage(url_string);
	}
	
    function initlogpage(url_string) {　
        var count=0;
        

        var timeshowtype=$(".timeshowtype").text();

        $.ajax({
            type: 'GET',
            // '/admin/log?type=DEBUG&type=INFO&type=WARN&type=ERROR&entries=100&page=0',
            // url: string,
            url: url_string,
            success: function(data) {
                var totalNum = parseInt( JSON.stringify(data[0]) );
                var num_onepage=parseInt($('#entries .entriesnum').text());
                // var totalPage = parseInt ( totalNum/ parseInt($('#entries .entriesnum').text())) +1;
                var totalPage= (totalNum % num_onepage == 0) ? parseInt(totalNum/num_onepage) : parseInt(totalNum/num_onepage)+1;
                if(totalPage==0){
                    totalPage++;
                }
                $('#Page span').text( totalPage );
                
                if (timeshowtype == 'Timestamp') {
                    data[1].forEach(function(item) {
                        count++;
                        var attach = '';
                        if (item.attach) {
                            attach = '<label id="attach_' + item.timestamp + '"><i class="glyphicon glyphicon-paperclip"></i></label>'
                        }

                        $("#log_list").append('<tr ><td>' + item.timestamp +
                            '</td><td>' + item.type +
                            '</td><td>' + item.category +
                            '</td><td>' + item.msg +
                            '</td><td class="cc_attach">' + attach +
                            '</td></tr>');
                    });
                } else {
                    data[1].forEach(function(item) {
                        count++;
                        var attach = '';
                        if (item.attach) {
                            attach = '<label id="attach_' + trans_timestamp(item.timestamp) + '"><i class="glyphicon glyphicon-paperclip"></i></label>'
                        }

                        $("#log_list").append('<tr ><td timestamp="'+item.timestamp+'">' + trans_timestamp(item.timestamp) +
                            '</td><td>' + item.type +
                            '</td><td>' + item.category +
                            '</td><td>' + item.msg +
                            '</td><td class="cc_attach">' + attach +
                            '</td></tr>');
                    });

                }
            }
        });
     }
   
    function logpage(string) {

        var search=0
        if (string.search('searchinput')+1){
            search=1;
        }
        var timeshowtype=$(".timeshowtype").text();
        $.ajax({
            type: 'GET',
            url: string,
            success: function(data) {
                var totalNum = parseInt( JSON.stringify(data[0]) );
                var num_onepage=parseInt($('#entries .entriesnum').text());
                // console.log(num_onepage);
                var totalPage= (totalNum % num_onepage == 0) ? parseInt(totalNum/num_onepage) : parseInt(totalNum/num_onepage)+1;
                if(totalPage==0){
                    totalPage++;
                }
                // var totalPage = parseInt ( totalNum/ parseInt($('#entries .entriesnum').text())) +1;
                $('#Page span').text( totalPage );
                 
                var attach='';
                if (data[0]) {
                    if (data[1].length > 0) {
                        $("#log_list").empty();
                        if(timeshowtype==='Timestamp'){
                            data[1].forEach(function(item) {
                                if (item.attach) {
                                    attach = '<label id="attach_' + item.timestamp + '"><i class="glyphicon glyphicon-paperclip"></i></label>'
                                }
                                $("#log_list").append('<tr ><td timestamp="'+item.timestamp+'">' + item.timestamp +
                                    '</td><td>' + item.type +
                                    '</td><td>' + item.category +
                                    '</td><td>' + item.msg +
                                    '</td><td class="cc_attach">' + attach +
                                    '</td></tr>');
                            });
                            
                        } else {
                            data[1].forEach(function(item) {
                                if (item.attach) {
                                    attach = '<label id="attach_' + trans_timestamp(item.timestamp) + '"><i class="glyphicon glyphicon-paperclip"></i></label>'
                                }
                                $("#log_list").append('<tr ><td timestamp="'+item.timestamp+'">' + trans_timestamp(item.timestamp) +
                                    '</td><td>' + item.type +
                                    '</td><td>' + item.category +
                                    '</td><td>' + item.msg +
                                    '</td><td class="cc_attach">' + attach +
                                    '</td></tr>');
                            });

                        }
                      
                        // if(search){
                        //     searchpagenum=parseInt(searchpagenum);
                        //     $('#Page input').val(searchpagenum);
                        // } else {
                        //     console.log(numpage);
                            $('#Page input').val(numpage);
                        // }
                        
                    } else {
                        $('#Previous').trigger('click');
                    }
                } else {
                    $("#log_list").empty();
                    $('#Page input').val(1);
                }
                
            }
        });
    }

	/* 
	 * Event 
	 * 
	 * */
	$('#toTop').hide();
    $(window).scroll(function(e){
		if( $('body').scrollTop() > 150 ){
			$('#toTop').show();
		} else{
			$('#toTop').hide();
		}
	});
	$('#toTop').on('click',function(e){
		$('body').animate({scrollTop:0});
	});

	 $('#entries').on('click','li',function(){
		var selectedHtml = "<i class='glyphicon glyphicon-ok'></i>";
		var optionText = $(this).text();
		$('#entries i').each(function(){ $(this).remove(); });
		$('#entries .num-' + optionText ).find('a').append(selectedHtml);
		$('#entries .entriesnum').text(optionText);	
		$("#reload").trigger('click');
		
		setting.entries = optionText;
		window.localStorage.setItem('setting' , JSON.stringify(setting));
		
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

	//~ reflash page after change checktype
	$('#seeAll>button').on('click',function(){
		if( !$(this).hasClass('active')){
			$( '#checktype>button').each(function(){
				$(this).addClass('active');
			});
			$( '#attached>button').each(function(){
				$(this).addClass('active');
			});
			$("#reload").trigger('click');
		} else{
			$(this).removeClass('active');
		}
		setting.seeAll = $(this).hasClass('active');
		window.localStorage.setItem('setting' , JSON.stringify(setting));
	});
		
	$('#attached>button,#checktype>button').on('click',function(){
        numpage = 1;
        $('.searchInput').val("");
		var dom = $(this);
		setTimeout(function() {
			$('.searchInput').val("");
			if(!$(this).hasClass('active')){
				$('#seeAll>button').removeClass('active');
				setting.seeAll = $(this).hasClass('active');
			}
			$("#reload").trigger('click');
			setting[dom.text()] = dom.hasClass('active');
			console.log( dom.text() + '  ' +setting[dom.text()] + '  ' +setting.seeAll );
			window.localStorage.setItem('setting' , JSON.stringify(setting));
		}, 100);
	});	
	
	$('.searchInput').on( "keypress" , function(e) {
		if( e.which == 13 ){
			if($('.searchInput').val() != ""){
                searchpagenum = 0;
				$("#dosearch").trigger('click');
			}
			$(this).blur();
		}
	});
	
    $("#reload").click(function() {
        var entries=$('#entries .entriesnum').text();
        var flags = [];
        var reload = '/admin/log?';
        var count = 0;
        var searchpagenum=0;
        var search_type = $("#searchtype").val();
        var search_input = $(".searchInput").val();

        $('#checktype>button.active').each(function(index, item) {
            flags.push("type=" + $(item).val() + "&");
            count++;
        });

        for (var i = 0; i < flags.length; i++)
            reload = reload.concat(flags[i]);


        var attach = $('#attached>button.active').val();


        reload = reload.concat("entries=" + entries + "&page="+(numpage-1)+"&");

        var attachNum = $('#attached>button.active').length;
        var attach ='';

        if( attachNum == 0){
            reload = reload.concat("attach=no");
        } else if( attachNum == 1){
            attach = $('#attached>button.active').val();
            reload = reload.concat("attach="+attach);
        } else{
            reload = reload.concat("attach=all");
        }

        if(search_input){
            reload = reload.concat("&searchtype="+search_type+"&searchinput="+search_input);
        }

        //~ $('#page input').val(numpage + 1);
        logpage(reload);
    });
	
	
	$('#logtimestamp').on('click','li',function(){
		var selectedHtml = "<i class='glyphicon glyphicon-ok'></i>";
		var clickOption = $(this).attr('class');
		var optionText = $(this).text();
        var timeshowtype = $('#loglist .timeshowtype').text();
        if( clickOption == 'Timestamp' && timeshowtype!='Timestamp'){
            //~ show timestamp
            // $("#reload").trigger('click');
            $('#log_list tr').each(function(){
                var timestamp = $(this).children('td:first-child').attr('timestamp');
                $(this).removeAttr('timestamp');
                $(this).children('td:first-child').text(timestamp);
                //console.log(timeString);
            });
        }else if(clickOption == 'Date' && timeshowtype!='Date'){
            $('#log_list tr').each(function(){
                var timestamp = $(this).children('td:first-child').text();
                var timeString = trans_timestamp(parseInt(timestamp));
                //console.log(timestamp);
                //console.log(timeString);
                $(this).children('td:first-child').attr('timestamp',timestamp).html(timeString);
            });
        }
		$('#logtimestamp i').each(function(){ $(this).remove(); });
		$('#logtimestamp .' + clickOption ).find('a').append(selectedHtml);
		$('#logtimestamp .timeshowtype').text(clickOption);
		setting.timestampState= clickOption;
		window.localStorage.setItem('setting' , JSON.stringify(setting));
	});
	
   var numpage=1;
   var searchpagenum = 0;
   
    $("#Next").click(function() {
        if( numpage < parseInt($('#Page span').text()) ){
            numpage++;
        }  

        // console.log("Next:"+numpage);
        changePage(numpage);
    });


    $("#Previous").click(function() {
     
        if(numpage>1){
            numpage--;
        }

        // console.log("Previous:"+numpage);
        changePage(numpage);
    });

    $("#First").click(function() {
    
        numpage = 1;
        // console.log("First:"+numpage);
        changePage(numpage);
   
    });
    
    $("#Latest").click(function() {
        
        numpage = $('#Page span').text();
        // console.log("Latest:"+numpage);
        changePage(numpage);

       
    });
	
	$('#Page input').change(function(){
		var val = $(this).val();
		if( val >= 1 ){
			numpage = val - 1;
			changePage(numpage);
		} else{
			$(this).val(numpage+1);
		}
		$(this).blur();
	});

    $("#dosearch").click(function() {
        // alert("111");
        var search_type = $("#searchtype").val();
        var search_input = $(".searchInput").val();

        // var page = $('#page input').val();
		
		// if( search_input == ''){ return false ;}
        var page = 0;
        numpage = 1;
        //~ $('#page').empty();
        var entries=$('#entries .entriesnum').text();
        var flags = [];
        var reload = '/admin/log?';

        $('#checktype > button.active').each(function(index, item) {
            flags.push("type=" + $(item).val() + "&");
        });
        for (var i = 0; i < flags.length; i++){
            reload = reload.concat(flags[i]);
        }
            


        // if(searchpagenum){
        //     reload = reload.concat("entries=" + entries + "&page=" + (searchpagenum-1) + "&");
        // } else {
            reload = reload.concat("entries=" + entries + "&page=" + page + "&");
        // }
        

        var attachNum = $('#attached>button.active').length;
        var attach = '';

        if (attachNum == 0) {
            reload = reload.concat("attach=no");
        } else if (attachNum == 1) {
            attach = $('#attached>button.active').val();
            reload = reload.concat("attach=" + attach);
        } else {
            reload = reload.concat("attach=all");
        }
        if(search_input){
            reload = reload.concat("&searchtype=" + search_type + "&searchinput=" + search_input);
        } 
        
        logpage(reload);


    });

	$('#searchtype').on('change',function(){
		if( $('#searchtype').val() == 'Timestamp'){
			$('.searchInput').attr('placeholder','Start Time~ End Time');
		} else{
			$('.searchInput').attr('placeholder','Enter Key Word...');
		}
	
	});

    $("#setupdiv").hide();

    $("#setup").click(function() {
        console.log("toggle");
        $("#setupdiv").toggle();
    });

	$('#Page').on('click',function(){
		$('#Page input').focus().select();
	});

	$( "#Page" ).bind('mousewheel DOMMouseScroll', function(e) {
		var val = $('#Page input').val();
		var totalpage = parseInt($('#Page span').text());
		e.preventDefault();
		if (e.type == 'mousewheel') {
			if(e.originalEvent.wheelDelta > 0 ){val++;}
			else{val--;}
		}
		else if (e.type == 'DOMMouseScroll') {
			if(e.originalEvent.detail > 0 ){val++;}
			else{val--;}
		}
		
		if(val < 0 ){val = 0;}
		else if(val > totalpage){val = totalpage;}
		$('#Page input').val(val);
		$('#Page input').trigger('change');
	});


    function changePage(numpage){

        var page=numpage-1;      
        var entries=$('#entries .entriesnum').text();
        var search_type = $("#searchtype").val();
        var search_input = $(".searchInput").val();

        var flags = [];
        var reload='/admin/log?';

		$('#checktype > button.active').each(function(index, item){
			flags.push("type="+$(item).val()+"&");
		});
		for(var i = 0; i < flags.length; i++){
			reload=reload.concat(flags[i]);
		}
			
		reload = reload.concat("entries="+entries+"&page="+page+"&");

        var attachNum = $('#attached>button.active').length;
        var attach ='';

        if( attachNum == 0){
            reload = reload.concat("attach=no");
        } else if( attachNum == 1){
            attach = $('#attached>button.active').val();
            reload = reload.concat("attach="+attach);
        } else{
            reload = reload.concat("attach=all");
        }

        if(search_input){
            reload = reload.concat("&searchtype="+search_type+"&searchinput="+search_input);
        }

		logpage(reload);
    }



    function getCheckValue(className) {
        var buf = [];

        var str = 'input[class="' + className + '"]:checked';

        $(str).each(function(index, item) {
            buf.push($(item).val());
        });
        return buf;
    }

});
