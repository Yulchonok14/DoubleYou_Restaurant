$(function () {

    'use strict';

    var homeSnippet = 'snippets/home-snippet.html',
        containerNav = document.getElementById('container'),
        mainDiv = document.getElementById('main-content'),
        discount = 0,
        email = '';

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
        basketHtml = new BasketHtml(),
        historyHtml = new HistoryHtml();

    containerNav.addEventListener('click', clickNavEvent, false);

    function clickCategoryEvent(e) {
        var target = e.target,
            sName = target.parentNode.getAttribute('data-short-name'),
            index;
        if (typeof menu.findIndex === 'function'){
            index = menu.findIndex(function (item) {
                return item.sName === sName;
            });
        } else {
            for (var j = 0, len = menu.length; j < len; j++) {
                if (menu[j].sName === sName) {
                    index = j;
                    break;
                }
            }
        }
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
                displayCourses();
                break;
            }
            case 'basketRef': {
                displayBasket();
                break;
            }
            case 'historyRef': {
                displayHistory();
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
            madenOrderAr = JSON.parse(localStorage.getItem('Order'))||[];
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
            var line = target.parentNode.nextSibling.nextSibling,
                id = target.parentNode.getAttribute('data-id'),
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
            setTimeout(function () {
                $('#collapsable-nav').collapse('hide');
            }, 20);
        }
    }
    $('#navbarToggle').blur(function (event) {
        closeMenu();
    });


    var getCourses = function () {
        if(menu.length !== 0){
            return menu;
        } else {
            return new Promise(function(resolve, reject) {
                restaurantAPI.sendGetRequest(
                    '/menu',
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
        var index;
        if(menu.length !== 0){
            if (typeof menu.findIndex === 'function'){
                index = menu.findIndex(function (course) {
                    return course.id === courseId;
                });
            } else {
                for (var j = 0, len = menu.length; j < len; j++) {
                    if (menu[j].id === courseId) {
                        index = j;
                        break;
                    }
                }
            }
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

    var buildBasketViewHtml = function (basketHtml, basketFooterHtml, discount, orderAr) {
        var finalHtml = '<h2 class="text-center">Your Order</h2>';
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
                html = insertItemPrice(html, 'smallPortionTotal', totalSPrice);
                if (dish.sPrice === null) {
                    html = insertProperty(html, 'vis', 'hidden');
                    html = insertProperty(html, 'largePortionTotal', '');
                } else {
                    html = insertItemPrice(html, 'largePortionTotal', totalLPrice);
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

    var buildHistoryTableViewHtml = function (historyAr, historyHtml, historyHeaderHtml, historyFooterHtml, historySearchHtml) {
        var finalHtml = historySearchHtml;
        finalHtml += "<h2 class='text-center'>Your History</h2>";
        finalHtml += "<section id='section' class='row'><table id='tableHistory' class='table-responsive'>";
        var dishes, date, status, price, totalSPrice, totalLPrice, orderPrice = 0, discount;
        var table = document.createElement('table'),
            tr = document.createElement('tr'),
            th = document.createElement('th'),
            td = document.createElement('td'),
            trHead = tr.cloneNode(true),
            thDate = th.cloneNode(true),
            thOrder = th.cloneNode(true),
            thStatus = th.cloneNode(true),
            div = document.createElement('div');
        thDate.textContent = 'Date';
        thOrder.textContent = 'Order';
        thStatus.textContent = 'Status/Price';
        trHead.appendChild(thDate);
        trHead.appendChild(thOrder);
        trHead.appendChild(thStatus);
        table.id = 'tableHistory';
        table.appendChild(trHead);
        for (var i = 0, len = historyAr.length; i < len; i++) {
            var trBody = tr.cloneNode(true),
                tdDate = td.cloneNode(true),
                tdOrder = td.cloneNode(true),
                html = '';
            tdDate.textContent = historyAr[i].date;
            trBody.appendChild(tdDate);
            dishes = historyAr[i].dishes;
            date = historyAr[i].date;
            status = historyAr[i].status;
            price = Number(historyAr[i].price);
            discount = Number(historyAr[i].discount);
            for(var j = 0, leng = dishes.length; j < leng; j++){
                var dish = getDish(Number(dishes[j].idCourse), Number(dishes[j].idDish)),
                    course = getCourseById(Number(dishes[j].idCourse));
                html += historyHtml;
                html = insertProperty(html, 'id', dish.id);
                html = insertProperty(html, 'idCourse', course.id);
                html = insertProperty(html, 'name', dish.name);
                html = insertProperty(html, 'shortName', dish.sName);
                html = insertItemPrice(html, 'priceSmall', dish.sPrice);
                html = insertItemPortionName(html, 'smallPortionNamePrice', dish.sPortionName);
                html = insertItemPortionName(html, 'largePortionNamePrice', dish.lPortionName);
                html = insertItemPrice(html, 'priceLarge', dish.lPrice);
                html = insertProperty(html, 'catShortName', course.sName);
                if(dishes[j].lPortionQuant === 0){
                    html = insertProperty(html, 'largePortionQuantity', '');
                    html = insertItemPortionName(html, 'largePortionName', '');
                } else {
                    html = insertProperty(html, 'largePortionQuantity', dishes[j].lPortionQuant);
                    html = insertItemPortionName(html, 'largePortionName', dish.lPortionName);
                }
                totalSPrice = dishes[j].sPortionQuant * (dish.sPrice === null ? dish.lPrice : dish.sPrice);
                totalLPrice = dishes[j].lPortionQuant * (dish.lPrice === null ? 0 : dish.lPrice);
                orderPrice += totalSPrice + totalLPrice;
                html = insertItemPrice(html, 'smallPortionTotal', totalSPrice);
                if (dish.sPrice === null) {
                    html = insertProperty(html, 'largePortionTotal', '');
                } else {
                    html = insertItemPrice(html, 'largePortionTotal', totalLPrice);
                }
                if (dishes[j].sPortionQuant === 0){
                    html = insertProperty(html, 'smallPortionQuantity', '');
                    html = insertItemPortionName(html, 'smallPortionName', '');
                } else {
                    html = insertProperty(html, 'smallPortionQuantity', dishes[j].sPortionQuant);
                    html = insertItemPortionName(html, 'smallPortionName', dish.sPortionName);
                }
            }
            tdOrder.innerHTML = html;
            trBody.appendChild(tdOrder);
            var tdStatus = td.cloneNode(true),
                divStatus = div.cloneNode(true),
                divPrice = div.cloneNode(true),
                divDiscount = div.cloneNode(true),
                divWrapper = div.cloneNode(true);
            divStatus.textContent = historyAr[i].status;
            tdStatus.appendChild(divStatus);
            divDiscount.textContent = -discount + '%';
            divPrice.textContent = '$' + price;
            divWrapper.appendChild(divDiscount);
            divWrapper.appendChild(divPrice);
            divWrapper.id = 'divWrapper';
            tdStatus.appendChild(divWrapper);
            trBody.appendChild(tdStatus);
            table.appendChild(trBody);
            html = table.innerHTML;
        }
        finalHtml += html;
        finalHtml += "</table></section>";
        return finalHtml;
    };

    var buildHistoryViewHtml = function (historyAr, historyHtml, historyHeaderHtml, historyFooterHtml, historySearchHtml) {
        var finalHtml = historySearchHtml;
        finalHtml += "<h2 class='text-center'>Your History</h2>";
        finalHtml += "<section id='section' class='row'>";
        var dishes, date, status, price, totalSPrice, totalLPrice, orderPrice = 0, html = "", discount;
        for (var i = 0, len = historyAr.length; i < len; i++) {
            dishes = historyAr[i].dishes;
            date = historyAr[i].date;
            status = historyAr[i].status;
            price = Number(historyAr[i].price);
            discount = Number(historyAr[i].discount);
            html += historyHeaderHtml;
            html = insertProperty(html, 'date', date);
            html = insertProperty(html, 'status', status);
            for(var j = 0, leng = dishes.length; j < leng; j++){
                var dish = getDish(Number(dishes[j].idCourse), Number(dishes[j].idDish)),
                    course = getCourseById(Number(dishes[j].idCourse));
                html += historyHtml;
                html = insertProperty(html, 'id', dish.id);
                html = insertProperty(html, 'idCourse', course.id);
                html = insertProperty(html, 'name', dish.name);
                html = insertProperty(html, 'shortName', dish.sName);
                html = insertItemPrice(html, 'priceSmall', dish.sPrice);
                html = insertItemPortionName(html, 'smallPortionNamePrice', dish.sPortionName);
                html = insertItemPortionName(html, 'largePortionNamePrice', dish.lPortionName);
                html = insertItemPrice(html, 'priceLarge', dish.lPrice);
                html = insertProperty(html, 'catShortName', course.sName);
                if(dishes[j].lPortionQuant === 0){
                    html = insertProperty(html, 'largePortionQuantity', '');
                    html = insertItemPortionName(html, 'largePortionName', '');
                } else {
                    html = insertProperty(html, 'largePortionQuantity', dishes[j].lPortionQuant);
                    html = insertItemPortionName(html, 'largePortionName', dish.lPortionName);
                }
                totalSPrice = dishes[j].sPortionQuant * (dish.sPrice === null ? dish.lPrice : dish.sPrice);
                totalLPrice = dishes[j].lPortionQuant * (dish.lPrice === null ? 0 : dish.lPrice);
                orderPrice += totalSPrice + totalLPrice;
                html = insertItemPrice(html, 'smallPortionTotal', totalSPrice);
                if (dish.sPrice === null) {
                    html = insertProperty(html, 'largePortionTotal', '');
                } else {
                    html = insertItemPrice(html, 'largePortionTotal', totalLPrice);
                }
                if (dishes[j].sPortionQuant === 0){
                    html = insertProperty(html, 'smallPortionQuantity', '');
                    html = insertItemPortionName(html, 'smallPortionName', '');
                } else {
                    html = insertProperty(html, 'smallPortionQuantity', dishes[j].sPortionQuant);
                    html = insertItemPortionName(html, 'smallPortionName', dish.sPortionName);
                }
            }
            html += historyFooterHtml;
            html = insertProperty(html, 'discount', -discount + '%');
            html = insertItemPrice(html, 'totalPrice', price);
        }
        finalHtml += html;
        finalHtml += "</section>";
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
        var index = 0;
        if(menu.length !== 0){
            if (typeof menu.findIndex === 'function'){
                index = menu.findIndex(function (course) {
                    return course.id === courseId;
                });
            } else {
                for (var j = 0, len = menu.length; j < len; j++) {
                    if (menu[j].id === courseId) {
                        index = j;
                        break;
                    }
                }
            }
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
        if(!orderAr || orderAr.length === 0){
            basketHtml.getBasketEmptyHTML().then(function (result) {
                mainDiv.innerHTML = result;
            });
        } else {
            Promise.all([
                basketHtml.getBasketHTML(),
                basketHtml.getBasketFooterHTML(),
                basketHtml.getDiscount(),
                getCourses()
            ]).then(function (result) {
                mainDiv.innerHTML = buildBasketViewHtml(result[0], result[1], result[2], orderAr);
                discount = result[2];
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

    var displayHistory = function () {
        historyHtml.getHistorySearchHTML().then(function (result) {
            var html = "<div id='history'>";
            html += result;
            html += "</div>";
            mainDiv.innerHTML = html;
            var searchButton = document.getElementById('historyButton');
            searchButton.addEventListener('click', clickHistoryButton, true);
        });
        if(email !== ''){
            clickHistoryButton();
        }
    };

    function clickHistoryButton(e) {
        var eMail;
        if(e) {
            var target = e.target;
            eMail = target.previousElementSibling.value;
            if (eMail !== '') {
                email = eMail;
            }
        }
        historyHtml.sendEmail(email).then(function (result) {
            if(JSON.parse(result).length !== 0) {
                var width = window.innerWidth || document.body.clientWidth;
                Promise.all([
                    historyHtml.getHistoryHTML(),
                    historyHtml.getHistoryHeaderHTML(),
                    historyHtml.getHistoryFooterHTML(),
                    historyHtml.getHistorySearchHTML(),
                    getCourses()
                ]).then(function (resultHtml) {
                    if(width > 767){
                        mainDiv.innerHTML = buildHistoryTableViewHtml(JSON.parse(result), resultHtml[0], resultHtml[1], resultHtml[2], resultHtml[3]);
                    } else {
                        mainDiv.innerHTML = buildHistoryViewHtml(JSON.parse(result), resultHtml[0], resultHtml[1], resultHtml[2], resultHtml[3]);
                    }
                    document.getElementById('historyEmail').value = email;
                    console.log(document.getElementById('pint').textContent);
                    var quantArr = document.getElementsByClassName('quantityHist');
                    for (var i = 0, len = quantArr.length; i < len; i++) {
                        if (quantArr[i].textContent == '') {
                            quantArr[i].parentNode.style.display = 'none';
                        }
                    }
                    var searchButton = document.getElementById('historyButton');
                    searchButton.addEventListener('click', clickHistoryButton, true);
                })
            } else {
                Promise.all([
                    historyHtml.getHistorySearchHTML(),
                    historyHtml.getHistoryEmptyHTML()])
                .then(function (result) {
                    var html = "<div id='history'>";
                    html += result[0];
                    html += result[1];
                    html += "</div>";
                    mainDiv.innerHTML = html;
                    var searchButton = document.getElementById('historyButton');
                    searchButton.addEventListener('click', clickHistoryButton, true);
                });
            }
        });
    }

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
            minutes = date.getMinutes(),
            wishes = $('#wishes');

        body.addClass('modal-open');
        eMail.val('');
        timeDelivery.val('');
        addressD.val('');
        wishes.val('');
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
                wish = wishes.val();
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
                    dish.lPortionQuant = madenOrderAr[i].dish.lPortionQuant;
                    dish.sPortionQuant = madenOrderAr[i].dish.sPortionQuant;
                    sendOrderAr.push(dish);
                }
                result = {'dishes': sendOrderAr, 'email': email, 'time': time, 'address': address, 'wishes': wish, 'price': totalPrice(sendOrderAr), 'discount': discount};

                sendWithSocket(JSON.stringify(createSocketFormat('processNewOrder', result)))
                    .then(function (result) {
                        console.log(result);
                        localStorage.setItem('Order', '[]');
                        basketHtml.getBasketEmptyHTML().then(function (result) {
                            mainDiv.innerHTML = result;
                        });
                    });
            }
        });
    }

    function totalPrice(dishesArr) {
        var dish, dishSmall, dishLarge, resultPrice = 0;
        for(var i = 0, len = dishesArr.length; i < len; i++){
            dish = getDish(dishesArr[i].idCourse, dishesArr[i].idDish);
            dishSmall = dish.sPrice !== null ? dish.sPrice * dishesArr[i].sPortionQuant : dish.lPrice * dishesArr[i].sPortionQuant;
            dishLarge =  dish.lPrice !== null ? dish.lPrice * dishesArr[i].lPortionQuant : 0;
            resultPrice += dishSmall + dishLarge;
        }
        return (resultPrice * (1 - Number(discount) / 100)).toFixed(2);
    }

    function createSocketFormat(method, params) {
        return {
            'jsonrpc': '2.0',
            'method': method,
            'params': JSON.stringify(params),
            'id': createGuid()
        }
    }

    function createGuid()
    {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
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


