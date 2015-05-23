$(document).ready(function() {
    // setTimeout("location.reload();",30000);
    // changepage();

    // function changepage() {　
      console.log("^^^^^^^^^^^^");
        $.ajax({
            type: 'GET',
            url: '/admin/rtcpage/list',
            success: function(data) {
                console.log("^^^^^^^^^^^^"+JSON.stringify(data));
                if(data.length){
                    data.forEach(function(member,index) {

                        $("#RTC_RoomList").append('<tr><td>' + (index+1) +
                            '</td><td class=Room'+(index+1)+'>'+
                            '</td><td class=Room'+(index+1)+'_member_1>' +
                            '</td><td class=Room'+(index+1)+'_member_2>' +
                            '</td><td class=Room'+(index+1)+'_time>' +
                            '</td></tr>');
                        var string='';
                        console.log(index);

                        member.forEach(function(value,index2) {
                              $('.Room'+(index+1)+'_member_'+(index2+1)+'').append(value);
                        });
                    });

                }
               
            }
        });
    // }
    
});

