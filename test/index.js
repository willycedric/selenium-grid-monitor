/**
 * Testing purposes
 */

 //Dependencies
 const request = require('../lib/request');
 const config = require('../lib/config')

 request.get(config.iosBackEnd,'/ios/devices')
 .then((res)=>{
     console.log(res);
 })
 .catch((err)=>{
     console.log('Error ==> ', err );
 })