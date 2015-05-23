$(document).ready(function() {


    var today = new Date();
    var day = today.getTime();
    var todaystring=today.toDateString();      
    var pages=0;
    var entries=30;
    var start=0;
    var end=0;
    // var startDate = new Date(s_year,s_mon,s_day);
    // var endDate = new Date(e_year,e_mon,e_day);
    $('#date-start').datepicker().on('changeDate', function(ev){ 
        setTimeout(function(){$("#datealert").empty();},5000);
        
        var origin=$("#date-start").text();
        var end=$("#date-end").text();
        
        // var startDate = new Date(syear,smon,sday);
        var endDate = new Date(end); 
       
        $("#date-start").empty();
        if (ev.date.valueOf() > endDate){
            console.log('The start date must be before the end date.');
            $("#datealert").html('The start date must be before the end date.');
            $("#date-start").append(origin);
        } else {
            $('#alert').hide();                
            startDate = new Date(ev.date);            
            $('#date-start').append($('#date-start').data('date'));                   
            start=ev.date.valueOf(); 
            //console.log($('#date-start').data('date'));          
            
        }
        $('#date-start').datepicker('hide');

    });
    $('#date-end').datepicker().on('changeDate', function(ev){
        setTimeout(function(){$("#datealert").empty();},5000);

        var origin=$("#date-end").text();
        var start=$("#date-start").text();

        var startDate = new Date(start);   
        
        $("#date-end").empty();
        if (ev.date.valueOf() < startDate){
            console.log('The end date must be after the start date.');
            $("#datealert").html('The end date must be after the start date.');
             $("#date-end").append(origin);
        } else {
            $('#alert').hide();
            endDate = new Date(ev.date);
            $('#date-end').append($('#date-end').data('date'));  
            end=ev.date.valueOf();
        }
        $('#date-end').datepicker('hide');
    });

    var type='active';

        
    changepage(); 

    $('#selecttype li').click(function(){

        today = new Date();
        todaystring=today.toDateString();

        $(".fileadd").empty();
        $("#fileinformation").empty();
        $("#date-start").empty();
        $("#date-end").empty();
        $("#filelist").empty();
        
        start=0;
        end=0;     
        pages=0;
        type=$(this).text();
        type=type.toLowerCase();
        
        if(type==='booking'&&start==0&&end==0){
            
           
            var sday=todaystring.split(' ');
            var s_year=sday[3];
            var s_mon=today.getMonth()+1;
            var s_day=sday[2];

            today.setDate(today.getDate()+3);
            var endstring=today.toDateString();

            var eday=endstring.split(' ');

            var e_year=eday[3];
            var e_mon=today.getMonth()+1;
            var e_day=eday[2];

            $("#date-start").append(s_year+'-'+s_mon+'-'+s_day);
            $("#date-end").append(e_year+'-'+e_mon+'-'+e_day);

            start=new Date($("#date-start").text());
            start=start.getTime()
            end=new Date($("#date-end").text());
            end=end.getTime();            
        }
        if(type==='closed'&&start==0&&end==0){
           
            var eday=todaystring.split(' ');
            var e_year=eday[3];
            var e_mon=today.getMonth()+1;
            if (e_mon<10)
                        e_mon='0'+e_mon; 
            var e_day=eday[2];

            today.setDate(today.getDate()-3);
            var startstring=today.toDateString();

            var sday=startstring.split(' ');

            var s_year=sday[3];
            var s_mon=today.getMonth()+1;
            if (s_mon<10)
                        s_mon='0'+s_mon; 
            var s_day=sday[2];

            $("#date-start").append(s_year+'-'+s_mon+'-'+s_day);
            $("#date-end").append(e_year+'-'+e_mon+'-'+e_day);

            start=new Date($("#date-start").text());
            start=start.getTime()
            end=new Date($("#date-end").text());
            end=end.getTime();
        }        
         
           
        
        
        var toggle = document.getElementById("setupdate"); 

        if(type==='booking'||type==='closed')
             toggle.style.visibility = 'visible';            
        else if(type==='active')
            toggle.style.visibility = 'hidden';

        changepage();
            
    });


    $("#First").click(function() {   
        pages=0;        
        changepage();                     
    });

    $("#Previous").click(function() {
        if(pages>0)
            pages--;   
        changepage();            
    });

    $("#Next").click(function() {
        pages++;   
        changepage();              
    });

    $("#reload").click(function(){
        changepage();
    });

    $("#room_list").on('click','tr' ,function(){
        $("#filelist").empty();
        $(".fileadd").empty();
        // $("#fileinformation").empty();
        var id=$(this).attr("class");        
        id=id.split(' ');
        var type=$('.td_'+id+'').text(); 
      
        loadRoomfile(id[0],type);

        $(this).addClass('highlight').siblings().removeClass('highlight');
        
    });

    $("#room_list").on('click','.removebutton',function(e){
        e.stopPropagation();
        var id = $(this).attr("id");
        var state=$(".td_"+id).text();
        state=state.slice()
        
        if(state==='booking')
            ChangeBookingType(id);         
        else            
            ChangeActiveType(id);
                          
    });


    $("#room_list").on('click','.icon-plus',function(e){
         e.stopPropagation();   
    }); 

    $("#room_list").on('click','form',function(e){
        e.stopPropagation();       
    }); 

    $(".fileadd").on('change','input.uploadfile',function(e){
        console.log($(e.target).parent().parent().parent());
        $(e.target).parent().parent().parent().ajaxSubmit({
            success: function(data){
                loadRoomfile(data);
            },
            error: function(){
                console.log('error');
            }
        });
    });



    $("#filelist").on('click','.image' ,function(){       
        var uuid= $(this).children().attr("id");
        var id= $(this).children().attr("class");
        id=id.split(' ');
        var type=$('.td_'+id[1]+'').text();      

        if(type!='closed')
            $('.'+uuid+'_trash').toggle();

        
        $(".information_empty").empty();

        var filename= $('#span3_'+uuid+'').text();

        var information= $(this).children().attr("class");
        information=information.split(' ');

        var size=information[2];
        var year=information[3];
        var month=information[4];
        var date=information[5];
        var hour=information[6];
        var minute=information[7];

        $("#information_title").append('<tr><th style="width: 35%">File Name</th><th style="width: 15%">Upload Date</th><th style="width: 15%">Upload Time</th><th style="width: 15%">Size</th></tr>');
        $("#information_content").append('<tr><td>'+filename+'</td><td>'+year+'-'+month+'-'+date+'</td><td>'+hour+':'+minute+'</td><td>'+size+'MB</td></tr>');
 
    });


    

    $("#filelist").on('click','button' ,function(){

        var id= $(this).attr("id");                  
        var uuid=$(this).children().attr("id");
        
        confirmChoice(id,uuid); 
    });

    function loadRoomfile(roomid,type){
        $(".fileadd").empty();
        $(".information_empty").empty();
        $("#filelist").empty();

        var id=roomid;
        var type=type;

        
        $.ajax({
            type:'GET',
            url:'/admin/roompage/file/'+id,
            timeout: (5 * 1000), 
            success:function(data){

                var rownum=parseInt(data.length/4);

                if(data.length%4!=0)
                    rownum++;
                console.log(rownum);

                for(i=0;i<rownum;i++)
                    $("#filelist").append('<div class="box-content row-fluid sortable" id="row'+i+'"></div>');

                if(type!='closed')
                    $(".fileadd").append('<form action="/ccr/resource/'+id+'" method="POST" enctype="multipart/form-data"><span class="btn btn-close btn-round addbutton" id="'+id+'"><i class="icon-plus"><input type="FILE" name="filename" class="input-small uploadfile" /></i></span></form>');





                data.forEach(function(item,index){
                var filetype=item.metadata;

                var meta=filetype.split(' ');
                console.log(meta[0]);

                var metasize=meta[1]/1048576;
                var size = Math.pow(10, 2);
                metasize=Math.round(metasize*size)/size;


                var str = String(meta[2]);
                var trans = new Date();
                trans.setTime(str);
                var year=trans.getFullYear();
                var month=trans.getMonth()+1;
                if (month<10)
                        month='0'+month;   
                var date=trans.getDate();
                if (date<10)
                        date='0'+date;   
                var hour=trans.getHours();
                if (hour<10)
                        hour='0'+hour; 
                var minute=trans.getMinutes();
                if (minute<10)
                        minute='0'+minute; 

                var findpdf=filetype.search("pdf");
                var findtext=filetype.search("text");
                var findms=filetype.search("ms");

                var row=parseInt(index/4);

                if(findpdf>0)
                    $("#row"+row+"").append('<div class="span3 '+id+'" id="span3_'+item.uuid+'"><div class="image"><input type="image"  src="/images/pdf.jpg" class="size '+id+' '+metasize+' '+year+' '+month+' '+date+' '+hour+' '+minute+'" id="'+item.uuid+'"/></div><div class="'+item.uuid+'_trash trash" style="display:none"><button class="btn btn-close btn-round" id="'+id+'"><i class="icon-trash " id='+item.uuid+'></i></button></div><div style="text-overflow:ellipsis" class="ovf">'+item.name+'</div></div>');

                else if(findtext>=0)
                    $("#row"+row+"").append('<div class="span3 '+id+'" id="span3_'+item.uuid+'"><div class="image"><input type="image"  src="/images/txt.png" class="size '+id+' '+metasize+' '+year+' '+month+' '+date+' '+hour+' '+minute+'" id="'+item.uuid+'"/></div><div class="'+item.uuid+'_trash trash" style="display:none"><button class="btn btn-close btn-round" id="'+id+'"><i class="icon-trash " id='+item.uuid+'></i></button></div><div style="text-overflow:ellipsis" class="ovf">'+item.name+'</div></div>');
                else if(findms>0)
                    $("#row"+row+"").append('<div class="span3 '+id+'" id="span3_'+item.uuid+'"><div class="image"><input type="image"  src="/images/ms.jpg" class="size '+id+' '+metasize+' '+year+' '+month+' '+date+' '+hour+' '+minute+'" id="'+item.uuid+'"/></div><div class="'+item.uuid+'_trash trash" style="display:none"><button class="btn btn-close btn-round" id="'+id+'"><i class="icon-trash " id='+item.uuid+'></i></button></div><div style="text-overflow:ellipsis" class="ovf">'+item.name+'</div></div>');
                else
                    $("#row"+row+"").append('<div class="span3 '+id+'" id="span3_'+item.uuid+'"><div class="image"><input type="image"  src="/images/other.jpg" class="size '+id+' '+metasize+' '+year+' '+month+' '+date+' '+hour+' '+minute+'" id="'+item.uuid+'"/></div><div class="'+item.uuid+'_trash trash" style="display:none"><button class="btn btn-close btn-round" id="'+id+'"><i class="icon-trash " id='+item.uuid+'></i></button></div><div style="text-overflow:ellipsis" class="ovf">'+item.name+'</div></div>');
                 });                
             }
         });
    }

    function confirmChoice(roomid,uuid){　 
        var id=roomid;
        var uuid=uuid;
        if ( confirm ("Delete File?") ){
            $.ajax({
                type:'DELETE',
                url:'/admin/roompage/'+id+'/'+uuid, 
                timeout: (5 * 1000), 
                success:function(data){ 

                }
            });           
            loadRoomfile(id); 
            $(".information_empty").empty();           
        }   　　     
     }

    function ChangeBookingType(roomid) {　
        var id = roomid;
        if (confirm("Cancel this room?")) {
            $.ajax({
                type: 'DELETE',
                url: '/admin/roompage/' + id,
                timeout: (5 * 1000), 
                success: function(data) {
                    $("#tr_" + id + "").remove();
                    $("#filelist").empty();
                }
            });
        }　　
    }

    function ChangeActiveType(roomid) {　
        var id = roomid;
        if (confirm("Closed This Room?")) {
            $.ajax({
                type: 'PUT',
                url: '/admin/roompage/' + id,
                timeout: (5 * 1000), 
                success: function(data) {
                    $("#tr_" + id + "").remove();
                    $("#filelist").empty();
                }
            });
        }　　
    }

    function changepage() {
        $(".information_empty").empty();
        $("#filelist").empty();

        $.ajax({
            type: 'GET',
            url: '/admin/roompage/' + type + '/' + start + '/' + end + '/' + entries + '/' + pages,
            timeout: (1 * 1000), 
            success: function(data) {                
                $("#room_list").empty();
                $("#room_title").empty();
                 if(data.length){

                        if (data[0].state === 'active')
                            $("#room_title").append('<tr><th style="width: 10%">State</th><th style="width: 15%">Start</th><th style="width: 15%">End</th><th style="width: 20%">Title</th><th style="width: 20%">ID</th><th style="width: 10%"">Closed</th></tr>');
                        else if (data[0].state === 'booking')
                            $("#room_title").append('<tr><th style="width: 10%">State</th><th style="width: 15%">Start</th><th style="width: 15%">End</th><th style="width: 20%">Title</th><th style="width: 20%">ID</th><th style="width: 10%"">Cancel</th></tr>');
                        else
                            $("#room_title").append('<tr><th style="width: 10%">State</th><th style="width: 15%">Start</th><th style="width: 15%">End</th><th style="width: 20%">Title</th><th style="width: 20%">ID</th></tr>');

                        data.forEach(function(item) {
                            var start = new Date(item.starttime);
                            var startyear = start.getFullYear();
                            var startmonth = start.getMonth() + 1;
                            if (startmonth<10)
                                startmonth='0'+startmonth;                   
                            var startday = start.getDate();
                            if(startday<10)
                                startday='0'+startday;

                            // var sstring=start.toDateString();
                            // sstring=sstring.split(' ');
                            // startday=sstring[2];


                            var end = new Date(item.endtime);
                            var endyear = end.getFullYear();
                            var endmonth = end.getMonth() + 1;
                            if (endmonth<10)
                                endmonth='0'+endmonth;
                            var endday = end.getDate();
                            if(endday<10)
                                endday='0'+endday;

                            // var estring=end.toDateString();
                            // estring=estring.split(' ');
                            // endday=estring[2];

                            if (item.state === 'active' || item.state === 'booking') {
                                $("#room_list").append('<tr id="tr_' + item._id + '" class="' + item._id +
                                    '"><td class="td_' + item._id + '">' + item.state + '</td><td>' + startyear +
                                    '-' + startmonth + '-' + startday + '</td><td>' + endyear + '-' + endmonth +
                                    '-' + endday + '</td><td>' + item.meeting.topic + '</td><td>' + item._id +
                                    '</td><td><button class="btn btn-close btn-round removebutton" id="' + item._id + '"><i class="icon-remove" id="' + item._id + '"></i></button></i></td></tr>');
                            } else {
                                $("#room_list").append('<tr id="tr_' + item._id + '" class="' + item._id + '"><td class="td_' + item._id + '">' + item.state + '</td><td>' + startyear + '-' + startmonth + '-' + startday + '</td><td>' + endyear + '-' + endmonth + '-' + endday + '</td><td>' + item.meeting.topic + '</td><td>' + item._id + '</td></tr>');
                            }

                        });
                    }

                 }

                
        });
    };
    
});

