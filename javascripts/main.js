requirejs.config({
    baseUrl: './',

    paths: {
        'lib': 'jslib/',
        'js' : 'javascripts/',
        'view' : 'view/',
        'text': 'jslib/text',
        'jquery': 'jslib/jquery-2.0.2',
        'underscore': 'jslib/underscore-min',
        'backbone': 'jslib/backbone-min',
        'handlebars': 'jslib/handlebars-v1.3.0',
        
    },
    shim:{
        'underscore': {
            'exports':'_'
        },
        'backbone': {
            'deps': ['jquery', 'underscore'],
            'exports':'Backbone'
        },
        'lib/handlebars': {
            'exports': 'Handlebars'
        },
    }
});

requirejs([
'jquery',
'underscore',
'backbone',
'js/gamingView'
],function($, _, backbone, GamingView){

    // global to prevent drag&drop event
    document.body.addEventListener('dragover', function(e){
      e.preventDefault();
      e.stopPropagation();
    }, false);
    document.body.addEventListener('drop', function(e){
      e.preventDefault();
      e.stopPropagation();
    }, false);
    
    // handle main view
    var _indexView = Backbone.View.extend({
      initialize: function() {
        console.log('Loaded');
        var historyScore = localStorage.getItem("historyScores");
        if(historyScore){
            historyScore = JSON.parse(historyScore);
        }
        console.log('historyScore', historyScore);
        this.gamingView = new GamingView();

        this.renderMainPage();
      },
      
      el: "body",
      
      events: {
        "click #Start .img": "renderGuidePage",
        "click #toGamePage .img": "startPlay",
        "click #backToHome .img": "backToHome",
        "keydown":'keyEvent',
      },
      
      renderMainPage: function() {
        $('.pages').hide();
        $('#indexPage').show();
      },

      renderGuidePage: function(){
        $('.pages').hide();
        $('#guidePage').show();
      },
      backToHome: function(){
        this.renderMainPage();
      },
      startPlay: function(){
        this.gamingView.render();
      },
      keyEvent: function(e){
        if(e.metaKey &&  e.shiftKey && e.which == 73 || e.ctrlKey  && e.shiftKey && e.which == 73){
            var gui = require('nw.gui');
            var win = gui.Window.get();
            win.showDevTools();
        }
      }

    });
    return indexView = new _indexView ;
});
