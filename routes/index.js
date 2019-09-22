// Dependencies
var express = require('express');
var router = express.Router();
const crypto = require('crypto')
const axios = require('axios')


// Random number
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* GET home page. */
router.get('/', function(req, res, next) {

  // Define all parameters required for hash calculation
  let merchantId = '88';
  let paymentRef = rand(0,10000); // Payment reference need to be unique per approved payment.
  let customerRef = ''; // Not required but needs to be defined
  let amount = '10.00';
  let currency = 'eur';
  let test = 'test'; // Test payment
  let secret = '$2a$10$OD4uHABnv/9QcysnuwZxSu'; // Shared secret
  let apiPassword = 'funny'; // API password for Basic Auth
  let hashStr = merchantId+paymentRef+customerRef+amount+currency+test+secret
  // Get the MD5 calculated string
  let hash = crypto.createHash('md5').update(hashStr).digest("hex")

  // URL to API
  let url = 'https://api.nordeaconnect.com/v1/transactions';

  // Created HTTP Client with Basic Auth
  const client = axios.create({
    auth: {
      username: merchantId,
      password: apiPassword
    },
    headers: {
      "Content-Type": "application/json"
    }
  });
  
  // Define order payment data
  let data = {
    process:"false",
    amount:"10.00",
    vat_amount:"0.20",
    currency:"eur",
    payment_ref:paymentRef,
    customer_ref:"",
    hash:hash,
    test:"true",
    success_url:"https://9bacf4e1.ngrok.io/success",
    error_url:"https://9bacf4e1.ngrok.io/fail",
    metadata: {email:"robban.p@gmail.com"}
  }

  //Post the payment order to get the iframe URL
  client.post(url, data)
  .then((trx) => {
    console.log(trx.data.href); // Iframe URL
    //Render view
    res.render('index', { title: 'FunnyShop', hash: hash, link: trx.data.href });
  })
  .catch((error) => {
    console.log(error);
    let errMsg = ''
    try{
      errMsg = error.response.data.name;
    }catch(err){
      errMsg = error;
    }
    res.render('index', { title: 'FunnyShop', hash: hash, error: errMsg });
  })
  ;
});

module.exports = router;
