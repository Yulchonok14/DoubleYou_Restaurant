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

    function CategoryItem(id, sName, name, spInstruc, menuItems) {
        this.id = id;
        this.sName = sName;
        this.name = name;
        this.spInstruc = spInstruc;
        this.items = [];

        this.element = createCategoryItem(this);
        this.childElements = createMenuItems(menuItems, this);
    }

    function createMenuItems(menuItems, item) {
        var catH2 = h2.cloneNode(true),
            spInstrucDiv = div.cloneNode(true),
            clearDiv = div.cloneNode(true),
            catSection = section.cloneNode(true),
            buttonInput = input.cloneNode(true),
            fragment = document.createDocumentFragment();

        if((menuItems) && (menuItems.length !== 0)) {
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

            for (var i = 0, len = menuItems.length; i < len; i++) {
                var menuItem = new MenuItem(menuItems[i].id, menuItems[i].short_name, menuItems[i].name, menuItems[i].description, menuItems[i].price_small, menuItems[i].price_large, menuItems[i].small_portion_name, menuItems[i].large_portion_name, item.sName);
                catSection.appendChild(menuItem.element);
                if (i % 2 != 0) {
                    catSection.appendChild(clearDiv);
                }
                item.items.push(menuItems);
            }
            fragment.appendChild(catSection);
            fragment.appendChild(buttonInput);
            return fragment;
        }
    }

    function createCategoryItem(item){
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

    window.CategoryItem = CategoryItem;

});
