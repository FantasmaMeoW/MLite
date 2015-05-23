window.rDebugLevel = 0;
window.rickLog = function(){
    if(rDebugLevel ==0){
        return;
    }

    var args = Array.prototype.slice.call(arguments);
    if(rDebugLevel){
        console.log.apply(console, args);
    }
    if(rDebugLevel >=2){
        var a = new Error('DEBUG');
        console.log.apply(console, [a.stack]);
    }
    if(rDebugLevel >= 3){
        alert(JSON.stringify(args));
    }
}

navigator.getUserMedia = navigator.getUserMedia ||  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var Storage = {
    get: function(name){
        if(this.hasOwnProperty(name) && this[name]){
            return this[name];
        }
        return null;
    },
    put: function(name, instance){
        this[name] = instance;
        return instance;
    },
    destroy: function(){
        var args = Array.prototype.slice.call(arguments);
        var name = args.shift();
        var cb = args.shift();

        if(this.hasOwnProperty(name) && this[name]){
            if(cb){
                cb.apply(this[name], args);
            }
            delete this[name];

        }
    }
};
function ccRecorder(){
    this.recording = false;
    this.stream = null;
    this.recorder = null;
    //this.timer = null;
    this.commands = {};
    var self = this;

    this.stop = function(){
        //self.stream.getAudioTracks()[0].enabled = false;
        self.recording = false;
        self.recorder.stop();
        self.recorder.exportWAV(function(blob){
            //clearTimeout(this.timer);

            //self.stream.stop();
            self.stream = null;

            self.recorder.destroy();

            self.exec('stop', blob);
        });
        self.recorder.clear();
    };

    this.abort = function(){
        self.stream.getAudioTracks()[0].enabled = false;
        self.recording = false;
        self.recorder.stop();
        self.recorder.exportWAV(function(blob){
            //clearTimeout(this.timer);

            //self.stream.stop();
            self.stream = null;

            self.recorder.destroy();

            self.exec('abort', blob);
        });
    }

    this.start = function(mediaStream){
        self.recording = true;
        /*
        var audioContext = Storage.get('audioContext');
        if(!audioContext){
            audioContext = new AudioContext();
            Storage.put('audioContext', audioContext);
        }
        */

       //reuse audioplayer.js context
        var audioContext = window.context

        if(!window.mediaSource){
            window.mediaSource = audioContext.createMediaStreamSource(mediaStream);
        }
        var source = window.mediaSource;
        self.recorder = new Recorder(source);
        self.recorder.onTick = function(time){
            self.exec('tick', time);
        }

        //mediaStream.getAudioTracks()[0].enabled = true;
        self.stream = mediaStream;
        self.exec('start', null);
        self.recorder.record();
    };

    this.on = function(event, cb){
        var command = this.commands[event];
        if(Array.prototype.isPrototypeOf(command)){
            command.push(cb);
        } else {
            self.commands[event] = [cb];
        }
    }

    this.exec = function(){
        var args = Array.prototype.slice.call(arguments);
        var event = args.shift() //remaining[1..]

        var command = self.commands[event];
        if(command){
            command.forEach(function(cb){
                cb.apply(self, args);
            });
        }
    }
    this.isRecording = function(){
        return this.recording;
    }
}

/*
 * use sample
var Rec = window.Rec = new ccRecorder();

Rec.on('tick', function(num){

});

Rec.on('start', function(){

});

Rec.on('stop', function(blob){

});

Rec.on('abort', function(blob){

});
*/
