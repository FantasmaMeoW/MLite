function checkPasswdFormat(passwd){
    var validate2 =/((?=.*\d)(?=.*[A-Za-z]).{8,})/;
    console.log(validate2.test(passwd));
    if(validate2.test(passwd)){
        return true;
    }else{
        return false;
    }
};

function checkPasswdStrength(passwd){
	var validate2 =/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&_+=-]).{8,})/;
    console.log(validate2.test(passwd));
    if(validate2.test(passwd)){
        return true;
    }else{
        return false;
    }
};

$(document).ready(function() {
	$("#registform").submit(function() {
		//console.log("Register Start ["+$('#register_id').val()+"] secret1 ["+$('#password_1').val()+"] secret2 ["+$('#password_2').val()+"] name ["+$('#full_name').val()+"]");
		if($('#password_1').val() === $('#password_2').val()) {

			if(checkPasswdFormat($('#password_1').val())) {

				console.log("password ok");

				var account = String($('#register_id').val());
				var atpos = account.indexOf("@");
				var dotpos=account.lastIndexOf(".");

				if (atpos<1 || dotpos < atpos+2 || dotpos+2>=account.length){
					$('#alertAccount').html('Not a valid e-mail address');
					return false;
				}
			}
			else{

				// $('#alertPassword').append("password must be more than 8 and have alphabet & numeric!");
				// console.log("password must be more than 8 and have alphabet & numeric!");
				return false;
			}

		}else{
			$('#alertPassword2').html("Password are different");
			return false;
		}
		return true;
	});

	$("#giveup_register").click(function(event){
		// event.preventDefault();
		// history.back();
	});

	$('#register_id').bind('input', function() {
		$('#alertAccount').empty();
	});

	$('#password_1').bind('input', function() {
		$('#password_2').val('');
		$('#alertPassword').empty();
	});


	$('#register_id').blur('input', function() {
		var account=$('#register_id').val();
		if(account){
			$.ajax({
		      	type: 'GET',
	            url: '/register/search/'+account,
		       	success: function(d){
		       		console.log("success");
		             $('#alertAccount').html("Someone already has that register Email. Try another?");
		       	}
		    });
		}

	});

	// $('#password_1').blur('input', function() {
	// 	$('#alertPassword').empty();
	// 	$('#alertPassword2').empty();

	// 	var password=$('#password_1').val();
	// 	var password2=$('#password_2').val();

	// 	validate = /[A-Za-z]/;
	// 	// && validate.test($('#password_1').val())
	// 	if($('#password_1').val().length<8) {
	// 		$('#alertPassword').append("Password Length must > 8 ");
	// 	}
	// 	else if(!validate.test(password)){
	// 		$('#alertPassword').append('Must have alphabet');
	// 	}
	// 	else if(password!==password2) {
	// 		$('#alertPassword2').append("Password are different");
	// 	}
	// 	else
	// 		$('#alertPassword2').empty();
	// });
	$('#password_1').blur('input', function() {
		$('#alertPassword').empty();
		$('#alertPassword2').empty();

		var password=$('#password_1').val();
		$('#alertPassword').css("color","red");

		validate = /[A-Za-z]/;
		// && validate.test($('#password_1').val())
		validate3 = /[0-9]/;

		if($('#password_1').val().length<8) {
			$('#alertPassword').append("Password Length must > 8 ");
		}
		else if(!validate.test(password)){
			$('#alertPassword').append('Must have alphabet');
		}
		else if(!validate3.test(password)){
			$('#alertPassword').append('Must have numeric');
		}
		//else if(!validate2.test(password)){
		else if(!checkPasswdStrength(password)){
			$('#alertPassword').css("color","green");
			$('#alertPassword').append(
			'Weakly password! Suggest contain at least one uppercase charaters'+
			',lowercase characters,numeric values and special characters');
		}
	});

	$('#password_2').blur('input', function() {
		$('#alertPassword2').empty();

		var password=$('#password_1').val();
		var password2=$('#password_2').val();
		if(password!==password2) {
			$('#alertPassword2').append("Password are different");
		}
		else
			$('#alertPassword2').empty();


	});

});
