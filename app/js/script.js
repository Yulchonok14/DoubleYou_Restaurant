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

    var menu = new Menu(),
        restaurantAPI = new RestaurantAPI(),
        courseHtml = new CourseHtml(),
        dishHtml = new DishHtml(),
        basketHtml = new BasketHtml();

    containerNav.addEventListener('click', clickNavEvent, false);

    function clickCategoryEvent(e) {
        var target = e.target,
            sName = target.parentNode.getAttribute('data-short-name'),
            index = menu.findIndex(function (item) {
                return item.sName === sName;
            });
        if (index >= 0) {
            var course = menu[index];
            displayDishes(course.id);
        } else {
            dishHtml.getDishEmptyHTML().then(function (result) {
                mainDiv.innerHTML = result;
            });
        }
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
                displayBasket();
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

    function clickBasketButtonEvent(e) {
        var checkBoxes = document.getElementsByTagName('input'),
            dishObj, target, child, quant, dish, exist = false,
            madenOrderAr = JSON.parse(localStorage.getItem('Order'));
        for(var i = 0, len = checkBoxes.length; i < len; i++){
            if(checkBoxes[i].type === 'checkbox' && checkBoxes[i].checked === true){
                dishObj = {};
                target = checkBoxes[i].parentNode.parentNode.parentNode;
                child = checkBoxes[i].parentNode.parentNode.nextSibling.nextSibling.childNodes;
                quant = child[4].value;
                for(var j = 0, lenOr = madenOrderAr.length; j < lenOr; j++){
                    if(Number(madenOrderAr[j].idCourse) === Number(target.getAttribute('data-id-course')) && Number(madenOrderAr[j].dish.id) === Number(target.getAttribute('data-id'))){
                        madenOrderAr[j].dish.sPortionQuant += Number(quant);
                        exist = true;
                        break;
                    }
                }
                if(!exist) {
                    dish = getDish(target.getAttribute('data-id-course'), target.getAttribute('data-id'));
                    dish.sPortionQuant = Number(quant);
                    dishObj.idCourse = target.getAttribute('data-id-course');
                    dishObj.dish = dish;
                    madenOrderAr.push(dishObj);
                }
                checkBoxes[i].checked = false;
                child[4].value = '1';
            }
        }
        if(madenOrderAr.length !== 0){
            localStorage.setItem('Order', JSON.stringify(madenOrderAr));
        }
    }

    function clickCloseEvent(e) {
        var target = e.target,
            totalPriceElem, discTPriceElem, discountElem, totalPrice, substrPrice, discount;
        if(target.classList.contains('delete')){
            var line = target.nextSibling.nextSibling,
                id = target.getAttribute('data-id'),
                orderAr = JSON.parse(localStorage.getItem('Order'));
            target = e.target.parentNode;
            for(var i = 0, len = orderAr.length; i < len; i++){
                if(orderAr[i].dish.id === Number(id)){
                    if(orderAr[i].dish.sPrice === null){
                        substrPrice = orderAr[i].dish.sPortionQuant * orderAr[i].dish.lPrice;
                    } else {
                        substrPrice = orderAr[i].dish.sPortionQuant * orderAr[i].dish.sPrice + orderAr[i].dish.lPortionQuant * orderAr[i].dish.lPrice;
                    }
                    orderAr.splice(i, 1);
                    totalPriceElem = document.getElementById('dollars');
                    discTPriceElem = document.getElementById('discDollars');
                    discountElem = document.getElementById('discount');
                    discount = Number(discountElem.innerText.substr(1, discountElem.innerText.length - 2));
                    totalPrice = Number(totalPriceElem.innerText.substr(1));
                    totalPriceElem.innerText = '$' + (totalPrice - substrPrice).toFixed(2);
                    discTPriceElem.innerText = '$' + (Number(totalPriceElem.innerText.substr(1)) * (1 - discount / 100)).toFixed(2);
                    localStorage.setItem('Order', JSON.stringify(orderAr));
                    if(orderAr.length === 0){
                        basketHtml.getBasketEmptyHTML().then(function (result) {
                            mainDiv.innerHTML = result;
                        });
                    } else {
                        target.remove();
                        line.remove();
                    }
                    break;
                }
            }
        }
    }

    function changeQuantEvent(e) {
        var target = e.target,
            quant = Number(target.value),
            id = target.getAttribute('id'),
            parent = target.parentNode.parentNode.parentNode,
            dishId = parent.getAttribute('data-id'),
            courseId = parent.getAttribute('data-id-course'),
            price, priceElem, oldPrice, totalPrice, newPrice, discTPrice, discElem, discount,
            child = target.parentNode.parentNode.nextSibling.nextSibling.childNodes,
            orderAr = JSON.parse(localStorage.getItem('Order'));
        for(var i = 0, len = orderAr.length; i < len; i++){
            if(Number(orderAr[i].idCourse) === Number(courseId) && orderAr[i].dish.id === Number(dishId)){
                if (id === 'pint') {
                    price = orderAr[i].dish.sPrice || orderAr[i].dish.lPrice;
                    priceElem = child[1];
                    orderAr[i].dish.sPortionQuant = quant;
                } else if (id === 'quart') {
                    price = orderAr[i].dish.lPrice;
                    priceElem = child[3];
                    orderAr[i].dish.lPortionQuant = quant;
                }
                oldPrice = Number(priceElem.innerHTML.substr(1));
                newPrice = (price * quant);
                priceElem.innerHTML = '$' + newPrice.toFixed(2);
                localStorage.setItem('Order', JSON.stringify(orderAr));
                totalPrice = document.getElementById('dollars');
                discTPrice = document.getElementById('discDollars');
                discElem = document.getElementById('discount');
                discount = discElem.innerText.substr(1, discElem.innerText.length - 2);
                totalPrice.innerText = '$' + (Number(totalPrice.innerText.substr(1)) + (newPrice - oldPrice)).toFixed(2);
                discTPrice.innerText = '$' + (Number(totalPrice.innerText.substr(1)) * (1 - discount / 100)).toFixed(2);
            }
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
            $('#collapsable-nav').collapse('hide');
        }
    }
    $('#navbarToggle').blur(function (event) {
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

    var getDish = function (courseId, dishId) {
        if(menu.length !== 0){
            var index = menu.findIndex(function (course) {
                return course.id === Number(courseId);
            });
            if(index >= 0) {
                var dishes = menu[index].items;
                index = dishes.findIndex(function (dish) {
                    return dish.id === Number(dishId);
                });
                if(index >= 0){
                    return dishes[index];
                }
            }
        }
    };

    var buildCourseViewHtml = function(courses, courseHtml) {
        var finalHtml = "<section id='section' class='row'>";

        for (var i = 0, len = courses.length; i < len; i++) {
            var html = courseHtml;
            html = insertProperty(html, 'name', courses[i].name);
            html =  insertProperty(html, 'shortName', courses[i].sName);
            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    };

    var buildDishViewHtml = function(course, dishArr, dishTitleHtml, dishHtml) {
        dishTitleHtml = insertProperty(dishTitleHtml, 'name', course.name);
        dishTitleHtml = insertProperty(dishTitleHtml, 'specialInstructions', course.spInstruc);

        var finalHtml = dishTitleHtml;
        finalHtml += "<section class='row'>";

        for (var i = 0, len = dishArr.length; i < len; i++) {
            var html = dishHtml;
            html = insertProperty(html, 'id', dishArr[i].id);
            html = insertProperty(html, 'idCourse', course.id);
            html = insertProperty(html, 'shortName', dishArr[i].sName);
            html = insertProperty(html, 'catShortName', course.sName);
            html = insertItemPrice(html, 'priceSmall', dishArr[i].sPrice);
            html = insertItemPortionName(html, 'smallPortionName', dishArr[i].sPortionName);
            html = insertItemPrice(html, 'priceLarge', dishArr[i].lPrice);
            html = insertItemPortionName(html, 'largePortionName', dishArr[i].lPortionName);
            html = insertProperty(html, 'name', dishArr[i].name);
            html = insertProperty(html, 'description', dishArr[i].description);
            if (i % 2 !== 0) {
                html +=  "<div class='clearfix visible-lg-block visible-md-block'></div>";
            }
            finalHtml += html;
        }

        finalHtml += "</section>";
        finalHtml += "<input type='button' id='basketButton' value='To Basket'>";
        return finalHtml;
    };

    var buildBasketViewHtml = function (basketHtml, basketTitleHtml, basketFooterHtml, discount, orderAr) {
        var finalHtml = basketTitleHtml;
        finalHtml += "<section id='section' class='row'>";
        var course, dish, totalSPrice, totalLPrice, orderPrice = 0;
        for (var i = 0, len = orderAr.length; i < len; i++) {
            course = menu[orderAr[i].idCourse - 1];
            dish = orderAr[i].dish;
            if (dish) {
                var html = basketHtml;
                html = insertProperty(html, 'id', dish.id);
                html = insertProperty(html, 'idCourse', course.id);
                html = insertProperty(html, 'name', dish.name);
                html = insertProperty(html, 'shortName', dish.sName);
                html = insertItemPrice(html, 'priceSmall', dish.sPrice);
                html = insertItemPortionName(html, 'smallPortionName', dish.sPortionName);
                html = insertItemPrice(html, 'priceLarge', dish.lPrice);
                html = insertItemPortionName(html, 'largePortionName', dish.lPortionName);
                html = insertProperty(html, 'catShortName', course.sName);
                html = insertProperty(html, 'smallPortionQuantity', dish.sPortionQuant);
                html = insertProperty(html, 'largePortionQuantity', dish.lPortionQuant);
                totalSPrice = dish.sPortionQuant * (dish.sPrice === null ? dish.lPrice : dish.sPrice);
                totalLPrice = dish.lPortionQuant * (dish.lPrice === null ? 0 : dish.lPrice);
                orderPrice += totalSPrice + totalLPrice;
                html = insertProperty(html, 'smallPortionTotal', '$' + totalSPrice.toFixed(2));
                if (dish.sPrice === null) {
                    html = insertProperty(html, 'vis', 'hidden');
                    html = insertProperty(html, 'largePortionTotal', '');
                } else {
                    html = insertProperty(html, 'largePortionTotal', '$' + totalLPrice.toFixed(2));
                }
                finalHtml += html;
            }
        }

        finalHtml += "</section>";
        if(orderPrice > 0) {
            basketFooterHtml = insertProperty(basketFooterHtml, 'orderPrice', orderPrice.toFixed(2));
            basketFooterHtml = insertProperty(basketFooterHtml, 'discount', discount);
            basketFooterHtml = insertProperty(basketFooterHtml, 'discOrderPrice', (orderPrice * (1 - discount / 100)).toFixed(2));
            finalHtml += basketFooterHtml;
        }
        return finalHtml;
    };

    var insertItemPrice = function(html, pricePropName, priceValue) {
        if (!priceValue) {
            return insertProperty(html, pricePropName, ' ');
        }
        priceValue = '$' + priceValue.toFixed(2);
        return insertProperty(html, pricePropName, priceValue);
    };

    var insertItemPortionName = function(html, portionPropName, portionValue) {
        if (!portionValue) {
            return insertProperty(html, portionPropName, '');
        }
        portionValue = '(' + portionValue + ')';
        return insertProperty(html, portionPropName, portionValue);
    };

    var insertProperty = function (string, propName, propValue) {
        var propToReplace = '{{' + propName + '}}';
        string = string.replace(new RegExp(propToReplace, 'g'), propValue);
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
        Promise.all([
            courseHtml.getCourseHTML(),
            getCourses(dataFile)
        ]).then(function(results){
            if(results[1].length === 0){
                courseHtml.getCourseEmptyHTML().then(function (result) {
                    mainDiv.innerHTML = result;
                });
            } else {
                mainDiv.innerHTML = buildCourseViewHtml(results[1], results[0]);
                var section = document.getElementById('section');
                section.addEventListener('click', clickCategoryEvent, false);
            }
        });
    };

    var displayDishes = function (courseId) {
        Promise.all([
            dishHtml.getDishTitleHTML(),
            dishHtml.getDishHTML(),
            getDishes(courseId)
        ]).then(function(results){
            mainDiv.innerHTML = buildDishViewHtml(getCourseById(courseId),results[2], results[0], results[1]);
            var basketButton = document.getElementById('basketButton');
            basketButton.addEventListener('click', clickBasketButtonEvent, false);
        });
    };

    var displayBasket = function () {
        var orderAr = JSON.parse(localStorage.getItem('Order'));
        if(orderAr.length === 0){
            basketHtml.getBasketEmptyHTML().then(function (result) {
                mainDiv.innerHTML = result;
            });
        } else {
            Promise.all([
                basketHtml.getBasketHTML(),
                basketHtml.getBasketTitleHTML(),
                basketHtml.getBasketFooterHTML(),
                basketHtml.getDiscount(),
                getCourses('menu.json')
            ]).then(function (result) {
                mainDiv.innerHTML = buildBasketViewHtml(result[0], result[1], result[2], result[3], orderAr);
                var section = document.getElementById('section');
                var orderBut = document.getElementById('orderButton');
                var email = document.getElementById('eMail');
                var time = document.getElementById('timeDelivery');
                var modalForm = document.getElementById('modalForm');
                var sendBut = document.getElementById('sendButton');
                modalForm.addEventListener('invalid', invalidInput, true); //event for deleting default hint while error\
                email.addEventListener('click', changeEmailEvent, false);
                email.addEventListener('input', changeEmailEvent, false);
                time.addEventListener('click', changeTimeEvent, false);
                time.addEventListener('input', changeTimeEvent, false);
                section.addEventListener('click', clickCloseEvent, false);
                section.addEventListener('change', changeQuantEvent, false);
                orderBut.addEventListener('click', clickOrderEvent, false);
                sendBut.addEventListener('click', clickSendEvent, false);
                var quantInputs = mainDiv.getElementsByClassName('quantity');
                for(var i = 0, len = quantInputs.length; i < len; i++){
                    if(quantInputs[i].getAttribute('data-visibility') === 'hidden'){
                        quantInputs[i].style.visibility = 'hidden';
                    }
                }
            });
        }
    };

    function changeEmailEvent() {
        $('#eMailDiv').removeClass('submitted');
        $('#eMail').removeClass('submitted');
    }

    function changeTimeEvent() {
        $('#timeDiv').removeClass('submitted');
        $('#timeDelivery').removeClass('submitted');
    }

    function invalidInput(e) {
        e.target.setCustomValidity(' ');
    }

    function clickSendEvent() {
    }

    function clickOrderEvent() {
        $('body').addClass('modal-open');
        $('#eMail').val('');
        $('#timeDelivery').val('');
        $('.ui-timepicker-list').css('display', 'block');

        $('#timeDelivery').timepicker({
            'minTime': '2:00pm',
            'maxTime': '24:00pm'
        });
        $('#overlay').fadeIn(400, function(){
            $('#modalForm')
                .css('display', 'block')
                .animate({opacity: 1, top: '50%'}, 200);
        });
        $('#modalClose, #overlay').click( function(){
            $('#modalForm')
                .animate({opacity: 0, top: '45%'}, 200,
                    function(){
                        $(this).css('display', 'none');
                        $('#overlay').fadeOut(400);
                    }
                );
            $("body").removeClass("modal-open");
            $('#eMailDiv').removeClass('submitted');
            $('#eMail').removeClass('submitted');
            $('#timeDiv').removeClass('submitted');
            $('#timeDelivery').removeClass('submitted');
            $('.ui-timepicker-list').css('display', 'none');
        });
        $('#sendButton').click(function () {
            var email = $('#eMail').val(),
                time = $('#timeDelivery').val(),
                wishes = $('#wishes').val();
            if(email.length === 0){
                $('#eMailDiv').addClass('submitted');
                $('#eMail').addClass('submitted');
            }
            if(time.length === 0){
                $('#timeDiv').addClass('submitted');
                $('#timeDelivery').addClass('submitted');
            }
            var display = $('.ui-timepicker-wrapper').css('display');
            if(display === 'block') {
                return;
            }
            if(email.length !== 0 && time.length !== 0) {
                $('#eMailDiv').removeClass('submitted');
                $('#eMail').removeClass('submitted');
                $('#timeDiv').removeClass('submitted');
                $('#timeDelivery').removeClass('submitted');
                $('#modalForm')
                    .animate({opacity: 0, top: '45%'}, 200,
                        function () {
                            $(this).css('display', 'none');
                            $('#overlay').fadeOut(400);
                        }
                    );
                $('body').removeClass('modal-open');
                $('.ui-timepicker-list').css('display', 'none');
                var madenOrderAr = JSON.parse(localStorage.getItem('Order'));
                var sendOrderAr = [];
                for(var i = 0, len = madenOrderAr.length; i < len; i++){
                    var dish = {};
                    dish.idCourse = madenOrderAr[i].idCourse;
                    dish.idDish = madenOrderAr[i].dish.id;
                    dish.lPostionQuant = madenOrderAr[i].dish.lPortionQuant;
                    dish.sPortionQuant = madenOrderAr[i].dish.sPortionQuant;
                    sendOrderAr.push(dish);
                }
                var result = {'dishes': sendOrderAr, 'email': email, 'time': time, 'wishes': wishes};
                Promise.all([
                    basketHtml.sendOrder(JSON.stringify(result)),
                    sendOrder(email)
                ]).then(function (result) {
                    console.log(result[0]);
                    // console.log(result[1]);
                });
            }
        });
    }

    function sendOrder(data) {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendSocketRequest(
                data,
                function (status) {
                    resolve(status);
                    console.log(status);
                });
        });
    }
});


