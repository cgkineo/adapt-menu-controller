/*
* adapt-menu-controller
* License - https://github.com/cgkineo/adapt-menu-controller/LICENSE
* Maintainers - Dan Ghost <daniel.ghost@kineo.com>
*/
define(function(require) {

    var Adapt = require('coreJS/adapt');

    var listenDeviceChange = false;
    var currentModel = undefined;
    Adapt.menuStore = {};

    Adapt.registerMenu = function(name, object) {
        if (Adapt.menuStore[name]) throw Error('This menu already exists in your project');

        Adapt.menuStore[name] = object;
    }

    Adapt.on('router:menu', function(model) {        
        listenDeviceChange = false;
        currentModel = model;
        drawMenu();
    });

    Adapt.on("router:page", function() {
        listenDeviceChange = false;
    });

    Adapt.on("device:changed", function() {
        if (listenDeviceChange) {
            if (Adapt.location._currentId == "course") {
                Backbone.history.navigate("#/", {trigger: true, replace: true});
            } else {
                Backbone.history.navigate("#/id/"+Adapt.location._currentId, {trigger: true, replace: true});
            }
        }
    }); 


    function drawMenu() {
        var model = currentModel;
        var menuType = model.get('_menuType');
        if (menuType === undefined) return;


        if (typeof menuType == "object") {
            var found = undefined;
            for (var screensize in menuType) {
                if ( isMatchingScreenSize( getScreenSize(), screensize.split(" ") ) ) {
                    found = menuType[screensize];
                    break;
                }
            }
            if (found === undefined) return false;
            menuType = found;
            listenDeviceChange = true;
        }


        var MenuView = Adapt.menuStore[menuType];
        var menuItem = new MenuView({model:model}).$el;
        $('#wrapper').append(menuItem);
    }


    var getScreenSize = function() {
        var height = $(window).height();
        var width = $(window).width();

        var ratio = Math.floor(width/height*100)/100;

        console.log(ratio);

        var aspectratio = 
            (ratio > (16/9))
                ? "extrawidescreen"
                : (ratio > (4/3))
                    ? "widescreen"
                    : "screen";

        var devicesize = (
            (width <= 520 || height <= 520 / ratio) 
                ? "small" 
                : (width <= 900 || height <= 900 / ratio) 
                    ? "medium"
                    : (width > 1024 || height > 1024 / ratio ) 
                        ? "extralarge"  
                        : "large"

            );

        return { 
            height:height, 
            width:width, 
            ratio: ratio, 
            aspectratio: aspectratio,
            devicesize:devicesize
        };
    }

    var isMatchingScreenSize = function(screenSize, arr) {
        if (_.indexOf(arr, screenSize.devicesize) > -1 &&
            ( ( arr.indexOf("notouch") > -1 && !Modernizr.touch ) ||  ( _.indexOf(arr, "notouch") == -1 ) ) &&
            ( ( arr.indexOf("touch") > -1 && Modernizr.touch ) ||  ( _.indexOf(arr, "touch") == -1 ) ) ) {
            return true;
        }
        return false;
    }

});