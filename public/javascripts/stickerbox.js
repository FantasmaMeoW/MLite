function StickerBox(url, storage){
    this._url = url;
    this._storage = storage;
    this.penddingList = [];
    this.update = false;
}

StickerBox.prototype.get = function(jid){
    var self = this;
    var value = self._storage.getItem(jid);
    if(!value || value == ''){
        value = self._storage.getItem('default');
        self._storage.setItem(jid, '');
        self.pendding(jid);
    }
    return value;
}

StickerBox.prototype.getGroup = function(jid){
    var self = this;
    var value = self._storage.getItem(jid);
    if(!value || value == ''){
        value = self._storage.getItem('default_group');
        self._storage.setItem(jid, '');
        self.pendding(jid);
    }
    return value;
}

StickerBox.prototype.getDefault = function(cb){
    var self = this;
    var value = self._storage.getItem('default');
    if(!value || value == ''){
        console.log('getting default ... ');
        var oReq = new XMLHttpRequest();
        oReq.open("GET", serverUrl + "/ccr/gridfs/sticker?jid=default", true);
        oReq.responseType = "blob";

        oReq.onload = function(oEvent) {
            var status = oEvent.currentTarget.status;
            if(status === 200){
                var reader = new FileReader();
                reader.onload = function(){
                    self.put('default', reader.result);
                }

                reader.readAsDataURL(oReq.response);

            }
            cb(reader.result);
        };

        oReq.send();

    } else {
        cb(value);
    }
}

StickerBox.prototype.put = function(jid, value){
    /*
    var cevent = new CustomEvent('sticker-change', {
        detail: key,
        bubbles: true,
		cancelable: true
    });
    window.dispatchEvent(cevent);
    */
    if(!/^data:image|^data:application\/octet-stream/.test(value)){
        console.log(value);
        return false;
    }
    var query = 'img[sticker][sticker-jid='+ jid +']';
    var stickers = document.querySelectorAll(query);
    for(var i=0;i<stickers.length;i++){
        stickers[i].src = value;
        console.log('updating ...'+jid);
    }

	/* For update Background Image  @2014.3.21*/
    var queryBackGround = 'div[sticker][sticker-jid='+ jid +']';
    var stickersBackGround = document.querySelectorAll(queryBackGround);
    for(var i=0;i<stickersBackGround.length;i++){
		stickersBackGround[i].style.background = 'url('+ value + ') 50% 50% no-repeat ';
	}

    return this._storage.setItem(jid, value);
}


StickerBox.prototype.remove = function(items){
    var self = this;
    if(Array.isArray(items)){
        items.forEach(function(key, index){
            self._storage.removeItem(key);
        });
    } else if(items){
        self._storage.removeItem(items);
    } else if(!items){
        self._storage.clear();
    }
}

StickerBox.prototype.itemNames = function(){
    var names = [];
    for(var i in this._storage){
        names.push(i);
    }
    return names;
}

StickerBox.prototype.JID = function(){
    var jids = [];
    var patten = /^cc.+|^msg.+/;
    for(var i in this._storage){
        if(patten.test(i)){
            jids.push(i);
        }
    }
    return jids;
}

StickerBox.prototype.sync = function(){
    var self = this;
    var ids = self.JID();

    var stamp = Date.now();
    $.ajax({
        url: self._url,
        type: 'POST',
        data: {query: JSON.stringify({ids:ids, timestamp:self.timestamp()})},
        success: function(response){
            var res = JSON.parse(response);
            var changes = res.changes;
            if(changes.length > 0){
                self.pendding(changes);
                self.update = true;
            }
            self.timestamp(res.timestamp);
        },
        error: function(err){
            console.error('some error happended');
        }
    });
}

StickerBox.prototype.timestamp = function(time){
    if(time){
        this._storage.setItem('timestamp', time);
        return time;
    } else{
        return this._storage.getItem('timestamp') || 0;
    }
}

StickerBox.prototype.pendding = function(jids){
    if(!jids){
        return;
    };
    if(!Array.isArray(jids)){
        jids = [jids];
    }
    for(var i in jids){
        var flag = 0;
        for (var j in this.penddingList){
            if(jids[i] == this.penddingList[j]){
                flag = 1;
                break;
            }
        }
        if(flag == 0){
            this.penddingList.push(jids[i]);
        }
    }
    //this.penddingList = this.penddingList.concat(jids);
}

