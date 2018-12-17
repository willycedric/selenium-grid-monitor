/*
 * Primary file for API
 *
 */

 //Dependencies
 const cli = require('./lib/cli');

 //Declare the app
 let app = {};

 //Init function
 app.init =()=>{

    //Start the cli
    cli.init();
 }

 //Self invoking only if required directly
 if(require.main === module){
     app.init(()=>{

     });
 }

 //Export the app
 module.exports = app