function insertPackageInfo(packageInfo) {
    var packageKey = firebase.database().ref().child('packages').push().key;
   
    return firebase.database().ref('packages/' + packageKey).set()
}

function insertOrderItemInfo(orderItemInfo, itemKey) {
    
    return firebase.database().ref('order_items/' + itemKey).set(orderItemInfo);
}

function insertOrderInfo(orderInfo, orderKey) {

    return firebase.database().ref('orders/' + orderKey).set(orderInfo)
}

function insertOrderNumber(orderKey, orderNumber) {

    return firebase.database().ref('order_numbers/' + orderNumber).set({
        order_key: orderKey,
    })
}

function insertLastOrderNumber(lastOrderNumber) {

    return firebase.database().ref('/last_order_number').update({
        number: lastOrderNumber,
    })
}

function insertPaymentVerifyInfo(verifyInfo) {
    var payment_verify_key = firebase.database().ref().child('payment_verify').push().key

    //Push payment verify info
    firebase.database().ref('payment_verify/' + payment_verify_key).set(verifyInfo).then( () => {
        console.log('order_key', verifyInfo.order_key);
        
        //Update payment verify key to order info
        firebase.database().ref('/orders/' + verifyInfo.order_key + '/payment_verify_key').transaction( currentData => {

                return {key: payment_verify_key}

            }, (error, committed, snapshot) => {
                if (error) {
                    console.log('Transaction failed abnormally!', error);
                  } else if (!committed) {
                    console.log('We aborted the transaction (because data already exists).');
                  } else {
                    console.log('Order data added!');
                  }
                  console.log("Order's data: ");
            })
    })
}








