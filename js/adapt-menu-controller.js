/*
* adapt-menu-controller
* License - https://github.com/cgkineo/adapt-menu-controller/LICENSE
* Maintainers - Dan Ghost <daniel.ghost@kineo.com>
*/
define(function(require) {

    var Adapt = require('coreJS/adapt');

    Adapt.menuStore = {};

    Adapt.registerMenu = function(name, object) {
        if (Adapt.menuStore[name]) throw Error('This menu already exists in your project');

        object.template = name;
        Adapt.menuStore[name] = object;
    }

    Adapt.on('router:menu', function(model) {        
        var menuType = model.get('_menuType');
        var MenuView = Adapt.menuStore[menuType];
        $('#wrapper').append(new MenuView({model:model}).$el);
    });

});