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
                child = checkBoxes[i].parentNode.parentNode.nextSibling.nextSibling.childNodes; //access to quantity dish input (Menu page)
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
            price, oldPrice, totalPrice, newPrice, discTPrice, discElem, discount, priceElem,
            priceElems = target.parentNode.parentNode.nextSibling.nextSibling.childNodes, //access to $price of each portion size (Basket page)
            orderAr = JSON.parse(localStorage.getItem('Order'));
        for(var i = 0, len = orderAr.length; i < len; i++){
            if(Number(orderAr[i].idCourse) === Number(courseId) && orderAr[i].dish.id === Number(dishId)){
                if (id === 'pint') {
                    price = orderAr[i].dish.sPrice || orderAr[i].dish.lPrice;
                    oldPrice = orderAr[i].dish.sPortionQuant * price;
                    priceElem = priceElems[1];
                    orderAr[i].dish.sPortionQuant = quant;
                } else if (id === 'quart') {
                    price = orderAr[i].dish.lPrice;
                    oldPrice =  orderAr[i].dish.lPortionQuant * price;
                    priceElem = priceElems[3];
                    orderAr[i].dish.lPortionQuant = quant;
                }
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
                var modalForm = document.getElementById('modalForm');
                modalForm.addEventListener('invalid', invalidInput, true); //event for deleting default hint while error\
                section.addEventListener('click', clickCloseEvent, false);
                section.addEventListener('change', changeQuantEvent, false);
                orderBut.addEventListener('click', clickOrderEvent, false);
                var quantInputs = mainDiv.getElementsByClassName('quantity');
                for(var i = 0, len = quantInputs.length; i < len; i++){
                    if(quantInputs[i].getAttribute('data-visibility') === 'hidden'){
                        quantInputs[i].style.visibility = 'hidden';
                    }
                }
            });
        }
    };


    function clickOrderEvent() {
        var modalForm;
        if ('ontransitionstart' in window) {
            $('#modalForm').one('transitionstart', addModalForm);
                modalForm = $('#modalForm');
            modalForm.addClass('appear');
        } else {
            $('#modalForm').css('display', 'block');
                modalForm = $('#modalForm');
            setTimeout(function () {
                modalForm.addClass('appear');
            }, 300);
        }
        var modalClose = $('#modalClose'),
            overlay = $('#overlay'),
            body = $('body'),
            eMail = $('#eMail'),
            timeDelivery = $('#timeDelivery'),
            addressD = $('#addressD'),
            timepickerList = $('.ui-timepicker-list'),
            eMailDiv = $('#eMailDiv'),
            eMailError = $('#eMailError'),
            date = new Date(),
            hours = date.getHours(),
            minutes = date.getMinutes();

        body.addClass('modal-open');
        eMail.val('');
        timeDelivery.val('');
        addressD.val('');
        minutes = minutes > 30 ? 30 : '00';

        var strTime = hours-11+':'+minutes+'pm';

        timeDelivery.timepicker({
            'minTime': strTime,
            'maxTime': '24:00pm'
        });
        timeDelivery.click(function () {
            timepickerList.css('display', 'block');
        });

        overlay.fadeIn(400);

        modalClose.click(closeModalForm);
        overlay.click(closeModalForm);
        $('#sendButton').click(function () {
            var email = eMail.val(),
                time = timeDelivery.val(),
                address = addressD.val(),
                wish = $('#wishes').val();
            if(email.length === 0){
                eMailDiv.addClass('submitted');
                eMailDiv.attr('data-email', 'Please, enter e-mail');
                eMailError.addClass('submitted');
                eMailError.text('Please, enter e-mail');
                eMail.addClass('submitted');
                eMail.one('input', changeEmailEvent);
            }
            if(time.length === 0){
                $('#timeDiv').addClass('submitted');
                timeDelivery.addClass('submitted');
                $('#timeError').addClass('submitted');
                timeDelivery.one('change', changeTimeEvent);
            }
            if(address.length === 0){
                $('#addressDiv').addClass('submitted');
                addressD.addClass('submitted');
                $('#addressError').addClass('submitted');
                addressD.one('input', changeAddressEvent);
            }
            var display = $('.ui-timepicker-wrapper').css('display');
            if(display === 'block') {
                return;
            }
            if(email.length !== 0 && !validateEmail(email)){
                eMailDiv.addClass('submitted');
                eMailError.addClass('submitted');
                eMail.addClass('submitted');
                eMailDiv.attr('data-email', 'Wrong e-mail');
                eMailError.text('Wrong e-mail');
                eMail.one('input', changeEmailEvent);
            }
            if(email.length !== 0 && validateEmail(email) && time.length !== 0 && address.length !== 0) {
                removeClassSubmitted();
                modalForm.one('transitionend', removeModalForm);
                overlay.fadeOut(400);

                body.removeClass('modal-open');
                timepickerList.css('display', 'none');
                var madenOrderAr = JSON.parse(localStorage.getItem('Order')),
                    sendOrderAr = [],
                    result,
                    dish;
                for(var i = 0, len = madenOrderAr.length; i < len; i++){
                    dish = {};
                    dish.idCourse = madenOrderAr[i].idCourse;
                    dish.idDish = madenOrderAr[i].dish.id;
                    dish.lPostionQuant = madenOrderAr[i].dish.lPortionQuant;
                    dish.sPortionQuant = madenOrderAr[i].dish.sPortionQuant;
                    sendOrderAr.push(dish);
                }
                result = {'dishes': sendOrderAr, 'email': email, 'time': time, 'address': address, 'wishes': wish};
                Promise.all([
                    //basketHtml.sendOrder(JSON.stringify(result)),
                    sendWithSocket(JSON.stringify(createSocketFormat('processNewOrder', result)))
                ]).then(function (result) {
                    console.log(result[0]);
                    //console.log(result[1]);
                });
            }
        });
    }

    function createSocketFormat(method, params) {
        return {
            'jsonrpc': '2.0',
            'method': method,
            'params': JSON.stringify(params),
            'id': Math.random()
        }
    }

    function changeEmailEvent() {
        $('#eMailDiv').removeClass('submitted');
        $('#eMail').removeClass('submitted');
        $('#eMailError').removeClass('submitted');
    }

    function changeTimeEvent() {
        $('#timeDiv').removeClass('submitted');
        $('#timeDelivery').removeClass('submitted');
        $('#timeError').removeClass('submitted');
    }

    function changeAddressEvent() {
        $('#addressDiv').removeClass('submitted');
        $('#addressD').removeClass('submitted');
        $('#addressError').removeClass('submitted');
    }

    function invalidInput(e) {
        e.target.setCustomValidity(' ');
    }

    function closeModalForm() {
        var modalForm = $('#modalForm');
        modalForm.removeClass('appear');
        modalForm.one('transitionend', removeModalForm);
        $('#overlay').fadeOut(400);

        $('body').removeClass('modal-open');
        removeClassSubmitted();
        $('.ui-timepicker-list').css('display', 'none');
    }

    function removeClassSubmitted() {
        $('#eMailDiv').removeClass('submitted');
        $('#eMail').removeClass('submitted');
        $('#timeDiv').removeClass('submitted');
        $('#timeDelivery').removeClass('submitted');
        $('#addressD').removeClass('submitted');
        $('#addressDiv').removeClass('submitted');
        $('#eMailError').removeClass('submitted');
        $('#timeError').removeClass('submitted');
        $('#addressError').removeClass('submitted');
        $('#modalForm').removeClass('appear');
    }

    function validateEmail(email){
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    function removeModalForm() {
        $('#modalForm').css('display', 'none');
        $('#sendButton').unbind('click');
        $('#modalClose').unbind('click');
        $('#overlay').unbind('click');
    }

    function addModalForm() {
        $('#modalForm').css('display', 'block');
    }

    function sendWithSocket(data) {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendSocketRequest(
                data,
                function (status) {
                    resolve(status);
                });
        });
    }
});


