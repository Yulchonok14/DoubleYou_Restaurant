$(function(){"use strict";function e(){}var t=io("http://localhost:80/");e.prototype.sendGetRequest=function(e,t){var n=new XMLHttpRequest;n.open("GET",e,!0),n.addEventListener("load",function(){"function"==typeof t&&t(n.response)}),n.addEventListener("error",function(e){console.log(e)}),n.send()},e.prototype.sendPostRequest=function(e,t,n){var i=new XMLHttpRequest;i.open("POST",t,!0),i.addEventListener("load",function(){"function"==typeof n&&n(i.response)}),i.addEventListener("error",function(e){console.log(e)}),i.send(e)},e.prototype.sendSocketRequest=function(e,n){t.send(e),t.on("message",function(e){var t=e;"function"==typeof n&&n(t)})},window.RestaurantAPI=e}),$(function(){"use strict";function e(e,n,i,r,o){this.id=e,this.sName=n,this.name=i,this.spInstruc=r,this.items=[],t(o,this)}function t(e,t){if(e&&0!==e.length)for(var n=0,i=e.length;n<i;n++){var r=new Dish(e[n].id,e[n].short_name,e[n].name,e[n].description,e[n].price_small,e[n].price_large,e[n].small_portion_name,e[n].large_portion_name);t.items.push(r)}}window.Course=e}),$(function(){"use strict";function e(){}var t="snippets/course-empty-snippet.html",n="snippets/course-snippet.html",i=new RestaurantAPI;e.prototype.getCourseHTML=function(){return new Promise(function(e,t){i.sendGetRequest(n,function(t){e(t)})})},e.prototype.getCourseEmptyHTML=function(){return new Promise(function(e,n){i.sendGetRequest(t,function(t){e(t)})})},window.CourseHtml=e}),$(function(){"use strict";function e(e,t,n,i,r,o,s,a){this.id=e,this.sName=t,this.name=n,this.description=i,this.sPrice=r,this.lPrice=o,this.sPortionName=s,this.lPortionName=a,this.sPortionQuant=0,this.lPortionQuant=0}window.Dish=e}),$(function(){"use strict";function e(){}var t="snippets/dish-title-snippet.html",n="snippets/dish-snippet.html",i="snippets/dish-empty-snippet.html",r=new RestaurantAPI;e.prototype.getDishHTML=function(){return new Promise(function(e,t){r.sendGetRequest(n,function(t){e(t)})})},e.prototype.getDishTitleHTML=function(){return new Promise(function(e,n){r.sendGetRequest(t,function(t){e(t)})})},e.prototype.getDishEmptyHTML=function(){return new Promise(function(e,t){r.sendGetRequest(i,function(t){e(t)})})},window.DishHtml=e}),$(function(){"use strict";function e(){}var t="snippets/basket-empty-snippet.html",n="snippets/basket-snippet.html",i="snippets/basket-footer-snippet.html",r=new RestaurantAPI;e.prototype.getBasketEmptyHTML=function(){return new Promise(function(e,n){r.sendGetRequest(t,function(t){e(t)})})},e.prototype.getBasketHTML=function(){return new Promise(function(e,t){r.sendGetRequest(n,function(t){e(t)})})},e.prototype.getBasketFooterHTML=function(){return new Promise(function(e,t){r.sendGetRequest(i,function(t){e(t)})})},e.prototype.getDiscount=function(){return new Promise(function(e,t){r.sendGetRequest("/discount",function(t){e(t)})})},e.prototype.sendOrder=function(e){return new Promise(function(t,n){r.sendPostRequest(e,"/order",function(e){t(e)})})},window.BasketHtml=e}),$(function(){"use strict";function e(){}var t="snippets/history-empty-snippet.html",n="snippets/history-search-snippet.html",i="snippets/history-snippet-header.html",r="snippets/history-snippet-footer.html",o="snippets/history-snippet.html",s=new RestaurantAPI;e.prototype.getHistoryEmptyHTML=function(){return new Promise(function(e,n){s.sendGetRequest(t,function(t){e(t)})})},e.prototype.getHistorySearchHTML=function(){return new Promise(function(e,t){s.sendGetRequest(n,function(t){e(t)})})},e.prototype.getHistoryHeaderHTML=function(){return new Promise(function(e,t){s.sendGetRequest(i,function(t){e(t)})})},e.prototype.getHistoryFooterHTML=function(){return new Promise(function(e,t){s.sendGetRequest(r,function(t){e(t)})})},e.prototype.getHistoryHTML=function(){return new Promise(function(e,t){s.sendGetRequest(o,function(t){e(t)})})},e.prototype.sendEmail=function(e){return new Promise(function(t,n){s.sendPostRequest(e,"/history",function(e){t(e)})})},window.HistoryHtml=e}),$(function(){"use strict";function e(){}function t(e){var t,n=e.target,i=n.parentNode.getAttribute("data-short-name");if("function"==typeof E.findIndex)t=E.findIndex(function(e){return e.sName===i});else for(var r=0,o=E.length;r<o;r++)if(E[r].sName===i){t=r;break}if(t>=0){var s=E[t];V(s.id)}else S.getDishEmptyHTML().then(function(e){C.innerHTML=e})}function n(e){var t,n,i,r=e.target;"brand-name"!==r.id&&"logo-img"!==r.id||R(H),r=s(e),t=r.parentNode.parentNode,n=t.querySelectorAll("li");for(var o in Object.keys(n))if(i=n[o].className,i.indexOf("active")!==-1){i=i.replace(new RegExp("active","g"),""),n[o].className=i;break}switch(r.id){case"homeRef":R(H);break;case"menuRef":Y();break;case"basketRef":z();break;case"historyRef":K()}i=r.parentNode.className,i.indexOf("active")==-1&&r.parentNode.classList.add("active")}function i(e){for(var t,n,i,r,o,s=document.getElementsByTagName("input"),a=!1,u=JSON.parse(localStorage.getItem("Order"))||[],d=0,l=s.length;d<l;d++)if("checkbox"===s[d].type&&s[d].checked===!0){t={},n=s[d].parentNode.parentNode.parentNode,i=s[d].parentNode.parentNode.nextSibling.nextSibling.childNodes,r=i[4].value;for(var c=0,m=u.length;c<m;c++)if(Number(u[c].idCourse)===Number(n.getAttribute("data-id-course"))&&Number(u[c].dish.id)===Number(n.getAttribute("data-id"))){u[c].dish.sPortionQuant+=Number(r),a=!0;break}a||(o=q(n.getAttribute("data-id-course"),n.getAttribute("data-id")),o.sPortionQuant=Number(r),t.idCourse=n.getAttribute("data-id-course"),t.dish=o,u.push(t)),s[d].checked=!1,i[4].value="1"}0!==u.length&&localStorage.setItem("Order",JSON.stringify(u))}function r(e){var t,n,i,r,o,s,a=e.target;if(a.classList.contains("delete")){var u=a.parentNode.nextSibling.nextSibling,d=a.parentNode.getAttribute("data-id"),l=JSON.parse(localStorage.getItem("Order"));a=e.target.parentNode;for(var c=0,m=l.length;c<m;c++)if(l[c].dish.id===Number(d)){o=null===l[c].dish.sPrice?l[c].dish.sPortionQuant*l[c].dish.lPrice:l[c].dish.sPortionQuant*l[c].dish.sPrice+l[c].dish.lPortionQuant*l[c].dish.lPrice,l.splice(c,1),t=document.getElementById("dollars"),n=document.getElementById("discDollars"),i=document.getElementById("discount"),s=Number(i.innerText.substr(1,i.innerText.length-2)),r=Number(t.innerText.substr(1)),t.innerText="$"+(r-o).toFixed(2),n.innerText="$"+(Number(t.innerText.substr(1))*(1-s/100)).toFixed(2),localStorage.setItem("Order",JSON.stringify(l)),0===l.length?I.getBasketEmptyHTML().then(function(e){C.innerHTML=e}):(a.remove(),u.remove());break}}}function o(e){for(var t,n,i,r,o,s,a,u,d=e.target,l=Number(d.value),c=d.getAttribute("id"),m=d.parentNode.parentNode.parentNode,p=m.getAttribute("data-id"),f=m.getAttribute("data-id-course"),h=d.parentNode.parentNode.nextSibling.nextSibling.childNodes,g=JSON.parse(localStorage.getItem("Order")),v=0,P=g.length;v<P;v++)Number(g[v].idCourse)===Number(f)&&g[v].dish.id===Number(p)&&("pint"===c?(t=g[v].dish.sPrice||g[v].dish.lPrice,n=g[v].dish.sPortionQuant*t,u=h[1],g[v].dish.sPortionQuant=l):"quart"===c&&(t=g[v].dish.lPrice,n=g[v].dish.lPortionQuant*t,u=h[3],g[v].dish.lPortionQuant=l),r=t*l,u.innerHTML="$"+r.toFixed(2),localStorage.setItem("Order",JSON.stringify(g)),i=document.getElementById("dollars"),o=document.getElementById("discDollars"),s=document.getElementById("discount"),a=s.innerText.substr(1,s.innerText.length-2),i.innerText="$"+(Number(i.innerText.substr(1))+(r-n)).toFixed(2),o.innerText="$"+(Number(i.innerText.substr(1))*(1-a/100)).toFixed(2))}function s(e){var t=e.target;return"brand-name"===t.id?t=t.parentNode.parentNode.parentNode.parentNode:"logo-img"===t.id?t=t.parentNode.parentNode.parentNode:"SPAN"===t.tagName&&(t=t.parentNode),t}function a(){var e=window.innerWidth;e<768&&$("#collapsable-nav").collapse("hide")}function u(e){var t;if(e){var n=e.target;t=n.previousElementSibling.value,""!==t&&(w=t)}B.sendEmail(w).then(function(e){0!==JSON.parse(e).length?Promise.all([B.getHistoryHTML(),B.getHistoryHeaderHTML(),B.getHistoryFooterHTML(),B.getHistorySearchHTML(),Q()]).then(function(t){C.innerHTML=J(JSON.parse(e),t[0],t[1],t[2],t[3]),document.getElementById("historyEmail").value=w,console.log(document.getElementById("pint").textContent);for(var n=document.getElementsByClassName("quantityHist"),i=0,r=n.length;i<r;i++)""==n[i].textContent&&(n[i].parentNode.style.display="none");var o=document.getElementById("historyButton");o.addEventListener("click",u,!0)}):Promise.all([B.getHistorySearchHTML(),B.getHistoryEmptyHTML()]).then(function(e){var t="<div id='history'>";t+=e[0],t+=e[1],t+="</div>",C.innerHTML=t;var n=document.getElementById("historyButton");n.addEventListener("click",u,!0)})})}function d(){var e;"ontransitionstart"in window?($("#modalForm").one("transitionstart",N),e=$("#modalForm"),e.addClass("appear")):($("#modalForm").css("display","block"),e=$("#modalForm"),setTimeout(function(){e.addClass("appear")},300));var t=$("#modalClose"),n=$("#overlay"),i=$("body"),r=$("#eMail"),o=$("#timeDelivery"),s=$("#addressD"),a=$(".ui-timepicker-list"),u=$("#eMailDiv"),d=$("#eMailError"),m=new Date,g=m.getHours(),H=m.getMinutes(),T=$("#wishes");i.addClass("modal-open"),r.val(""),o.val(""),s.val(""),T.val(""),H=H>30?30:"00";var w=g-11+":"+H+"pm";o.timepicker({minTime:w,maxTime:"24:00pm"}),o.click(function(){a.css("display","block")}),n.fadeIn(400),t.click(v),n.click(v),$("#sendButton").click(function(){var t=r.val(),m=o.val(),g=s.val(),v=T.val();0===t.length&&(u.addClass("submitted"),u.attr("data-email","Please, enter e-mail"),d.addClass("submitted"),d.text("Please, enter e-mail"),r.addClass("submitted"),r.one("input",p)),0===m.length&&($("#timeDiv").addClass("submitted"),o.addClass("submitted"),$("#timeError").addClass("submitted"),o.one("change",f)),0===g.length&&($("#addressDiv").addClass("submitted"),s.addClass("submitted"),$("#addressError").addClass("submitted"),s.one("input",h));var N=$(".ui-timepicker-wrapper").css("display");if("block"!==N&&(0===t.length||y(t)||(u.addClass("submitted"),d.addClass("submitted"),r.addClass("submitted"),u.attr("data-email","Wrong e-mail"),d.text("Wrong e-mail"),r.one("input",p)),0!==t.length&&y(t)&&0!==m.length&&0!==g.length)){P(),e.one("transitionend",b),n.fadeOut(400),i.removeClass("modal-open"),a.css("display","none");for(var H,w,E=JSON.parse(localStorage.getItem("Order")),k=[],M=0,S=E.length;M<S;M++)w={},w.idCourse=E[M].idCourse,w.idDish=E[M].dish.id,w.lPortionQuant=E[M].dish.lPortionQuant,w.sPortionQuant=E[M].dish.sPortionQuant,k.push(w);H={dishes:k,email:t,time:m,address:g,wishes:v,price:l(k),discount:L},Promise.all([x(JSON.stringify(c("processNewOrder",H)))]).then(function(e){console.log(e[0]),localStorage.setItem("Order","[]"),I.getBasketEmptyHTML().then(function(e){C.innerHTML=e})})}})}function l(e){for(var t,n,i,r=0,o=0,s=e.length;o<s;o++)t=q(e[o].idCourse,e[o].idDish),n=null!==t.sPrice?t.sPrice*e[o].sPortionQuant:t.lPrice*e[o].sPortionQuant,i=null!==t.lPrice?t.lPrice*e[o].lPortionQuant:0,r+=n+i;return(r*(1-Number(L)/100)).toFixed(2)}function c(e,t){return{jsonrpc:"2.0",method:e,params:JSON.stringify(t),id:m()}}function m(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0,n="x"===e?t:3&t|8;return n.toString(16)})}function p(){$("#eMailDiv").removeClass("submitted"),$("#eMail").removeClass("submitted"),$("#eMailError").removeClass("submitted")}function f(){$("#timeDiv").removeClass("submitted"),$("#timeDelivery").removeClass("submitted"),$("#timeError").removeClass("submitted")}function h(){$("#addressDiv").removeClass("submitted"),$("#addressD").removeClass("submitted"),$("#addressError").removeClass("submitted")}function g(e){e.target.setCustomValidity(" ")}function v(){var e=$("#modalForm");e.removeClass("appear"),e.one("transitionend",b),$("#overlay").fadeOut(400),$("body").removeClass("modal-open"),P(),$(".ui-timepicker-list").css("display","none")}function P(){$("#eMailDiv").removeClass("submitted"),$("#eMail").removeClass("submitted"),$("#timeDiv").removeClass("submitted"),$("#timeDelivery").removeClass("submitted"),$("#addressD").removeClass("submitted"),$("#addressDiv").removeClass("submitted"),$("#eMailError").removeClass("submitted"),$("#timeError").removeClass("submitted"),$("#addressError").removeClass("submitted"),$("#modalForm").removeClass("appear")}function y(e){var t=/\S+@\S+\.\S+/;return t.test(e)}function b(){$("#modalForm").css("display","none"),$("#sendButton").unbind("click"),$("#modalClose").unbind("click"),$("#overlay").unbind("click")}function N(){$("#modalForm").css("display","block")}function x(e){return new Promise(function(t,n){k.sendSocketRequest(e,function(e){t(e)})})}var H="snippets/home-snippet.html",T=document.getElementById("container"),C=document.getElementById("main-content"),L=0,w="";e.prototype=Object.create(Array.prototype,{constructor:{value:e}});var E=new e,k=new RestaurantAPI,M=new CourseHtml,S=new DishHtml,I=new BasketHtml,B=new HistoryHtml;T.addEventListener("click",n,!1);var R=function(e){k.sendGetRequest(e,function(e){C.innerHTML=e})};R(H),$("#navbarToggle").blur(function(e){setTimeout(a,10)});var Q=function(){return 0!==E.length?E:new Promise(function(e,t){k.sendGetRequest("/menu",function(t){var n=D(JSON.parse(t));e(n)})})},D=function(e){for(var t=0,n=e.length;t<n;t++){var i=new Course(e[t].id,e[t].short_name,e[t].name,e[t].special_instructions,e[t].menu_items);E.push(i)}return E},O=function(e){var t;if(0!==E.length){if("function"==typeof E.findIndex)t=E.findIndex(function(t){return t.id===e});else for(var n=0,i=E.length;n<i;n++)if(E[n].id===e){t=n;break}if(t>=0)return E[t].items}},q=function(e,t){if(0!==E.length){var n=E.findIndex(function(t){return t.id===Number(e)});if(n>=0){var i=E[n].items;if(n=i.findIndex(function(e){return e.id===Number(t)}),n>=0)return i[n]}}},F=function(e,t){for(var n="<section id='section' class='row'>",i=0,r=e.length;i<r;i++){var o=t;o=W(o,"name",e[i].name),o=W(o,"shortName",e[i].sName),n+=o}return n+="</section>"},A=function(e,t,n,i){n=W(n,"name",e.name),n=W(n,"specialInstructions",e.spInstruc);var r=n;r+="<section class='row'>";for(var o=0,s=t.length;o<s;o++){var a=i;a=W(a,"id",t[o].id),a=W(a,"idCourse",e.id),a=W(a,"shortName",t[o].sName),a=W(a,"catShortName",e.sName),a=_(a,"priceSmall",t[o].sPrice),a=j(a,"smallPortionName",t[o].sPortionName),a=_(a,"priceLarge",t[o].lPrice),a=j(a,"largePortionName",t[o].lPortionName),a=W(a,"name",t[o].name),a=W(a,"description",t[o].description),o%2!==0&&(a+="<div class='clearfix visible-lg-block visible-md-block'></div>"),r+=a}return r+="</section>",r+="<input type='button' id='basketButton' value='To Basket'>"},G=function(e,t,n,i){var r='<h2 class="text-center">Your Order</h2>';r+="<section id='section' class='row'>";for(var o,s,a,u,d=0,l=0,c=i.length;l<c;l++)if(o=E[i[l].idCourse-1],s=i[l].dish){var m=e;m=W(m,"id",s.id),m=W(m,"idCourse",o.id),m=W(m,"name",s.name),m=W(m,"shortName",s.sName),m=_(m,"priceSmall",s.sPrice),m=j(m,"smallPortionName",s.sPortionName),m=_(m,"priceLarge",s.lPrice),m=j(m,"largePortionName",s.lPortionName),m=W(m,"catShortName",o.sName),m=W(m,"smallPortionQuantity",s.sPortionQuant),m=W(m,"largePortionQuantity",s.lPortionQuant),a=s.sPortionQuant*(null===s.sPrice?s.lPrice:s.sPrice),u=s.lPortionQuant*(null===s.lPrice?0:s.lPrice),d+=a+u,m=_(m,"smallPortionTotal",a),null===s.sPrice?(m=W(m,"vis","hidden"),m=W(m,"largePortionTotal","")):m=_(m,"largePortionTotal",u),r+=m}return r+="</section>",d>0&&(t=W(t,"orderPrice",d.toFixed(2)),t=W(t,"discount",n),t=W(t,"discOrderPrice",(d*(1-n/100)).toFixed(2)),r+=t),r},J=function(e,t,n,i,r){var o=r;o+="<h2 class='text-center'>Your History</h2>",o+="<section id='section' class='row'>";for(var s,a,u,d,l,c,m,p=0,f="",h=0,g=e.length;h<g;h++){s=e[h].dishes,a=e[h].date,u=e[h].status,d=Number(e[h].price),m=Number(e[h].discount),f+=n,f=W(f,"date",a),f=W(f,"status",u);for(var v=0,P=s.length;v<P;v++){var y=q(Number(s[v].idCourse),Number(s[v].idDish)),b=X(Number(s[v].idCourse));f+=t,f=W(f,"id",y.id),f=W(f,"idCourse",b.id),f=W(f,"name",y.name),f=W(f,"shortName",y.sName),f=_(f,"priceSmall",y.sPrice),f=j(f,"smallPortionNamePrice",y.sPortionName),f=j(f,"largePortionNamePrice",y.lPortionName),f=_(f,"priceLarge",y.lPrice),f=W(f,"catShortName",b.sName),0===s[v].lPortionQuant?(f=W(f,"largePortionQuantity",""),f=j(f,"largePortionName","")):(f=W(f,"largePortionQuantity",s[v].lPortionQuant),f=j(f,"largePortionName",y.lPortionName)),l=s[v].sPortionQuant*(null===y.sPrice?y.lPrice:y.sPrice),c=s[v].lPortionQuant*(null===y.lPrice?0:y.lPrice),p+=l+c,f=_(f,"smallPortionTotal",l),f=null===y.sPrice?W(f,"largePortionTotal",""):_(f,"largePortionTotal",c),0===s[v].sPortionQuant?(f=W(f,"smallPortionQuantity",""),f=j(f,"smallPortionName","")):(f=W(f,"smallPortionQuantity",s[v].sPortionQuant),f=j(f,"smallPortionName",y.sPortionName))}f+=i,f=W(f,"discount",-m+"%"),f=_(f,"totalPrice",d)}return o+=f,o+="</section>"},_=function(e,t,n){return n?(n="$"+n.toFixed(2),W(e,t,n)):W(e,t," ")},j=function(e,t,n){return n?(n="("+n+")",W(e,t,n)):W(e,t,"")},W=function(e,t,n){var i="{{"+t+"}}";return e=e.replace(new RegExp(i,"g"),n)},X=function(e){var t=0;if(0!==E.length){if("function"==typeof E.findIndex)t=E.findIndex(function(t){return t.id===e});else for(var n=0,i=E.length;n<i;n++)if(E[n].id===e){t=n;break}if(t>=0)return E[t]}},Y=function(e){Promise.all([M.getCourseHTML(),Q(e)]).then(function(e){if(0===e[1].length)M.getCourseEmptyHTML().then(function(e){C.innerHTML=e});else{C.innerHTML=F(e[1],e[0]);var n=document.getElementById("section");n.addEventListener("click",t,!1)}})},V=function(e){Promise.all([S.getDishTitleHTML(),S.getDishHTML(),O(e)]).then(function(t){C.innerHTML=A(X(e),t[2],t[0],t[1]);var n=document.getElementById("basketButton");n.addEventListener("click",i,!1)})},z=function(){var e=JSON.parse(localStorage.getItem("Order"));e&&0!==e.length?Promise.all([I.getBasketHTML(),I.getBasketFooterHTML(),I.getDiscount(),Q()]).then(function(t){C.innerHTML=G(t[0],t[1],t[2],e),L=t[2];var n=document.getElementById("section"),i=document.getElementById("orderButton"),s=document.getElementById("modalForm");s.addEventListener("invalid",g,!0),n.addEventListener("click",r,!1),n.addEventListener("change",o,!1),i.addEventListener("click",d,!1);for(var a=C.getElementsByClassName("quantity"),u=0,l=a.length;u<l;u++)"hidden"===a[u].getAttribute("data-visibility")&&(a[u].style.visibility="hidden")}):I.getBasketEmptyHTML().then(function(e){C.innerHTML=e})},K=function(){B.getHistorySearchHTML().then(function(e){var t="<div id='history'>";t+=e,t+="</div>",C.innerHTML=t;var n=document.getElementById("historyButton");n.addEventListener("click",u,!0)}),""!==w&&u()}});