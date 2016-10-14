$(function () {

    'use strict';

    function Dish(id, sName, name, description, sPrice, lPrice, sPortionName, lPortionName) {
        this.id = id;
        this.sName = sName;
        this.name = name;
        this.description = description;
        this.sPrice = sPrice || '';
        this.lPrice = lPrice;
        this.sPortionName = sPortionName;
        this.lPortionName = lPortionName;
    }

    window.Dish = Dish;

});