StickerBox.prototype.fetchPendding = function(jids){
    var self = this;
    if(jids){
        self.pendding(jids);
    }
    if(this.penddingList.length > 0){
        console.log(this.penddingList);
        this.fetch(this.penddingList, function(results){
            console.log('clear pendding');
            self.penddingList = [];
        });
    }
}

StickerBox.prototype.fetch = function(jids, cb){
    var self = this;
    if(!Array.isArray(jids)){
        jids = [jids];
    }
    var buff = [];
    jids.forEach(function(jid){
        buff.push(function(callback){
            //console.log('fetching ... ' + jid);
            var oReq = new XMLHttpRequest();
            oReq.open("GET", serverUrl + "/ccr/gridfs/sticker?jid="+jid, true);
            oReq.responseType = "blob";

            oReq.onload = function(oEvent) {
                var status = oEvent.currentTarget.status;
                if(status === 200){
                    var reader = new FileReader();
                    reader.onload = function(){
                        self.put(jid, reader.result);
                        callback(null, reader.result);
                    }

                    reader.readAsDataURL(oReq.response);
                } else if (status === 304){
                    callback(null, '');
                    var query = 'img[sticker][sticker-jid='+ jid +']';
                    var stickers = document.querySelectorAll(query);
                    for(var i=0;i<stickers.length;i++){
                        stickers[i].src = self._storage.getItem('default');
                    }
					/* For update Background Image  @2014.3.21*/
					var queryBackGround = 'div:not([gid])[sticker][sticker-jid='+ jid +']';
					var stickersBackGround = document.querySelectorAll(queryBackGround);
					for(var i=0;i<stickersBackGround.length;i++){
						stickersBackGround[i].style.background = 'url('+ self._storage.getItem('default') + ') 50% 50% no-repeat ';
					}
					/* For update Background Image  @2014.3.21*/
					var queryBackGround = 'div[gid][sticker][sticker-jid='+ jid +']';
					var stickersBackGround = document.querySelectorAll(queryBackGround);
					for(var i=0;i<stickersBackGround.length;i++){
						stickersBackGround[i].style.background = 'url('+ self._storage.getItem('default_group') + ') 50% 50% no-repeat ';
					}
                } else {
                    callback('cannot fetch '+ jid, null);
                }
            };

            oReq.send();
        });
    });

    async.series(buff, function(err, results){
        if(err){
            console.log(err);
        } else {
            if(self.update){
                self.update = false;
            }
            //self.timestamp(self.stamp);
        }
        cb && cb(results);
    });
};

StickerBox.prototype.createImg = function(jid){
    var self = this;

    var img = new Image();
    img.setAttribute('sticker','');
    img.setAttribute('sticker-jid',jid);

    img.src = self.get(jid)||self._storage.getItem('default');// String "null" is for error handle

    img.evenetHandler = function(e){
        if(e.detail.key === jid){
            img.src = self.get(key);
        }
    };
//    window.addEventListener('sticker-change', img.eventHandler);
    return img;
}

StickerBox.prototype.init = function(){
    var self = this;
    self.remove('default');
    self.fetch(['default','default_group'], function (value) {
        setInterval(function(){
            self.fetchPendding();
        }, 5000);
        setTimeout(function(){
            self.sync();
            setInterval(function(){
                self.sync();
            },1800000);
        }, 30000);
    });
}

//Global variable
stickerBox = new StickerBox(serverUrl + '/ccr/gridfs/sync', localStorage);
stickerBox.init();

//only for ccmsg
//~ $(document).bind('attached', function(){
    //~ var jid = JSON.parse(sessionStorage.accountInfo).purejid;
    //~ var img = stickerBox.createImg(jid);
    //~ $('div.image-field').prepend(img);
    //~ setInterval(function(){
        //~ stickerBox.fetchPendding();
    //~ }, 5000);
    //~ setInterval(function(){
        //~ stickerBox.sync();
    //~ }, 30000);
//~ });
