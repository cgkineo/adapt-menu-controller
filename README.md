adapt-menu-controller
===============

Allows different menus to be used for contentObjects by adding the "_menuType" attribute to the `contentObjects.json` file. This extension is not required if using a single menu type.

## Configuration

Add the "_menuType" attribute to the `contentObjects.json` file as required for each contentObject. The value represents the registered menu name for the menu. For example:

```    
"_menuType": "cover"
    
    
"_menuType": {
  "large extralarge": "hotspot",
  "small medium": "block"
}
```

To register a menu:
```

    Adapt.registerMenu("box", BoxMenuView);

    Adapt.on('router:menu', function(model) {

        //$('#wrapper').append(new BoxMenuView({model:model}).$el); < do not allow menu to render itself
    
    });



```
