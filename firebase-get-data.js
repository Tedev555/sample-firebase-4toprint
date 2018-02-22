
var database = firebase.database();

//Get all order items data
var getAllOrderItems = () => {

    return database.ref('/order_items').once('value')
}

//Get order item by order key
var getOrderItemsByKey = (orderItemKey) => {

    return database.ref('/order_items/' + orderItemKey).once('value')
}

//Get All Orders Data
var getAllOrders = () => {

    return database.ref('/orders').once('value')
}

//Get order data by key
var getOrderByKey = (orderKey) => {

    return database.ref('/orders/' + orderKey).once('value')
}

//Get order key by order number
var getOrderKeyByOrderNumber = (orderNumber) => {

    return database.ref('/order_numbers/' + orderNumber).once('value')
}

var getAllPackages = () => {

    return database.ref('/packages').once('value')
}

var getPackageByKey = (packageKey) => {

    return database.ref('/packages/' + packageKey).once('value')
}

var getPaymentVerifyByKey = (paymentVerifyKey) => {

    return database.ref('/payment_verify/' + paymentVerifyKey).once('value')
}

var getLastOrderNumber = () => {

    return database.ref('/last_order_number').once('value')
}



