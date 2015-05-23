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
	$("#recoveryform").submit(function(){
		if($("#recovery_pass1").val() === $("#recovery_pass2").val()){
			if(checkPasswdFormat($("#recovery_pass1").val())) {
				console.log("rescue password ok");
			}else{
                console.log("password must be more than 8 and have alphabet & numeric!");
                // alert("password must be more than 8 and have alphabet & numeric!");
                return false;
			}
		}else{
            // alert("password different!");
            console.log("password different!");
            return false;
		}
		return true;
	});

	$("#recovery_pass1").blur('input', function() {
		$('#alertRecoveryPassword1').empty();
		$('#alertRecoveryPassword2').empty();
		$('#alertRecoveryPassword1').css("color","red");
		if(!checkPasswdFormat($("#recovery_pass1").val())){
			$('#alertRecoveryPassword1').append(
				"Password must contain alphabet & numeric and length > 8");
		}else if(!checkPasswdStrength($("#recovery_pass1").val())){
			$('#alertRecoveryPassword1').css("color","green");
			$('#alertRecoveryPassword1').append(
				"Weakly password! Suggest contain at least one uppercase charaters"+
				",lowercase characters,numeric values and special characters");
		}
	});

	$("#recovery_pass2").blur('input', function() {
		$('#alertRecoveryPassword2').empty();
		if($("#recovery_pass1").val() !== $("#recovery_pass2").val()){
			$('#alertRecoveryPassword2').append("Password are different");
		}else{
			$('#alertRecoveryPassword2').empty();
		}
	});
});
