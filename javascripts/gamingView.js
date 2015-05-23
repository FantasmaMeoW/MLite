define([
'jquery',
'underscore',
'backbone',
'text!view/gamePage.html'
],function($, _, backbone, dom){

    var _gameView = Backbone.View.extend({
        initialize: function() {
            console.log('Gaming View init');
            this.score = 0;
            var self = this;
            $('body').on('keydown', function(e){
                if($('#GamePage').is(':visible')){
                    self._keyEvent(e);
                }
            });
            this.$el.html(dom);
            this._setData();
        },

        el: "#GamePage",

        events: {
            "click #endBtn": "backToHome",
        },
        render: function() {
            $('#MainGameArea ul li').addClass('nullGround');
            $('.grow').removeClass('grow');
            $('.ready').removeClass('ready');
            $('.pages').hide();
            $('#GamePage').show();
            // start countdown
            this._startCountdown();
            this._startRendom();
        },
        _setData: function(){
            var dom = [81, 87, 69, 65, 83, 68, 90, 88, 67];
            for (i in dom){
                console.log('dom', i , dom[i]);
                $('.key-' + dom[i]).attr('key', dom[i]);
            }
        },
        backToHome: function(){
            //thisodo: check and end game
            this._stopCountdown();
            this.renderMainPage();
        },
        renderMainPage: function(){
            $('.pages').hide();
            $('#indexPage').show();
        },
        _startCountdown: function(){
            var self = this;
            var countdown = setTimeout(function(){ 
                //TODO: clean rendom add class
                console.log('Time out');
                alert('STOP' + self.score);
                self.score = 0;
                self._stopCountdown();
            }, 10000);
            this.count = countdown;
        },
        _startRendom: function(){
            var allNull =  [];
            $('.nullGround').each(function(){
                allNull.push($(this).attr('key'));
            });
            var rendomGrow = setInterval(function(){ 
                allNull = [];
                $('.nullGround').each(function(){
                    allNull.push($(this).attr('key'));
                });
                // turn ready
                $('.ready2').removeClass('ready ready2').addClass('nullGround');
                $('.ready1').removeClass('ready1').addClass('ready2');
                $('.grow').removeClass('grow').addClass('ready ready1');

                var num = parseInt(Math.random()*10);
                num = num % allNull.length;
                // add grow
                $('.key-' + allNull[num]).removeClass('nullGround').addClass('grow');
            }, 700);
            this.rendom = rendomGrow;
        },
        _stopCountdown: function(){
            //show and save Score
            clearTimeout(this.count);
            clearInterval(this.rendom);
            self.countdown = null;
            self.rendom = null;
        },
        _keyEvent: function(e){
            var targetClass = '.key-' + e.which;
            var target = $(targetClass);
            if( target.length > 0){
                if( target.hasClass('ready') ){
                    // get 3 point
                    this.score = this.score + 3;
                    target.removeClass('ready ready1 ready2').addClass('getIt');
                    this._endAnimate(target);

                } else if(target.hasClass('grow')){
                    // get 1 point
                    this.score = this.score + 1;
                    target.removeClass('grow').addClass('getIt');
                    this._endAnimate(target);
                }
            }
        },
        _endAnimate: function(target){
            target.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                target.removeClass('getIt').addClass('nullGround');
            });
        }

    });
    return  _gameView ;
});
