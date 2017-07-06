define([
    'core/js/adapt'
], function(Adapt) {

    var MenuController = Backbone.View.extend({

        initialize: function() {
            this.listenToOnce(Adapt, "app:dataReady", this.onDataReady);
        },

        onDataReady: function() {
            //check if any menus have been registered
            if (_.keys(Adapt.menuStore).length === 0) {
                console.log("No menus registered, using old menu format");
            } else {
                console.log("Menus registered, disabling old menu format");
                Adapt.off("router:menu");
                this.listenTo(Adapt, "router:menu", this.onMenu)
                this.listenTo(Adapt, "router:page", this.onPage);
                this.listenTo(Adapt, "device:changed", this.onDeviceChanged);
            }
        },

        onMenu: function(model) {
            this.stopListening(Adapt, "device:changed", this.onDeviceChanged);

            //fetch the type of menu that should be drawn
            var menuType = model.get('_menuType');
            menuType = this.compareScreenSize(menuType);

            if (!menuType) {
                console.log("No menu found for this route!");
                return;
            }

            this.listenTo(Adapt, "device:changed", this.onDeviceChanged);

            var MenuView = Adapt.menuStore[menuType];

            this.currentView = new MenuView({model:model});
            $('#wrapper').append(this.currentView.$el);
        },

        onPage: function() {
            this.stopListening(Adapt, "device:changed", this.onDeviceChanged);
        },

        onDeviceChanged: function() {
            //dynamically change the menu by rerouting to current location
            var to = window.location.hash == "" ? "#/" : window.location.hash;
            Backbone.history.navigate(to, {trigger: true, replace: true});
        },

        compareScreenSize: function(settings) {
            if (typeof settings == "object") {
                /*
                    takes:
                    {
                        "small medium large": "co-30",
                        "medium large": "co-25",
                        "small touch": "co-19",
                        "small notouch": "co-21"
                    }

                    or any combination of the small medium and large names
                    touch and notouch are exclusive parameters
                */

                var found = undefined;
                for (var screenSize in settings) {

                    var sizes =  screenSize.split(" ");

                    var isMatchingSize = _.indexOf(sizes, Adapt.device.screenSize) > -1;
                    var isTouchMenuType = _.indexOf(sizes, "touch") > -1;
                    var isNoTouchMenuType = _.indexOf(sizes, "notouch") > -1;

                    if (isMatchingSize && ((isNoTouchMenuType && !Modernizr.touch) || (!isNoTouchMenuType)) && ((isTouchMenuType && Modernizr.touch) || (!isTouchMenuType))) {
                        found = settings[screenSize];
                        break;
                    }
                }
                if (found === undefined) return false;
                
                return found;
            }

            //assume settings is a string id "co-30"
            return settings;
        }

    });

    //Allow menus to store their instanciators, like with components
    Adapt.menuStore = {};

    Adapt.registerMenu = function(name, object) {
        if (Adapt.menuStore[name]) throw Error('This menu already exists in your project');

        Adapt.menuStore[name] = object;
    }

    Adapt.menuController = new MenuController();

});
