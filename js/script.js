$(function () {

    'use strict';

    var homeSnippet = 'snippets/home-snippet.html',
        basketSnippet = 'snippets/basket-snippet.html',
        historySnippet = 'snippets/history-snippet.html',
        containerNav = document.getElementById('container'),
        mainDiv = document.getElementById('main-content'),
        section = document.createElement('section'),
        categories = [];

    function Menu() {}

    Menu.prototype = Object.create(Array.prototype, {
        constructor: {
            value: Menu
        }
    });

    var menu = new Menu();

    var restaurantAPI = new RestaurantAPI();

    containerNav.addEventListener('click', clickNavEvent, false);

    function clickCategoryEvent(e) {
        var target = e.target,
            sName = target.parentNode.getAttribute('data-short-name'),
            index = menu.findIndex(function (item) {
                return item.sName === sName;
            }),
            category = menu[index];
        insertMainContent(category.childElements);
    }

    function determineTarget(e) {
        var target = e.target;

        if(target.id === 'brand-name'){
            target = target.parentNode.parentNode.parentNode.parentNode;
        } else if(target.id === 'logo-img'){
            target = target.parentNode.parentNode.parentNode;
        } else if(target.tagName === 'SPAN'){
            target = target.parentNode;
        }
        return target;
    }

    function clickNavEvent(e) {
        var target = e.target,
            parent,
            child,
            classes;
        if((target.id === 'brand-name')||(target.id === 'logo-img')){
            changeContent(homeSnippet);
        }
        target = determineTarget(e);
        parent = target.parentNode.parentNode;
        child = parent.querySelectorAll('li');
        for(var li in Object.keys(child)){
            classes = child[li].className;
            if(classes.indexOf('active') !== -1){
                classes = classes.replace(new RegExp('active', 'g'), '');
                child[li].className = classes;
                break;
            }
        }
        switch(target.id){
            case 'homeRef': {
                changeContent(homeSnippet);
                break;
            }
            case 'menuRef': {
                getAllCourses('menu.json');
                break;
            }
            case 'basketRef': {
                changeContent(basketSnippet);
                break;
            }
            case 'historyRef': {
                changeContent(historySnippet);
                break;
            }
        }
        classes = target.parentNode.className;
        if(classes.indexOf('active') == -1){
            target.parentNode.classList.add('active');
        }
    }

    var insertMainContent = function (html) {
        mainDiv.innerHTML = '';
        mainDiv.appendChild(html);
    };

    var changeContent = function(url){
        restaurantAPI.sendGetRequest(
            url,
            function (html) {
                mainDiv.innerHTML = html;
            }
        );
    };

    var getAllCourses = function (url) {
        if(categories.length !== 0){
            formCategoryHtml(categories);
        } else {
            restaurantAPI.sendGetRequest(
                url,
                function (json) {
                    categories = JSON.parse(json);
                    formCategoryHtml(categories);
                }
            );
        }
    };

    var formCategoryHtml = function (json) {
        var sectionCat = section.cloneNode(true);
        sectionCat.id = 'section';
        sectionCat.classList.add('row');
        sectionCat.addEventListener('click', clickCategoryEvent, false);
        menu = [];
        for (var i = 0, len = json.length; i < len; i++) {
            var course = new Course(json[i].id, json[i].short_name, json[i].name, json[i].special_instructions, json[i].menu_items);
            sectionCat.appendChild(course.element);
            menu.push(course);
        }
        insertMainContent(sectionCat);
    };

    changeContent(homeSnippet);

    function closeMenu() {
        var screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            $("#collapsable-nav").collapse('hide');
        }
    }
    $("#navbarToggle").blur(function (event) {
        setTimeout(closeMenu, 10);
    });

});

