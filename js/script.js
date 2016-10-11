(function () {

    var homeSnippet = 'snippets/home-snippet.html';
    var menuSnippet = 'snippets/menu-snippet.html';
    var basketSnippet = 'snippets/basket-snippet.html';
    var historySnippet = 'snippets/history-snippet.html';
    var categorySnippet = "snippets/category-snippet.html";
    var itemSnippet = "snippets/item-snippet.html";
    var containerNav = document.getElementById('container');
    var categories;

    containerNav.addEventListener('click', clickNavEvent, false);

    function clickCategoryEvent(e) {
        var target = e.target;
        var short_name = target.parentNode.getAttribute('data-short-name');
        var items = getItems(short_name);
        getAllItems(items[0], items[1], itemSnippet);
    }

    function getItems(short_name) {
        var items = [];
        for(var i = 0; i < categories.length; i++){
            if(categories[i].short_name === short_name){
               return [categories[i].short_name, categories[i].menu_items];
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
                getAllCategories('menu.json');
                //changeContent(menuSnippet);
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


    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    var changeContent = function(url){
        $ajaxUtils.sendGetRequest(
            url,
            function (html) {
                insertHtml('#main-content', html);
            }
        );
    };

    var getAllCategories = function (url) {
        $ajaxUtils.sendGetRequest(
            url,
            function (json) {
                categories = JSON.parse(json);
                $ajaxUtils.sendGetRequest(
                    categorySnippet,
                    function (html) {
                        result = formCategoryHtml(categories, html);
                        insertHtml('#main-content', result);
                        var section = document.getElementById('section');
                        section.addEventListener('click', clickCategoryEvent, false);
                    }
                );
            }
        );
    };

    var getAllItems = function (categoryShortName, items, itemSnippet) {
        $ajaxUtils.sendGetRequest(
            itemSnippet,
            function (html) {
                result = formItemHtml(categoryShortName, items, html);
                insertHtml('#main-content', result);
                var input = document.getElementById('quantity');
                input.addEventListener('click', clickInputEvent, false);
            }
        );
    };

    function clickInputEvent(e) {
        e.preventDefault();
        $(this).blur();
        return false;
    }

    var formCategoryHtml = function (json, html) {
        var resultHtml = "<section class='row' id='section'>",
            categoryHtml, name;
        for(var i = 0; i < json.length; i++){
            categoryHtml = html;
            name = json[i].name;
            categoryHtml = insertProperty(categoryHtml, "name", name);
            categoryHtml = insertProperty(categoryHtml, "short_name", json[i].short_name);
            resultHtml += categoryHtml;
        }
        resultHtml += '</section>';
        return resultHtml;
    };

    var formItemHtml = function(categoryShortName, json, html){
        var finalHtml = "<section class='row'>";

        for (var i = 0; i < json.length; i++) {
            var itemHtml = html;
            itemHtml =
                insertProperty(itemHtml, "short_name", json[i].short_name);
            itemHtml =
                insertProperty(itemHtml,
                    "catShortName",
                    categoryShortName);
            itemHtml =
                insertItemPrice(itemHtml,
                    "price_small",
                    json[i].price_small);
            itemHtml =
                insertItemPortionName(itemHtml,
                    "small_portion_name",
                    json[i].small_portion_name);
            itemHtml =
                insertItemPrice(itemHtml,
                    "price_large",
                    json[i].price_large);
            itemHtml =
                insertItemPortionName(itemHtml,
                    "large_portion_name",
                    json[i].large_portion_name);
            itemHtml =
                insertProperty(itemHtml,
                    "name",
                    json[i].name);
            itemHtml =
                insertProperty(itemHtml,
                    "description",
                    json[i].description);

            finalHtml += itemHtml;
        }

        finalHtml += '</section>';
        return finalHtml;
    };

    function insertItemPrice(html,
                             pricePropName,
                             priceValue) {
        if (!priceValue) {
            return insertProperty(html, pricePropName, '');
        }
        priceValue = '$' + priceValue.toFixed(2);
        html = insertProperty(html, pricePropName, priceValue);
        return html;
    }

    function insertItemPortionName(html,
                                   portionPropName,
                                   portionValue) {
        if (!portionValue) {
            return insertProperty(html, portionPropName, '');
        }
        portionValue = '(' + portionValue + ')';
        html = insertProperty(html, portionPropName, portionValue);
        return html;
    }

    var insertProperty = function (string, propName, propValue) {
        var propToReplace = '{{' + propName + '}}';
        string = string
            .replace(new RegExp(propToReplace, 'g'), propValue);
        return string;
    };

    changeContent(homeSnippet);

})();

$(function () {
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
