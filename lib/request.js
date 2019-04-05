/**
 * Http request utility
 */

 //Dependencies
const http = require('http');
 const util = require('util');
 const debug = util.debuglog('cli');
 const helpers = require('./helpers');

 //Container

 request = {};
 //HTTP Get request 
request.get = (hostname,path)=>{
    return new Promise((resolve, reject)=>{
        hostname == typeof(hostname)=='string'&& hostname.length>0?hostname:false;
        const port = hostname.split(':').length>0?hostname.split(':')[1]:80;
        debug(`Request target the port ${port} on the host ${hostname}.`);
        path == typeof(path)=='string' && path.length>0?path:''
        if(hostname){
            const options = {
                'protocol':'http:',
                'hostname':hostname.split(':').length>0?hostname.split(':')[0]:hostname,
                port,
                'method':'GET',
                path,
                'headers':{
                    'Content-Type':'application/json',
                    "Access-Control-Allow-Origin": "*",
                }
            };
            //instantiate the request object
            const req = http.request(options, (res)=>{
                //Grab the status of the sent request
                const status = res.statusCode;                
                if(status >=200&&status<400)
                {                  
                    res.on('data', (data)=>{
                        resolve(helpers.parseJsonToObject(data));
                    });
                }else{                   
                    reject(false);
                }
            });
            //Bind the error event so it doesn't get thrown
            req.on('error',(e)=>{
                resolve(e);
            });
            //End the request
            req.end();
        }else{
            reject({'Error':'Hostname not defined.'});
        }  
    });   
};



 //Exports the module
 module.exports = request;