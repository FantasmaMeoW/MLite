$(document).ready(function() {

    

    $('#birthday').datepicker().on('changeDate', function(){ 
        $('#birthday').datepicker('hide');
    });

    $("#addemail").on("click",function(item) {
		var html = '<div class="row-fluid controls emailrow">'+
							'<label class="paddingLabel" ></label>'+
							'<select class="form-control selectRow">'+
							'<option>home</option><option>work</option><option>other</option>'+
							'</select><input type="text" class="form-control inputSelect emailinput">'+
							'<div type="button"  class="btn btn-danger btn_rm delemail">'+
							'<i class="glyphicon glyphicon-remove"></i></div></div>';
		
         $("#emailset").append(html );
    });
    $("#addphone").on("click", function(item) {
  		var html = '<div class="row-fluid controls emailrow">'+
							'<label class="paddingLabel" ></label>'+
							'<select class="form-control selectRow">'+
							'<option>mobile</option><option>home</option><option>office</option><option>other</option>'+
							'</select><input type="text" class="form-control inputSelect emailinput">'+
							'<div type="button"  class="btn btn-danger btn_rm delphone">'+
							'<i class="glyphicon glyphicon-remove"></i></div></div>';
		
         $("#phoneset").append(html );
    });
    $("#addaddress").on("click",function(item) {
  		var html = '<div class="row-fluid controls emailrow">'+
							'<label class="paddingLabel" ></label>'+
							'<select class="form-control selectRow">'+
							'<option>co</option><option>home</option><option>other</option>'+
							'</select><input type="text" class="form-control inputSelect emailinput">'+
							'<div type="button"  class="btn btn-danger btn_rm deladdress">'+
							'<i class="glyphicon glyphicon-remove"></i></div></div>';
		
         $("#addressset").append(html );
    });


     $("#addurl").on("click",function(item) {
  		var html = '<div class="row-fluid controls emailrow">'+
							'<label class="paddingLabel" ></label>'+
							'<select class="form-control selectRow">'+
							'<option>co</option><option>FB</option><option>other</option>'+
							'</select><input type="text" class="form-control inputSelect emailinput">'+
							'<div type="button"  class="btn btn-danger btn_rm delurl">'+
							'<i class="glyphicon glyphicon-remove"></i></div></div>';
		
         $("#urlset").append(html );
    });

    

    $("#emailset").on("click",".delemail",function(item) {
       
        $(this).closest('.row-fluid').remove();
    });

    $("#phoneset").on("click",".delphone",function(item) {
       
        $(this).closest('.row-fluid').remove();
    });

    $("#addressset").on("click",".deladdress",function(item) {
       
        $(this).closest('.row-fluid').remove();
    });

    $("#urlset").on("click",".delurl",function(item) {
       
        $(this).closest('.row-fluid').remove();
    });

	$('#changePwd').on('keyup',function(item){
		var newPwd = $('#changePwd').val();
		if( newPwd != '' ){
			$('#changePwdBtn').removeClass('disabled');
			if( item.which == '13' ){
				$('#changePwdBtn').trigger('click');
			}
			
		} else{
			$('#changePwdBtn').addClass('disabled');
		}
	});

    $('#savechange').on('click',function(item){
        var name = $('#name').val();
        var company = $('#company').val();
        var location = $('#location').val();
        var backupemail = $('#backupemail').val();
        var eamil=$('#useremail').val();
        var phone=$('#userphone').val();
        var address=$('#useraddress').val();
        var url=$('#userurl').val(); 
        var userid = $('#changePwdBtn').attr('userid'); 
        var year;
        var month;
        var day;

        var birthday = $('#birthday').val();


        if(birthday){
            birthday=birthday.split('/');
            year = Number(birthday[2]);
            month = Number(birthday[0]);
            day = Number(birthday[1]);
        } 

        var formData = {
            userid:userid,
            name: name,
            company: company,
            location : location,
            backupemail: backupemail,
            birthday_year: year,
            birthday_month: month,
            birthday_day: day,
            phone : phone

        };

        $.ajax({
            url: '/admin/profile/update',
            type: 'PUT',
            data: formData,
            dataType: 'json',
            timeout: 1000,
            success: function(data) {
                window.location.href='../userpage';
            },
            err:function(data){
            }
        });

    });


	$('#changePwdBtn').on('click',function(item){
		var newPwd = $('#changePwd').val();
        var userid = $('#changePwdBtn').attr('userid'); 
		var status;
		if( newPwd != '' ){
			if(confirm('Change?')){
                var formData = {
                    newPasswd:newPwd,
                    userMid:userid
                };
                // var formData_String = JSON.stringify(formData);
                $.ajax({
                    url: '/admin/profile/EditPasswd',
                    type: 'PUT',
                    data: formData,
                    dataType: 'json',
                    timeout: 1000,
                    success: function(data) {
                        var state = data.state;
                        console.log(data.state);
                        if(state==="update success"){
                            console.log("Change Success!");
                            $('#changPwdNotice strong').text('Changed');
                            status = 'alert-success';
                        }else{
                            console.log("Fail Wrong PassWord Format");
                            $('#changPwdNotice strong').text('Wrong...');
                            status = 'alert-danger';
                        }
                    },
                    err:function(data){
                        console.log("Fail");
                        $('#changPwdNotice strong').text('Fail...');
                        status = 'alert-danger';
                    }
                });

				
			} else{
				console.log("Deny");
				$('#changPwdNotice strong').text('Deny...');
				status = 'alert-danger';
			}
			$('#changPwdNotice').removeClass('alert-success alert-danger');
			$('#changPwdNotice').addClass(status).show();
			setTimeout(function() {
				$( '#changPwdNotice').fadeOut(800);
				setTimeout(function() { $( '#changPwdNotice').hide()} ,850);
			}, 1500);
		}
		
		$('#changePwd').val('');
	});

});
