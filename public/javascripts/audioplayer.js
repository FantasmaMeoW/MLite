/*
 * name:AudioPlayer
 *      init
 *      play
 *      stop
 *      clean
 */
window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.context = new AudioContext();
function AudioPlayer(){
//    this.context = null;
    this.bufferList = null;
    this.sources = null;
    this.urlList = null;
    this.context = window.context;
    this._on = {};
    this._once = {};
}

/*
 * name: init
 *   parameter - urlList - audio urls
 */
AudioPlayer.prototype.init = function(urlList){
    this.urlList = urlList;
    var self = this;

    var bufferLoader = new BufferLoader(this.context, urlList, function(bufferList){
        self.bufferList = bufferList;
        self.sources = new Array(bufferList.length);
    });

    bufferLoader.load();
    this.bufferLoader = bufferLoader;
}

/*
 * name: play
 *  parameter - track - the number of audio input by urlList in init function
 *              doLoop - boolean of doing loop
 */
AudioPlayer.prototype.play = function(track, doLoop, onEnd){
    var bufferList = this.bufferList;
    var sources = this.sources;
    var context = this.context;
    var self = this;
    if(typeof track === 'string'){
        track = this.urlList.indexOf(track);
    }

    if(bufferList[track] && !sources[track]){
        var source = context.createBufferSource();

        source.buffer = bufferList[track];
        source.connect(this.context.destination);
        source.loop = doLoop || false;
        source.onended = function(){
            self.clean(track);
            self.trigger('stop', track);
            if(typeof onEnd === 'function'){
                onEnd();
            }
        };

        source.start(0);

        this.sources[track] = source;
        this.trigger('play');

        console.log('play track ' + track);

    } else {
        console.log('track: %s is not defined nor is playing',track);
    }
}
/*
 * name: stop
 *  param: track - stop the number of audio in urlList
 */
AudioPlayer.prototype.stop = function(track){
    if(typeof track == 'string'){
        track = this.urlList.indexOf(track);
    }
    var sources = this.sources;
    if(sources[track]){
        sources[track].stop(0);
        //this.trigger('stop');
        console.log('stop track #' + track);
    } else {
        //console.log('track: #%s is not defined',track);
    }
   // this.clean(track);
}

AudioPlayer.prototype.clean = function(track){
    this.sources[track] = null;
    console.log('close track #%s',track);
}

AudioPlayer.prototype.add = function(url){
    if(this.urlList.indexOf(url) >= 0){
        return true;
        //don't reload
    }
    var self = this;
    var oldBufferList = this.bufferList;
    this.urlList.push(url);
    this.bufferLoader.urlList = [url];
    this.bufferLoader.onload = function(bufferList){
        self.bufferList = oldBufferList.concat(bufferList);
        self.sources = self.sources.concat(new Array(bufferList.length));
        self.trigger('add');
    }
    this.bufferLoader.load();
}

AudioPlayer.prototype.on = function(event, cb){
    if(this._onr[event]){
        this._on[event].push(cb);
    } else {
        this._on[event] = [cb];
    }
}

AudioPlayer.prototype.once = function(event, cb){
    if(this._once[event]){
        this._once[event].push(cb);
    } else {
        this._once[event] = [cb];
    }
}

/*
 *  trigger
 *       arguments:
 *          event
 *           [ars]
 *       example:
 *          player.trigger('play', arg1, arg2);
 *          player.trigger('stop', arg1, arg2);
 *
 */
AudioPlayer.prototype.trigger = function(){
    var args = Array.prototype.slice.call(arguments);
    var event = args.shift();
    var cbs = this._on[event];
    var self = this;
    if(cbs && cbs.length>0){
        cbs.forEach(function(cb, index){
            //make sure that was instance of audio player
            cb.apply(self, args);
        });
    }
    cbs = this._once[event];
    if(cbs && cbs.length > 0){
        cbs.forEach(function(cb, index){
            //make sure that was instance of audio player
            cb.apply(self, args);
        });
        //clean once
        this._once = [];
    }

}

/*
 * fix firefox leaking BufferLoader class issue
 */
function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
}


BufferLoader.prototype.load = function() {
    var buff = [];
    var self = this;

    this.urlList.forEach(function(url, index){
        buff.push(function(callback){
            // Load buffer asynchronously
            var request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";

            request.onload = function() {
                // Asynchronously decode the audio file data in request.response
                self.context.decodeAudioData(request.response, function(buffer) {
                    callback(null, buffer);
                });
            }

            request.onerror = function() {
                callback({index: index, url: url});
            }

            request.send();
        });
    });

    async.series(buff, function(err, results){
        if(err){
            console.log(err);
        };
        self.onload(results);
    });
}
window.BufferLoader = BufferLoader;

/*
function testCode(){
    var a = new AudioPlayer();
    a.init(['/audio/ring3.mp3', '/audio/hangup2.mp3']);
    setTimeout(function(){
        a.play(0,true);
    },2000);
}

testCode();
*/
