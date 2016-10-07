(function () {

    var homeButton = document.getElementById('navHomeButton');
    var menuButton = document.getElementById('navMenuButton');
    var basketButton = document.getElementById('navBasketButton');
    var historyButton = document.getElementById('navHistoryButton');
    var arrButton = [homeButton, menuButton, basketButton, historyButton];

    homeButton.addEventListener('click', clickRowEvent, false);
    menuButton.addEventListener('click', clickRowEvent, false);
    basketButton.addEventListener('click', clickRowEvent, false);
    historyButton.addEventListener('click', clickRowEvent, false);

    function clickRowEvent(e) {
        var target = e.target,
            currentButton,
            classes;
        for(var button in arrButton){
            classes = arrButton[button].className;
            if(classes.indexOf('active') !== -1){
                classes = classes.replace(new RegExp('active', 'g'), '');
                arrButton[button].className = classes;
                break;
            }
        }
        switch(target.id){
            case 'homeRef': {
                currentButton = homeButton;
                break;
            }
            case 'menuRef': {
                currentButton = menuButton;
                break;
            }
            case 'basketRef': {
                currentButton = basketButton;
                break;
            }
            case 'historyRef': {
                currentButton = historyButton;
                break;
            }
        }
        classes = target.parentNode.className;
        if(classes.indexOf('active') == -1){
            currentButton.classList.add('active');
        }
    }

    var dc = {};

    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    dc.changeContent = function(url){
        $ajaxUtils.sendGetRequest(
            url,
            function (html) {
                insertHtml('#main-content', html);
            });
    };

    window.$dc = dc;

})();

$(function () {
    $("#navbarToggle").blur(function (event) {

        var screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            $("#collapsable-nav").collapse('hide');
        }
        //switchMenuToActive(event);
    });
    var switchMenuToActive = function (e) {
        //var target = e.target();
        var arrButton = [];
        var classes = '';
        arrButton.push(document.querySelector('#navHomeButton'));
        arrButton.push(document.querySelector('#navMenuButton'));
        arrButton.push(document.querySelector('#navBusketButton'));
        arrButton.push(document.querySelector('#navHistoryButton'));

        for(var button in arrButton){
            classes = button.className;
            if(classes.indexOf('active') !== -1){
                classes = classes.replace(new RegExp('active', 'g'), '');
                arrButton[button].className = classes;
            }
        }

        // classes = document.querySelector('#navHomeButton').className;
        // classes = classes.replace(new RegExp('active', 'g'), '');
        // document.querySelector('#navHomeButton').className = classes;
        //
        // classes = document.querySelector('#navMenuButton').className;
        // if (classes.indexOf('active') == -1) {
        //     document.querySelector("#navMenuButton").classList.add('active');
        // }
    };
});
