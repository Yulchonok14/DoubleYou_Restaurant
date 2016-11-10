module.exports = {

    execMethod: function (methodName, params) {
        return new Promise(function (resolve, reject) {
            if (webSocketMethods[methodName]) {
                webSocketMethods[methodName](params)
                    .then(function (res) {
                        resolve(res);
                    })
                    .catch(function (err) {
                        reject(err);
                    })
            } else {
                reject({
                    code: -32601,
                    message: 'method do not exist',
                    data: methodName
                });
            }
        });
    }
};

webSocketMethods = {};

var fs = require('fs'),
    filePathOrder = __dirname + '/orders.json';

webSocketMethods.processNewOrder = function processNewOrder(order){
    var date = new Date();
    return new Promise(function (resolve, reject) {
        fs.readFile(filePathOrder, 'binary', function (err, data) {
            if (err) {
                reject(err);
            }
            var dataArr = JSON.parse(data),
                orderObj = order;
            try {
                orderObj.date = date.toDateString();
                orderObj.status = 'In Process';
            } catch (err){
                reject({
                    code: -32602,
                    message: 'parameter(s) of method processNewOrder is(are) not in right format',
                    data: order
                });
            }
            dataArr.push(orderObj);

            fs.writeFile(filePathOrder, JSON.stringify(dataArr), function (err) {
                if (err) {
                    reject(err);
                }
                resolve(orderObj.email);
            });
        });
    });
};