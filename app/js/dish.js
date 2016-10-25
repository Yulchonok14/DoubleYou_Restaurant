$(function () {

    'use strict';

    function Dish(id, sName, name, description, sPrice, lPrice, sPortionName, lPortionName) {
        this.id = id;
        this.sName = sName;
        this.name = name;
        this.description = description;
        this.sPrice = sPrice;
        this.lPrice = lPrice;
        this.sPortionName = sPortionName;
        this.lPortionName = lPortionName;
        this.sPortionQuant = 0;
        this.lPortionQuant = 0;
    }

    window.Dish = Dish;

});