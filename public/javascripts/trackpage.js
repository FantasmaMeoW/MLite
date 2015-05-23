$(document).ready(function() {


    $('#example').dataTable( {


        sAjaxSource : '/admin/log?type=DEBUG&type=INFO&type=WARN&type=ERROR&entries=100&page=0',
        bPaginate: false,
        bProcessing: true,
        sAjaxDataProp : '',
        bInfo: false,
        bDestroy: true,

        "aoColumns": [
          { "sTitle": "Timestamp",   "mData": "timestamp" ,"sWidth": "10%"},
          { "sTitle": "Type",  "mData": "type" ,"sWidth": "10%"},
          { "sTitle": "Category", "mData": "category","sWidth": "10%" },
          { "sTitle": "Message",  "mData": "msg" },
          { "sTitle": "Attach",    "mData": "attach","sWidth": "10%" }
        ]
    });

    $(".checktype").button();
    $("span").buttonset();

    $("#attach").button();
    $("#reload").button();
    $("#setup").button();
    $("#First").button();
    $("#save").button();
    $(".changepage").button();
    $(".changepage").buttonset();



    $("#selectabletype").bind("mousedown", function(e) {
        e.metaKey = true;
    }).selectable();


    var selected;

    $("#selectabletype").selectable({
        stop: function() {

             selected = $(this).children('.ui-selected');

        }
    });




    $("#reload").click(function() {

        var entries=$('#entries').val();
        var flags = [];
        var reload='/admin/log?';

        $('input[name="checktype"]:checked').each(function(index, item){
            flags.push("type="+$(item).val()+"&");
        });

        for(var i = 0; i < flags.length; i++)
            reload=reload.concat(flags[i]);


        var attach = $('input[name="attached"]:checked').val();


        reload = reload.concat("entries="+entries+"&page=0&");

        if (attach)
            reload = reload.concat("attach=true");
        else
            reload = reload.slice(0, Number(reload.length - 1));


        console.log(reload);

        var oTable = $('#example').dataTable();
        oTable.fnReloadAjax(reload);
    });


   var numpage=0;

    $("#Next").click(function() {

        numpage++;
        var flags = [];
        var reload='/admin/log?';
        var entries=$('#entries').val();

        $('input[name="checktype"]:checked').each(function(index, item){
            flags.push("type="+$(item).val()+"&");
        });
        for(var i = 0; i < flags.length; i++)
            reload=reload.concat(flags[i]);

        var attach = $('input[name="attached"]:checked').val();


        reload = reload.concat("entries="+entries+"&page="+numpage+"&");

        if (attach)
            reload = reload.concat("attach=true");
        else
            reload = reload.slice(0, Number(reload.length - 1));


        console.log(reload);

        var oTable = $('#example').dataTable();
        oTable.fnReloadAjax(reload);
    });


    $("#Previous").click(function() {
        if(numpage>0)
        numpage--;
        var entries=$('#entries').val();
        var flags = [];
        var reload='/admin/log?';
        $('input[name="checktype"]:checked').each(function(index, item){
                  flags.push("type="+$(item).val()+"&");
              });
        for(var i = 0; i < flags.length; i++)
            reload=reload.concat(flags[i]);

        var attach = $('input[name="attached"]:checked').val();


        reload = reload.concat("entries="+entries+"&page="+numpage+"&");

        if (attach)
            reload = reload.concat("attach=true");
        else
            reload = reload.slice(0, Number(reload.length - 1));


        console.log(reload);

        var oTable = $('#example').dataTable();
        oTable.fnReloadAjax(reload);
    });

    $("#First").click(function() {
        numpage=0;
        var flags = [];
        var reload='/admin/log?';
        var entries=$('#entries').val();

        $('input[name="checktype"]:checked').each(function(index, item){
                  flags.push("type="+$(item).val()+"&");
              });
        for(var i = 0; i < flags.length; i++)
            reload=reload.concat(flags[i]);

        var attach = $('input[name="attached"]:checked').val();


        reload = reload.concat("entries="+entries+"&page="+numpage+"&");

        if (attach)
            reload = reload.concat("attach=true");
        else
            reload = reload.slice(0, Number(reload.length - 1));


        console.log(reload);

        var oTable = $('#example').dataTable();
        oTable.fnReloadAjax(reload);
    });

    $(".entriesoption").click(function(){

        numpage=0;
        var flags = [];
        var reload='/admin/log?';
        var entries=$('#entries').val();
        $('input[name="checktype"]:checked').each(function(index, item){
                  flags.push("type="+$(item).val()+"&");
              });
        for(var i = 0; i < flags.length; i++)
            reload=reload.concat(flags[i]);

        var attach = $('input[name="attached"]:checked').val();


        reload = reload.concat("entries="+entries+"&page=0&");

        if (attach)
            reload = reload.concat("attach=true");
        else
            reload = reload.slice(0, Number(reload.length - 1));


        console.log(reload);

        var oTable = $('#example').dataTable();
        oTable.fnReloadAjax(reload);

    })


    function getCheckValue(className) {
        var buf = [];

        var str ='input[class="' + className + '"]:checked';

        $(str).each(function(index, item) {
            buf.push($(item).val());
        });
        return buf;
    }


    $("#save").click(function() {

        var config = {
            type : getCheckValue("display_type"),
            level: Number(getCheckValue("display_level")[0])
        };

        // console.log(JSON.stringify(config));
        

        $.ajax({
                type: 'PUT',
                data: config,
                dataType: 'JSON',
                url: '/admin',
                success: function(data) {
                    $("#setupdiv").toggle();
                }

            });

     });

    //
/*
     profile = profile.concat(jemail + jphone + jaddress + jurl + jbirthday + '}');

            $.ajax({
                type: 'POST',
                data: profile,
                contentType: 'application/json',
                url: '/admin',
                success: function(data) {
                    window.location = data.redirect;
                    console.log('success');
                    console.log(JSON.stringify(profile));
                }

            });
*/

    $("#setupdiv").hide();

   $("#setup").click(function() {
        console.log("toggle");
        $("#setupdiv").toggle();


     });
/*        $('#setup').click(function(){
            var elem = $("#setuptoolbar")[0];
        if(elem.style.display == 'none')
             $("#setuptoolbar").show();
        else
        {
             $("#setuptoolbar").hide();
}
        });*/


});
