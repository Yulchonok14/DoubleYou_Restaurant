$(function () {

    'use strict';

    var cHtml = "snippets/course-snippet.html";

    function CourseHtml() {}

    var restaurantAPI = new RestaurantAPI();

    CourseHtml.prototype.getCourseHTML = function () {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendGetRequest(
                cHtml,
                function (courseHtml) {
                    resolve(courseHtml);
                });
        })
    };

    window.CourseHtml = CourseHtml;

});