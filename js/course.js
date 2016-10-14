$(function () {

    'use strict';

    function Course(id, sName, name, spInstruc, dishes) {
        this.id = id;
        this.sName = sName;
        this.name = name;
        this.spInstruc = spInstruc;
        this.items = [];

        createDishes(dishes, this);
    }

    function createDishes(dishes, item) {
        if((dishes) && (dishes.length !== 0)) {
            for (var i = 0, len = dishes.length; i < len; i++) {
                var dish = new Dish(dishes[i].id, dishes[i].short_name, dishes[i].name, dishes[i].description, dishes[i].price_small, dishes[i].price_large, dishes[i].small_portion_name, dishes[i].large_portion_name);
                item.items.push(dish);
            }
        }
    }

    window.Course = Course;

});
