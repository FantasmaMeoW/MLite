requirejs.config({
    baseUrl: '../',

    paths: {
        //Modules
  
        
    },
    shim:{
        'underscore': {
            'exports':'_'
        },
        'backbone': {
            'deps': ['jquery', 'underscore'],
            'exports':'Backbone'
        },
        'handlebars': {
            'exports': 'Handlebars'
        },
    }
});

requirejs([


],function( ){
    
});
