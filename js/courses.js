$(function () {

    'use strict';

    var a = document.createElement('a'),
        div = document.createElement('div'),
        img = document.createElement('img'),
        span = document.createElement('span'),
        h2 = document.createElement('h2'),
        input = document.createElement('input'),
        section = document.createElement('section'),
        mainDiv = document.getElementById('main-content');

    function Course(id, sName, name, spInstruc, dishes) {
        this.id = id;
        this.sName = sName;
        this.name = name;
        this.spInstruc = spInstruc;
        this.items = [];

        this.element = createCourse(this);
        this.childElements = createDishes(dishes, this);
    }

    function createDishes(dishes, item) {
        var catH2 = h2.cloneNode(true),
            spInstrucDiv = div.cloneNode(true),
            clearDiv = div.cloneNode(true),
            catSection = section.cloneNode(true),
            buttonInput = input.cloneNode(true),
            fragment = document.createDocumentFragment();

        if((dishes) && (dishes.length !== 0)) {
            catH2.id = 'menu-categories-title';
            catH2.classList.add('text-center');
            catH2.textContent = item.name + ' Menu';
            spInstrucDiv.classList.add('text-center');
            spInstrucDiv.textContent = item.spInstruc;
            catSection.classList.add('row');
            clearDiv.classList.add('clearfix', 'visible-lg-block', 'visible-md-block');
            buttonInput.id = 'basketButton';
            buttonInput.type = 'button';
            buttonInput.value = 'To Basket';
            buttonInput.classList.add('text-center');
            fragment.appendChild(catH2);
            fragment.appendChild(spInstrucDiv);

            for (var i = 0, len = dishes.length; i < len; i++) {
                var dish = new Dish(dishes[i].id, dishes[i].short_name, dishes[i].name, dishes[i].description, dishes[i].price_small, dishes[i].price_large, dishes[i].small_portion_name, dishes[i].large_portion_name, item.sName);
                catSection.appendChild(dish.element);
                if (i % 2 != 0) {
                    catSection.appendChild(clearDiv);
                }
                item.items.push(dish);
            }
            fragment.appendChild(catSection);
            fragment.appendChild(buttonInput);
            return fragment;
        }
    }

    function createCourse(item){
        var aCat = a.cloneNode(true),
            innerDiv = div.cloneNode(true),
            outerDiv = div.cloneNode(true),
            imgCat = img.cloneNode(true),
            spanCat = span.cloneNode(true);

        outerDiv.classList.add('col-md-3', 'col-sm-4', 'col-xs-6', 'col-xxs-12');
        innerDiv.classList.add('category-tile');

        innerDiv.setAttribute('data-short-name', item.sName);
        aCat.href = '#';
        imgCat.src = 'images/menu/' + item.sName + '/' + item.sName + '.jpg';
        imgCat.alt = item.name;
        spanCat.textContent = item.name;

        innerDiv.appendChild(imgCat);
        innerDiv.appendChild(spanCat);
        aCat.appendChild(innerDiv);
        outerDiv.appendChild(aCat);

        return outerDiv;
    }

    window.Course = Course;

});
