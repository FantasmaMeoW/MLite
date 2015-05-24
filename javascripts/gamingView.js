define([
'jquery',
'underscore',
'backbone',
'text!view/gamePage.html'
],function($, _, backbone, dom){

    var _gameView = Backbone.View.extend({
        initialize: function() {
            console.log('Game View init');
            this.score = 0;
            var self = this;
            $('body').on('keydown', function(e){
                if($('#GamePage').is(':visible')){
                    self._keyEvent(e);
                }
            });
            this.timmer = 30;
            this.speed = 900;
            this.$el.html(dom);
            this._setData();
        },

        el: "#GamePage",

        events: {
            "click #endBtn": "backToHome",
            "click #to_endBtn": "backToHome",
            "click #reBtn": "reStart",
            "click #to_reBtn": "reStart",
        },
        render: function() {
            this.timmer = 30;
            this.speed = 900;
            $('#ScorePage').hide();
            $('#end_score>span').text('0');
            $('#MainGameArea ul li').addClass('nullGround');
            $('.grow').removeClass('grow');
            $('.ready').removeClass('ready');
            $('.pages').hide();
            $('#GamePage').show();
            // start countdown
            this._startCountdown();
            this._growNew(this.speed);
        },
        backToHome: function(){
            //thisodo: check and end game
            this._stopCountdown();
            this.renderMainPage();
        },
        reStart: function(){
            this._stopCountdown();
            this.render();
        },
        renderMainPage: function(){
            $('.pages').hide();
            $('#indexPage').show();
        },
        _setData: function(){
            var dom = [81, 87, 69, 65, 83, 68, 90, 88, 67];
            for (i in dom){
                // console.log('dom', i , dom[i]);
                $('.key-' + dom[i]).attr('key', dom[i]);
            }
        },
        _startCountdown: function(){
            var self = this;
            $('#Score').text(this.timmer);
            var countdown = setInterval(function(){ 
                // console.log(self.timmer);
                //TODO: clean rendom add class
                self.timmer = parseInt(self.timmer) - 1;
                var text = (self.timmer>9)? self.timmer : '0' +self.timmer;
                $('#Score').text(text);
                if(self.timmer == 20){
                    self.speed = 700;
                    self._growNew(700);
                } else if(self.timmer == 15){
                    self.speed = 620;
                    self._growNew(620);
                } else if(self.timmer == 9 || self.timmer == 3 ){
                    self._showAddTime();
                } else if(self.timmer <= 0){
                    console.log('Time out');
                    $('.grow').removeClass('grow');
                    $('.ready').removeClass('ready');
                    self._showScore();
                    self.score = 0;
                    self._stopCountdown();
                    $('#MainGameArea ul li').addClass('nullGround');  
                }
            }, 1000);
            // this._changeState();
            this.count = countdown;
        },
        _addTimeOut: function(target){
            var self = this;
            setTimeout(function(){
                if(target.hasClass('grow')){
                    target.removeClass('grow').addClass('ready');
                }
                setTimeout(function(){
                    if(target.hasClass('ready')){
                        target.removeClass('ready').addClass('nullGround');
                        self.timmer = self.timmer - $('.ready').length;
                    }
                }, 850);
            }, 700);
        },
        _growNew: function(time){
            var self = this;
            var allNull =  [];
            $('.nullGround').each(function(){
                allNull.push($(this).attr('key'));
            });
            clearInterval(this.rendom);
            var rendomGrow = setInterval(function(){
                allNull = [];
                $('.nullGround').each(function(){
                    allNull.push($(this).attr('key'));
                });
                
                var num = parseInt(Math.random()*10);
                num = num % allNull.length;
                // add grow
                $('.key-' + allNull[num]).removeClass('nullGround').addClass('grow');
                self._addTimeOut($('.key-' + allNull[num]));
            }, time);
            this.rendom = rendomGrow;
        },
        _showAddTime: function(){
            var allNull = [];
            $('.nullGround').each(function(){
                allNull.push($(this).attr('key'));
            });
            
            var num = parseInt(Math.random()*10);
            num = num % allNull.length;
            // add grow
            $('.key-' + allNull[num]).removeClass('nullGround').addClass('addTime');
             setTimeout(function(){
                $('.addTime').removeClass('addTime').addClass('nullGround');
            }, 700);
        },
        _stopCountdown: function(){
            //show and save Score
            clearInterval(this.count);
            clearInterval(this.rendom);
            // clearInterval(this.changeState);
            self.countdown = null;
            self.rendom = null;
            // self.changeState = null;
        },
        _keyEvent: function(e){
            var targetClass = '.key-' + e.which;
            var target = $(targetClass);
            if( target.length > 0){
                if( target.hasClass('ready') ){
                    // get 3 point
                    this.score = this.score + 3;
                    target.removeClass('ready').addClass('getReady');
                    this._setEnd(target, 'getReady');
                } else if(target.hasClass('grow')){
                    // get 1 point
                    this.score = this.score + 1;
                    target.removeClass('grow').addClass('getGrow');
                    this._setEnd(target, 'getGrow');
                } else if(target.hasClass('addTime')){
                    // add time
                    this.timmer = this.timmer + 5;
                    this.speed = this.speed - 20;
                    this._growNew(this.speed);
                    target.removeClass('addTime').addClass('getAddTime');
                    this._setEnd(target, 'getAddTime');
                }
            }
        },
        _setEnd: function(target, targetClass){
            setTimeout(function(){
                target.removeClass(targetClass).addClass('nullGround');
            }, 400);
            
        },
        _showScore: function(){
            $('#end_score>span').text(this.score);
            this.score = 0;
            $('#ScorePage').show();
        }

    });
    return  _gameView ;
});
