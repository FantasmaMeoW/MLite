/*
 * Usage:
 *  put tag <input type='file' createsticker> in anywhere you wanted
 *
 */
function CreateSticker(dom){
    //initial createSticker constructor

    this.dom = dom;
}

CreateSticker.prototype.init = function(dom){
    //initial the given DOM sticker widget

    var self = this;
    $(document).on('change', 'input[type=file][createsticker]', function(event){
        var file = event.currentTarget.files[0];
        var src = event.currentTarget;
        console.log();
        if(typeof file === 'undefined'){
            return;
        }else if(!/(gif|jpe?g|png)$/i.test(file.type)){
            return;
        }else if(file.size === 0){
            return;
        }else{
            self.ImageConvert(file, src);
        };
    });

   //var queries = dom || this.dom || document.querySelectorAll('input[type=file][createsticker]');
   // var self = this;
   // for(var i=0;i<queries.length;i++){
   //     var que = queries[i];
   //     que.setAttribute('accept', 'image/*');
   //     que.addEventListener('change', function(event){
   //         //closure
   //         var file = event.target.files[0];
   //         var src = event.target;

   //         self.ImageConvert(file, src);
   //     });
   // }
}

CreateSticker.prototype.ImageConvert = function(file, src){
    //truely convert Image to thumbnail

    var self = this;

    //console.log('converting..');
    imgConverter(file, 128, function(base64){
        //console.log(base64);
        if(src.dispatchEvent){
            //if src is an event emitter, then fire the event
            var rEvent = new CustomEvent('convert',{
                detail: {
                    img: base64,
                    instance: this,
                },
                bubbles: true,
                cancelable: true,
            });
            src.dispatchEvent(rEvent);
        } else if(typeof src === 'function' ){
            //if src is a function, just let the function do what it should do
            src(base64);
        }
    });

}

CreateSticker.prototype.getSticker = function(){
    return this.canvas;
}

CreateSticker.prototype.dataURLtoBlob = function(dataURL){

    var binary = atob(dataURL.split(',')[1]);
    var array = [];

    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }

    return new Blob([new Uint8Array(array)], {type: 'image/png'});
}
