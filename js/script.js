$(function () {

    'use strict';

    var homeSnippet = 'snippets/home-snippet.html',
        basketSnippet = 'snippets/basket-snippet.html',
        historySnippet = 'snippets/history-snippet.html',
        containerNav = document.getElementById('container'),
        mainDiv = document.getElementById('main-content');

    function Menu() {}

    Menu.prototype = Object.create(Array.prototype, {
        constructor: {
            value: Menu
        }
    });

    var menu = new Menu();
    var restaurantAPI = new RestaurantAPI();
    var courseHtml = new CourseHtml();
    var dishHtml = new DishHtml();

    containerNav.addEventListener('click', clickNavEvent, false);

    function clickCategoryEvent(e) {
        var target = e.target,
            sName = target.parentNode.getAttribute('data-short-name'),
            index = menu.findIndex(function (item) {
                return item.sName === sName;
            }),
            course = menu[index];
        displayDishes(course.id);
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
                displayCourses('menu.json');
                break;
            }
            case 'basketRef': {
                //changeContent(basketSnippet);
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

    function clickDishPageEvent(e) {
        var target = e.target;
        if(target.id === 'quantity') {
            e.preventDefault();
            $(this).blur();
        }
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

    var changeContent = function(url){
        restaurantAPI.sendGetRequest(
            url,
            function (html) {
                mainDiv.innerHTML = html;
            }
        );
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


    var getCourses = function (url) {
        if(menu.length !== 0){
            return menu;
        } else {
            return new Promise(function(resolve, reject) {
                restaurantAPI.sendGetRequest(
                    url,
                    function (json) {
                        var courses = createCourseObjs(JSON.parse(json));
                        resolve(courses);
                    }
                );
            });
        }
    };

    var createCourseObjs = function (coursesJson) {
        for(var i = 0, len = coursesJson.length; i < len; i++){
            var newCourse = new Course(coursesJson[i].id, coursesJson[i].short_name, coursesJson[i].name, coursesJson[i].special_instructions, coursesJson[i].menu_items);
            menu.push(newCourse);
        }
        return menu;
    };

    var getDishes = function (courseId) {
        if(menu.length !== 0){
            var index = menu.findIndex(function (course) {
                return course.id === courseId;
            });
            if(index >= 0) {
                return menu[index].items;
            }
        }
    };

    var buildCourseViewHtml = function(courses, courseHtml) {
        var finalHtml = "<section id='section' class='row'>";

        for (var i = 0, len = courses.length; i < len; i++) {
            var html = courseHtml;
            var name = "" + courses[i].name;
            var sName = courses[i].sName;
            html = insertProperty(html, "name", name);
            html =  insertProperty(html, "short_name", sName);
            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    };

    var buildDishViewHtml = function(course, dishArr, dishTitleHtml, dishHtml) {
        dishTitleHtml = insertProperty(dishTitleHtml, "name", course.name);
        dishTitleHtml = insertProperty(dishTitleHtml, "special_instructions", course.spInstruc);

        var finalHtml = dishTitleHtml;
        finalHtml += "<section class='row'>";

        for (var i = 0, len = dishArr.length; i < len; i++) {
            var html = dishHtml;
            html = insertProperty(html, "short_name", dishArr[i].sName);
            html = insertProperty(html, "catShortName", course.sName);
            html = insertItemPrice(html, "price_small", dishArr[i].sPrice);
            html = insertItemPortionName(html, "small_portion_name", dishArr[i].sPortionName);
            html = insertItemPrice(html, "price_large", dishArr[i].lPrice);
            html = insertItemPortionName(html, "large_portion_name", dishArr[i].lPortionName);
            html = insertProperty(html, "name", dishArr[i].name);
            html = insertProperty(html, "description", dishArr[i].description);
            if (i % 2 != 0) {
                html +=  "<div class='clearfix visible-lg-block visible-md-block'></div>";
            }
            finalHtml += html;
        }

        finalHtml += "</section>";
        finalHtml += "<input type='button' id='basketButton' value='To Basket'>";
        return finalHtml;
    };


    var insertItemPrice = function(html, pricePropName, priceValue) {
        if (!priceValue) {
            return insertProperty(html, pricePropName, "");
        }
        priceValue = "$" + priceValue.toFixed(2);
        return insertProperty(html, pricePropName, priceValue);
    };

    var insertItemPortionName = function(html, portionPropName, portionValue) {
        if (!portionValue) {
            return insertProperty(html, portionPropName, "");
        }
        portionValue = "(" + portionValue + ")";
        return insertProperty(html, portionPropName, portionValue);
    };

    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    };

    var getCourseById = function (courseId) {
        if(menu.length !== 0){
            var index = menu.findIndex(function (course) {
                return course.id === courseId;
            });
            if(index >= 0) {
                return menu[index];
            }
        }
    };

    var displayCourses = function (dataFile) {
        Promise.all([courseHtml.getCourseHTML(), getCourses(dataFile)]).then(function(results){
            mainDiv.innerHTML = buildCourseViewHtml(results[1], results[0]);
            var section = document.getElementById('section');
            section.addEventListener('click', clickCategoryEvent, false);
        });
    };

    var displayDishes = function (courseId) {
        Promise.all([dishHtml.getDishTitleHTML(), dishHtml.getDishHTML(), getDishes(courseId)]).then(function(results){
            mainDiv.innerHTML = buildDishViewHtml(getCourseById(courseId),results[2], results[0], results[1]);
            var quantIntput = document.getElementById('main-content');
            quantIntput.addEventListener('click', clickDishPageEvent, false);
        });
    };

});


