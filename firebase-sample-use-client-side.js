//How to use: select upload file it will upload sample data


//Sample upload order infomation section
//Sample Order Info
var orderInfoSample = {
    address: "Ban Donnoon",
    customer_name: "Thanongsine",
    payment_method: 0,
    phone: '020 56408739',
    status: 0,
    total_price: 30000,
}

//Sample Order Item Info
var orderItemsSample = [
    {
        amount: 2,
        package_key: '-L5OX_jKq98CVnW0Gqry'
    }
]   

var imgButton = document.getElementById('imgFileButton')
var imgVerifyeButton = document.getElementById('verifyImgFileButton')

//Listen for image file selection 
imgButton.addEventListener('change', function(e) {

    //Get file
    var imgFile = e.target.files[0]
    
    //Create a storage of 
    var storageRef =  firebase.storage().ref('order_images/' + imgFile.name)

    prepareOrderInfo(orderInfoSample, orderItemsSample, storageRef, imgFile)

})

//Listen for verify image file selection 
imgVerifyeButton.addEventListener('change', function(e) {
    var verifyInfo = {
        order_key: '-L5wTGYUuytGYKGsVlyc'
    }

    //Get file
    var imgVerifyFile = e.target.files[0]
    
    //Create a storage of 
    imgVerifyRef = firebase.storage().ref('verify_images/' + imgVerifyFile.name)
    preparePaymentVerifyInfo(verifyInfo, imgVerifyFile, imgVerifyRef)

})

//prepareOrderInfo is use for upload image of each item & add more info to orderItemInfo (img_url & img_name)
function prepareOrderInfo(orderInfo, orderItemInfo, storageRef, file) {
    //Upload file 
    storageRef.put(file).then( snapshot => {
        //Add more info to orderItemInfo
        orderItemInfo.img_url = snapshot.downloadURL
        orderItemInfo.img_name = file.name

        insertOrderFormInfo(orderInfo, orderItemInfo)
    })
}

//insert all order information
function insertOrderFormInfo(orderInfo, orderItemInfo) {

    //insertOrderItems is use for push each item info to database & will return item's key
    const insertOrderItems = new Promise((resolve, reject) => {
        var orderItemKeys = []

        orderItemInfo.map((item, index) => {
            var itemKey = firebase.database().ref().child('order_items').push().key

            insertOrderItemInfo(item, itemKey).then( () => {
                //Save item key
                orderItemKeys.push(itemKey)

                if(index === orderItemInfo.length - 1) {
                    
                    resolve(orderItemKeys)
                    console.log("Push Order Item Info Succcessed");
                }

            }).catch( () => {
                console.log("Push Order Item Info Failed");

            })
            
        })
    })

    //Callback of insertOrderItems will return item's key
    insertOrderItems.then( (itemKeys) => {
        orderInfo.order_item_keys = itemKeys
        orderInfo.time_stamp = firebase.database.ServerValue.TIMESTAMP

        if(itemKeys.length === orderItemInfo.length) {  
            var orderKey = firebase.database().ref().child('order').push().key;

            getLastOrderNumber().then(snapshot => {
                var newOrderNumber = snapshot.val().number + 1
                
                //add order number to order info
                orderInfo.order_number = newOrderNumber

                insertOrderInfo(orderInfo, orderKey).then( () => {
                    console.log("Push Order Info Successed")

                    insertOrderNumber(orderKey, orderInfo.order_number).then( () => {
                        console.log("Push Order Number Successed")

                        insertLastOrderNumber(orderInfo.order_number).then( () => {
                            console.log("Push Last Order Number Successed");
                
                        }).catch( () => {
                            console.log("Push Last Order Number Failed");
                        })

                    }).catch( () => {
                        console.log("Push Order Number Error")

                    })
                                
                }).catch( () => {
                    console.log("Push Order Info Error")
                    
                })
        
            }).catch( () => {
                console.log("Gen Number Order Failed");
        
            })
            
        } else {
            console.log("Push Order Info Failed");
            
        }
        
    });
}


//Sample chheck order status section
// getOrderKeyByOrderNumber(43).then( snapshot => {
//     console.log(snapshot.val().order_key)

//     getOrderByKey(snapshot.val().order_key).then( (snapshot) => {
//         console.log(snapshot.val().status);

//     })
    
// }).catch()


//Sample submit payment info section
preparePaymentVerifyInfo = function(verifyInfo, file, imgVerifyRef) {
    imgVerifyRef.put(file).then( snapshot => {
        verifyInfo.img_url = snapshot.downloadURL

        insertPaymentVerifyInfo(verifyInfo)
        console.log("Upload Verify Info Successed");
        
    })
}



