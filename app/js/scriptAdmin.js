$(function () {

    'use strict';

    var containerNav = document.getElementById('container'),
        mainDiv = document.getElementById('main-content');

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

    var changeContent = function(url){
        restaurantAPI.sendGetRequest(
            url,
            function (html) {
                mainDiv.innerHTML = html;
            }
        );
    };

    //changeContent(homeSnippet);

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
                break;
            }
            case 'basketRef': {
                break;
            }
            case 'historyRef': {
                break;
            }
        }
        classes = target.parentNode.className;
        if(classes.indexOf('active') == -1){
            target.parentNode.classList.add('active');
        }
    }
    containerNav.addEventListener('click', clickNavEvent, false);

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

});

