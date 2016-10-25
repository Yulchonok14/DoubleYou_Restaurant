$(function () {

    'use strict';

    var dEmptyHtml = "snippets/course-empty-snippet.html";
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
        });
    };

    CourseHtml.prototype.getCourseEmptyHTML = function () {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendGetRequest(
                dEmptyHtml,
                function (courseEmptyHtml) {
                    resolve(courseEmptyHtml);
                });
        });
    };

    window.CourseHtml = CourseHtml;

});