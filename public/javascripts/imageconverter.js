//load the binary file and translate it to base64
onmessage = function (oEvent) {
    try{
        var reader = new FileReaderSync();
    }catch(e){
        console.log(e);
        return;
    }
    /*
    reader.onload = function(event){
        var file = event.target;
        postMessage(file.result);
        self.close();
    }
    */
   postMessage(reader.readAsDataURL(oEvent.data));
   self.close();
};

function _convert_str(base64, size, callback){
    var image = new Image();

    image.onload = function(){
        var canvas = document.createElement('canvas');
        var big = image.width>image.height?image.width:image.height;
        var rate = big>size ? size/big : 1;

        canvas.width = rate*image.width;
        canvas.height = rate*image.height;
        var context = canvas.getContext('2d');

        context.drawImage(image,0,0, canvas.width, canvas.height);

        callback(canvas.toDataURL('image/png'));

        //callback(canvas.toDataURL('image/png', rate));
        //var str = canvas.toDataURL('image/jpeg', rate);

        //var icon = new Image();
        //icon.onload = function(){
        //    canvas.width = rate*canvas.width;
        //    canvas.height = rate*canvas.height;

        //    context.drawImage(icon, 0, 0, canvas.width, canvas.height);
        //    callback(canvas.toDataURL('image/png'));
        //}
        //icon.src = str;


    }

    image.src = base64;
}

function _convert_file(file, size, callback){
    var worker = new Worker('/javascripts/imageconverter.js');

    worker.addEventListener('message', function(event){
        imgConverter(event.data, size,function(base64){
            callback(base64);
        });
    });
    worker.postMessage(file);
}

function imgConverter(src, size, callback){
    if(typeof src === 'string'){
        _convert_str(src, size, callback);
    } else {
        _convert_file(src, size, callback);
    }
}
