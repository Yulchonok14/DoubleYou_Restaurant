(function () {

    var dc = {};

    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    dc.changeContent = function(url){
        $ajaxUtils.sendGetRequest(
            url,
            function (html) {
                insertHtml("#main-content", html);
            });
    };

    window.$dc = dc;

})();

