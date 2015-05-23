$(document).ready(function() {
	$("#registform").submit(function() {
		//console.log("Register Start ["+$('#register_id').val()+"] secret1 ["+$('#password_1').val()+"] secret2 ["+$('#password_2').val()+"] name ["+$('#full_name').val()+"]");
		if($('#password_1').val() === $('#password_2').val()) {
			if($('#password_1').val().length) {
				console.log("password ok");

				var account = String($('#register_id').val());
				var atpos = account.indexOf("@");
				var dotpos=account.lastIndexOf(".");

				if (atpos<1 || dotpos < atpos+2 || dotpos+2>=account.length){
					console.log("Not a valid 111 e-mail address");
					$('#adminAddEmail').html('Not a valid e-mail address');
					return false;
				}
			}
		}else{
			console.log("password different!");
			$('#adminAddPassword').html('password different!');
			return false;
		}

		return true;
	});

	$("#giveup_register").click(function(event){
		event.preventDefault()
		history.back();
	});

	$('#register_id').bind('input', function() {
		$('#adminAddEmail').empty();
	});

	$('#password_2').bind('input', function() {
		$('#adminAddPassword').empty();
	});

	

});
