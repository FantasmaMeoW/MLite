$(document).ready(function() {
    // setTimeout("location.reload();",30000);

    var pages=sessionStorage.getItem("userpage");
    // var href = window.top.location.href;
    console.log(pages);
    // var hrefpage = href.split('/p');
    // var hrefquery=href.split('query=');
    // var hreftype=href.split('type=');
    
    var online_state;
    var type;
    var sort;
    
    var session_type = window.sessionStorage.getItem("sort_type");
    var session_state = window.sessionStorage.getItem("state", online_state);

    if(session_type){
       
        type=session_type.split(" ")[0];
        sort=session_type.split(" ")[1];
         
    } else {
        type='account';
        sort='ASC';
    }

    if (sort=="ASC") {
        var arror="glyphicon glyphicon-sort-by-alphabet";
    } else {
        var arror="glyphicon glyphicon-sort-by-alphabet-alt";
    }
    $('#'+type).addClass(sort);
    $('#'+type).find('i').addClass(arror)


    if(session_state){
        $('.dropdown-menu').find('span').remove();
        online_state=session_state;
        if(online_state=='online'){
            $('.Online a').append('<span class="glyphicon glyphicon-ok"></span>');
            $( '#online .onlineState').text('Online');
        } else if(online_state=='offline'){
            $('.Offline a').append('<span class="glyphicon glyphicon-ok"></span>');
            $( '#online .onlineState').text('Offline');
        } else {
            $('.AllState a').append('<span class="glyphicon glyphicon-ok"></span>');
            $( '#online .onlineState').text('All State');
        }
    } else {
        online_state='all';
    }
        
       
            // if( domClass == 'DESC'  ){
            //     domObj.addClass('ASC');
            //     domObj.find('i').addClass(arrorD);
            //     sort= 'ASC';
            // } else if( domClass == 'ASC' ){
            //     domObj.addClass('DESC');
            //     domObj.find('i').addClass(arrorU);
            //     sort= 'DESC';
            // } else{
            //     domObj.addClass('ASC');
            //     domObj.find('i').addClass(arrorD);
            //     sort= 'ASC';
            // }
    
    // var pages;
    var entries=10;

    // if(query){

    // }
    if(pages){
        // pages=hrefpage[1];
        // pages=pages.split("/");
        // pages=pages[0];
        // console.log(pages);
        changepage();
    } else {
        pages=1;
        // window.location="#userpage?page=1";
        changepage();
    }
   


    getusernum(online_state);
    
    function getusernum(online_state){
        $.ajax({
            type: 'GET',
            url: '/admin/usernum',
            success: function(data) {
                // totalpage =  parseInt(data[1]/10 +1);
                var totalpage =  (data[1] % 10 == 0) ? parseInt(data[1]/10) : parseInt(data[1]/10)+1;
                var online_page= (data[0] % 10 == 0) ? parseInt(data[0]/10) : parseInt(data[0]/10)+1;
                var offline_page = totalpage-online_page;

                if(online_state=='online'){
                    if(online_page==0){
                        $('#Page span').text(1); 
                    } else {
                        $('#Page span').text(online_page); 
                    }
                    
                } else if (online_state=='offline') {
                    $('#Page span').text(offline_page);
                } else {
                    $('#Page span').text(totalpage);
                }
                
                // console.log(totalpage);
                
                $('#statusInfo_on').html(data[0]);
                $('#statusInfo_off').html(data[1]-data[0]);
                $('#statusInfo_all').html(data[1]);
            }
        });
    }


	$('#toTop').hide();
    $(window).scroll(function(e){
		if( $('body').scrollTop() > 50 ){
			$('#toTop').show();
		} else{
			$('#toTop').hide();
		}
	});
	$('#toTop').on('click',function(e){
		$('body').animate({scrollTop:0});
	});

    $("#logState").on('click','#logOut',function(e){
		window.location.href="/logout";
    });

    $("#user_list").on('click','.removebutton',function(e){
        e.stopPropagation();
        var id = $(this).attr("id");
        var account = $(this).parents('tr').find('.td_account').text();
        deleteuser(id,account);
    });


    function deleteuser(userid,account) {　

        var id = userid;
        if (confirm("Delete Account ? \n\n"+account)) {
            $.ajax({
                type: 'DELETE',
                url: '/admin/userpage/' + id,
                success: function(data) {
                  $("#tr_" + id + "").remove();　　
                }
            });
        }
    }

    $("#user_title th i").click(function() {
        pages=1;
        var cstr=$(this).attr("class").split(" ");
        type=cstr[1];
        sort=cstr[2];

		console.log(type + ' '  +sort );
        if(type!='delete')
            changepage();
    });

	$("#reload").click(function() {
		changepage();
	});
	
	$('#online').on('click','.dropdown-menu li',function(item){
		var domObj = $(this).parents('.dropdown-menu');
		var domClass = $(this).attr('class');
		var domText = $(this).find('a').text();
		$('.dropdown-menu li').each(function(){
			$(this).find('span').remove();
		});
		domObj.find('.' + domClass + ' a').append('<span class="glyphicon glyphicon-ok"></span>');
		$( '#online .onlineState').text(domText);

        online_state= $( '#online .onlineState').text();

       
        if(online_state==='Offline'){
            online_state='offline'
        } else if (online_state==='Online'){
            online_state='online';
        } else {
            online_state='all';
        }
        console.log("state"+online_state);
        window.sessionStorage.setItem("state", online_state);
        pages=1;
        window.top.location="/admin/userpage";
        changepage();
	
	});
	$('#user_title').on('click','th',function(item){
		// pages=1;
		var allDom = $('#user_title>tr>th');
		var domObj = $(this);
		var domID = $(this).attr('id');
		var domClass = $(this).attr('class');
		var arrorD="glyphicon glyphicon-sort-by-alphabet";
		var arrorU="glyphicon glyphicon-sort-by-alphabet-alt";

		allDom.removeClass();
		allDom.find('i').removeClass();

		if(domID!='delete' && domID !='activitiesLog'
					&& domID !='online' && domID !='editUser'){
            type=domID;
			if( domClass == 'DESC'  ){
				domObj.addClass('ASC');
				domObj.find('i').addClass(arrorD);
				sort= 'ASC';
			} else if( domClass == 'ASC' ){
				domObj.addClass('DESC');
				domObj.find('i').addClass(arrorU);
				sort= 'DESC';
			} else{
				domObj.addClass('ASC');
				domObj.find('i').addClass(arrorD);
				sort= 'ASC';
			}
			console.log(type + ' '  +sort );
            window.sessionStorage.setItem("sort_type", type+' '+sort);
			changepage();
		}

	});

	
    $("#user_list").on('click','.td_log span' ,function(e){
		var jid= $(this).parents('tr').find('.td_jid').text();
        var account = $(this).parents('tr').find('.td_account').text();
        var name = $(this).parents('tr').find('.td_name').text();
        console.log(account);

		window.location =  "/admin/userLog/"+jid+"/"+account+"/"+name;
	});
	
    $("#user_list").on('click','.td_edit span' ,function(e){
        var id=$(this).parents('tr').attr("id");
        id=id.slice(3);

        var mongoid=$(this).attr("class");
        $(this).parents('tr').addClass('highlight').siblings().removeClass('highlight');
        window.location =  "/admin/userprofile/"+id;
    });
	
	$('#user_list').on('click','.td_authority li',function(){
		var parentDom = $(this).parents('.authoritytype');
		var selectedHtml = "<i class='glyphicon glyphicon-ok'></i>";
		var optionText = $(this).text();
		parentDom.find('i').each(function(){ $(this).remove(); });
		parentDom.find('.' + optionText + ' a' ).append(selectedHtml);
		parentDom.find('.user_authority').text(optionText);	
        var authtype=parentDom.find('.user_authority').text();
        var id=$(this).parents('.authoritytype').attr("id");
		//~ Todo: to conform box

        // check authority type if choice 'admin'  add memberid into ccMemberRole
        // else remove memberid from ccMemberRoleSSSS
        if(authtype==='admin'){
            $.ajax({
                url: '/admin/userauthority/'+ id ,
                type: 'PUT',

                success: function() {
                    console.log("Auth Change Success!!");
                },
            });
        }
        else{
            $.ajax({
                url: '/admin/userauthority/'+ id ,
                type: 'DELETE',

                success: function() {
                    console.log("Auth DELETE Success!!");
                },
            });
        }
        
	});  
	
    $("#user_list").on('click','.State',function(e){
        var state;
        e.stopPropagation();
        // id=id.slice(3);
        var id=$(this).parent().parent().attr('id');
        id=id.slice(3);

        // change state by click:  ENABLE-> DISABLE and ACTIVE-> DISABLE  so DISABLE->ENABLE otherwise ->DISABLE
        $(this).text(function(i, text){
            return text === "DISABLE" ? "ENABLE" : "DISABLE";
        });

        var state=$(this).text();

        if(state==='DISABLE'){
            state=1;
            $(this).removeClass('btn-primary'); //remove ENABLE class
            $(this).removeClass('btn-warning'); //remove ACTIVE class
            $(this).addClass('btn-danger');
        } else {
            state=-1;
            $(this).removeClass('btn-danger');
            $(this).addClass('btn-primary');
        }
        $.ajax({
            url: '/admin/userstate/'+ id + '/' + state ,
            type: 'PUT',

            success: function() {
                console.log("Change Success!!");
            },
        });
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
        // window.top.location="/admin#userpage?page="+pages+"&type="+type+"&query="+query+"";

        

        if($('.searchInput').val() != ""){
            $.ajax({
                type: 'GET',
                url: '/admin/userpage/' + type + '/' + query ,
                success: function(data) {
                   $("#user_list").empty();
                   totalpage =  parseInt(data[1].length/10 +1);
                   $('#Page span').text(totalpage);
                    data[2].forEach(function(item) {
                       var state_string='';

                        if(item.state>0)
                            state_string='<button type="button" class="btn btn-danger State"  >DISABLE</button>';
                        else if(item.state<0)
                            state_string='<button type="button" class="btn btn-primary  State"  >ENABLE</button>';
                        else
                            state_string='<button type="button" class="btn btn-warning  State"  >ACTIVE</button>';


                        var email;
                        if (item.email === 'null' || item.email === null) {
                            email = '';
                        } else {
                            email = item.email;
                        }
                                             
                         //~  if is user
						var user_authority = 'user';
                        var usertype='';
                        var admintype='';

                        if(item.role===0){
                            user_authority='admin';
                            admintype= '<i class="glyphicon glyphicon-ok"></i>';
                        } else {
                            usertype= '<i class="glyphicon glyphicon-ok"></i>';
                        }
						var authority = '<div class="btn-group authoritytype" id="'+item.ccMemberId+'">'+
                                                    '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'+
                                                    '<span class="user_authority">' + user_authority +'</span> <span class="caret"></span></button>'+
                                                    '<ul class="dropdown-menu" role="menu">'+
                                                    '<li class="user"><a href="#">user '+usertype+'</i></a></li>'+
                                                    '<li class="admin"><a href="#">admin'+admintype+'</a></li></ul></div>';
							
						var activitiesLog = '<span class="glyphicon glyphicon-list-alt"></span>';
						var editUser = '<span class="glyphicon glyphicon-edit"></span>';		
						
						$("#user_list").append('<tr id="tr_' + item.ccMemberId +
							'" class="'+item.mongo_id+'"><td class="onlineType" id="onlineType_' + item.ccMemberId +
							'"><button class="btn-default active btn btn-round onlineType">OFF</button>' +
							'</td><td class="td_account">' + item.account +
							'</td><td class="td_name">' + item.name +
							'</td><td class="td_jid">' + item.jid + 
							'</td><td>' + email+
							'</td><td class="td_edit">' + editUser+
							'</td><td class="td_log">' + activitiesLog+
							'</td><td class="td_authority">' + authority+
							'</td><td>' + state_string + 
							'<td><button class="btn btn-close btn-round removebutton" id="' + item.ccMemberId + '"><i class="glyphicon glyphicon-trash" id="' +item.id + '"></i></button></i></td></tr>');
                    });


                    data[0].forEach(function(item) {
                        $("#onlineType_"+item.memberid+"").empty();
                        $("#onlineType_"+item.memberid+"").append("<button class='btn btn-success btn-round onlineType'>ON</button>");
                    });
                    pages=1;
					$('#Page input').val(pages);
                }
            });
        }
    });

    $("#First").click(function() {
        pages=1;
        // window.location.href="#1234??";
        // window.location="/admin/userpage/p"+pages;
        sessionStorage.setItem("userpage", pages);
        changepage();
    });

    $("#Previous").click(function() {
        if(pages>1){
            pages--;
            sessionStorage.setItem("userpage", pages);   
			changepage();
            // window.top.location="/admin/userpage/p"+pages;            
        }
    });

    $("#Latest").click(function() {
        pages= $('#Page span').text();
        sessionStorage.setItem("userpage", pages);
        changepage();
        // window.location="/admin/userpage/p"+pages;
    });

    $("#Next").click(function() {
		if( pages < parseInt($('#Page span').text()) ){
			pages++;
            sessionStorage.setItem("userpage", pages);
			changepage();
            // window.location="/admin/userpage/p"+pages;
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
		var val = $('#Page input').val();
		var totalpage = parseInt($('#Page span').text());

		if( val >=1 && val <= totalpage){
			pages = val;
			changepage();              
		} else if( val > totalpage){
			pages = totalpage;
			changepage();
		} else if( val < 1 ){
			pages = 1;
			changepage();
		} else{
			 $('#Page input').val(pages);
		}
	});

   function changepage() {

       

        $.ajax({
            type: 'GET',
            url: '/admin/userpage/' + online_state + '/'+ type + '/' + sort + '/' + entries + '/' + pages,
            success: function(data) {
				// if this page ha no data, trigger click prev page
                $("#user_list").empty();
                if(type==='Online'){
                    totalpage =  parseInt(data[0].length/10 +1);
                    $('#Page input').val(pages);
                    $('#Page span').text(totalpage);
                } else {
                    getusernum(online_state);
                }
				if(  data[1].length > 0 ){
                    
                   
					data[1].forEach(function(item) {
						var state_string='';
						if(item.state>0){
							state_string='<button type="button" class="btn btn-danger State"  >DISABLE</button>';
						}
						else if(item.state<0){
							state_string='<button type="button" class="btn btn-primary  State"  >ENABLE</button>';
						 }
						else{
							state_string='<button type="button" class="btn btn-warning  State"  >ACTIVE</button>';
						}                    
						 $("#tr_"+item.id +' .data_state').empty();
						 $("#tr_"+item.id +' .data_state').append(state_string);

						var email;
						if (item.email === 'null' || item.email === null) {
							email = '';
						} else {
							email = item.email;
						}
						
                        //~  if is user
						var user_authority = 'user';
                        var usertype='';
                        var admintype='';

                        if(item.role===0){
                            user_authority='admin';
                            admintype= '<i class="glyphicon glyphicon-ok"></i>';
                        } else {
                            usertype= '<i class="glyphicon glyphicon-ok"></i>';
                        }
						var authority = '<div class="btn-group authoritytype" id="'+item.ccMemberId+'">'+
													'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'+
													'<span class="user_authority">' + user_authority +'</span> <span class="caret"></span></button>'+
													'<ul class="dropdown-menu" role="menu">'+
													'<li class="user"><a href="#">user '+usertype+'</i></a></li>'+
													'<li class="admin"><a href="#">admin'+admintype+'</a></li></ul></div>';
										
						var activitiesLog = '<span class="glyphicon glyphicon-list-alt"></span>';						
						var editUser = '<span class="glyphicon glyphicon-edit"></span>';						
									
						$("#user_list").append('<tr id="tr_' + item.ccMemberId +
							'" class="'+item.mongo_id+'"><td class="onlineType" id="onlineType_' + item.ccMemberId +
							'"><button class="btn-default active btn btn-round onlineType">OFF</button>' +
							'</td><td class="td_account">' + item.account +
							'</td><td class="td_name">' + item.name +
							'</td><td class="td_jid">' + item.jid + 
							'</td><td>' + email+
							'</td><td class="td_edit">' + editUser+
							'</td><td class="td_log">' + activitiesLog+
							'</td><td  class="td_authority">' + authority+
							'</td><td>' + state_string + 
							'<td><button class="btn btn-close btn-round removebutton" id="' + item.ccMemberId + '"><i class="glyphicon glyphicon-trash" id="' +item.id + '"></i></button></i></td></tr>');
					});

					data[0].forEach(function(item) {
						$("#onlineType_"+item.memberid+"").empty();
						$("#onlineType_"+item.memberid+"").append("<button class='btn btn-success btn-round onlineType'>ON</button>");
					});
					
					//~ $('#Page').append(pages);
					$('#Page input').val(pages);
				} else{
                    $('#Page input').val(1);
				}
            }
        });
    }

	$('#newMemberRow').on( "click", '.btn_rm' , function() {
		var domRow = $(this).parents('tr');
		if ( $('#newMemberRow tr').length >1 ){
			domRow.remove();
		} else if ( $('#newMemberRow tr').length == 1){
			domRow.find('input').val('');
		}
		
	});
	$('#newMemberRow').on( "click", '.btn_create' , function() {
		var domRow = $(this).parents('tr');
        var accountData = {
            email: domRow.find('.add_email').val(),
            password: domRow.find('.add_Password').val(),
            name: domRow.find('.add_Name').val(),
            company: domRow.find('.add_Company').val(),
            backupEmail: domRow.find('.add_BackupEmail').val()
        };
        var email='1';
        var name='2';

		
		if( domRow.find('.add_Password').val() == domRow.find('.add_ComfirmPassword').val() &&
										domRow.find('.add_email').val() != "" && domRow.find('.add_Password').val()!= ""){
			$.ajax({
				type: 'POST',
				url: '/admin/userpage/createpage',
				data: accountData,
				success: function(data) {
					showFeedbackMsg(accountData.email,  data[0] );

                    if(data[0]>0){
                        var state_string = '';
                        if (data[1][0].state > 0) {
                            state_string = '<button type="button" class="btn btn-danger State"  >DISABLE</button>';
                        } else if (data[1][0].state < 0) {
                            state_string = '<button type="button" class="btn btn-primary  State"  >ENABLE</button>';
                        } else {
                            state_string = '<button type="button" class="btn btn-warning  State"  >ACTIVE</button>';
                        }
                        // $("#tr_" + item.id + ' .data_state').empty();
                        // $("#tr_" + item.id + ' .data_state').append(state_string);

                        var email;
                        if (data[1][0].email === 'null' || data[1][0].email === null) {
                            email = '';
                        } else {
                            email = data[1][0].email;
                        }

                        //~  if is user
                        var user_authority = 'user';
                        var usertype = '';
                        var admintype = '';

                        if (data[1][0].role === 0) {
                            user_authority = 'admin';
                            admintype = '<i class="glyphicon glyphicon-ok"></i>';
                        } else {
                            usertype = '<i class="glyphicon glyphicon-ok"></i>';
                        }
                        var authority = '<div class="btn-group authoritytype" id="' + data[1][0].ccMemberId + '">' +
                            '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                            '<span class="user_authority">' + user_authority + '</span> <span class="caret"></span></button>' +
                            '<ul class="dropdown-menu" role="menu">' +
                            '<li class="user"><a href="#">user ' + usertype + '</i></a></li>' +
                            '<li class="admin"><a href="#">admin' + admintype + '</a></li></ul></div>';

                        var activitiesLog = '<span class="glyphicon glyphicon-list-alt"></span>';
                        var editUser = '<span class="glyphicon glyphicon-edit"></span>';


                        $("#user_list").prepend('<tr id="tr_' + data[1][0].ccMemberId +
                            '" class="' + data[1][0].mongo_id + '"><td class="onlineType" id="onlineType_' + data[1][0].ccMemberId +
                            '"><button class="btn-default active btn btn-round onlineType">OFF</button>' +
                            '</td><td class="td_account">' + data[1][0].account +
                            '</td><td>' + data[1][0].name +
                            '</td><td class="td_jid">' + data[1][0].jid +
                            '</td><td>' + email +
                            '</td><td class="td_edit">' + editUser +
                            '</td><td class="td_log">' + activitiesLog +
                            '</td><td  class="td_authority">' + authority +
                            '</td><td>' + state_string +
                            '<td><button class="btn btn-close btn-round removebutton" id="' + data[1][0].ccMemberId + '"><i class="glyphicon glyphicon-trash" id="' + data[1][0].id + '"></i></button></i></td></tr>');
                    }


                    
				},
			});
			if(  $('#newMemberRow tr').length > 1){
				domRow.remove();
			} else {
				domRow.find('input').val('');
			}
		} else{
			showFeedbackMsg(accountData.email, 3 );
		}
	});

	$('#addBlankRow').on( "keypress" , function(e) {
		if( e.which == 13 ){
			$('#doaddRow').trigger('click');
			$(this).blur();
		}
	});

	$('#doaddRow').on( "click" , function() {
		var row = $('#addBlankRow').val();
		if( row > 0  ){
			for(var i=0 ; i < row;i++){
				createMemberBlankRow();
			}

		}
	});

    $('body').on('click','.alert-success',function(){
        $(this).remove();         
        window.location.reload();
    });

	function createMemberBlankRow(){
		var newRow = '<tr><th style="width:19%"><input type="text" class="form-control add_email"  placeholder="Email" value=""/></th>'+
								'<th><input type="text" class="form-control add_Password" placeholder="Password" value=""/></th>'+
								'<th><input type="text" class="form-control add_ComfirmPassword"  placeholder="Comfirm Password" value=""/></th>'+
								'<th><input type="text" class="form-control add_Name" placeholder="Name" value=""/></th>'+
								'<th><input type="text" class="form-control add_Company"  placeholder="Company" value=""/></th>'+
								'<th><input type="text" class="form-control add_BackupEmail"  placeholder="BackupEmail" value=""/></th>'+
								'<th class="add_btn"  style="width: 115px" ><button type="submit" class="btn btn-success btn_create" > Create </button>'+
								'<div type="button" class="btn btn-danger btn_rm "><i class="glyphicon glyphicon-remove"></i></div></th></tr>';
		$('#newMemberRow').append(newRow);
	}
	
	function showFeedbackMsg(account,situation){
		var state ;
		var msg;
		
		if(  account.search('@')  > 0 ){
			var account_replace = account.replace("@","");
		}
		if(situation == 1){
			state = 'success';
			msg = 'Create Member :  < ' + account + ' > Success! Click to Reload.';
		} 	else if(situation == -1){
			state = 'danger';
			msg = 'Oops! Create Member: < ' + account + ' > Error !';
		} else{
			state = 'warning';
			msg = 'Please Input E-mail and Password ';
		}
		var alertbox = $('<div class="alert alert-dismissable alert-'+ state +' notice" style="display:none;">' +
							'<button type="button" class="close" data-dismiss="alert">×</button>'+
							'<strong>' + msg + '</strong></div>');

		$( '#userlist' ).before(alertbox);
		alertbox.fadeIn(800);

		setTimeout(function() {
			alertbox.fadeOut(800);
			setTimeout(function() {alertbox.remove()} ,850);
            if(situation==1){
                // window.location.reload();
            }
		}, 4000);
	}


});

