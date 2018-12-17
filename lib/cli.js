/**
 * CLI-related tasks
 */

 //Dependencies
const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
class _events extends events{};
const console = require('./console.emoji');
const e = new _events();
const os = require('os');
const v8 = require('v8');
//const _data = require('./data');
//const _logs = require('./logs');
//const helpers = require('./helpers');

// Instantiate the cli module object
let cli = {};

// Responders object
cli.responders = {};

//Input processor
cli.processInput = (str)=>{
    str = typeof(str)=='string' && str.trim().length>0?str.trim():false;
    
    //Only process the input if the user actually wrote something, otherwise ignore it
    if(str){
        //Codify the unique string that identify the different commands handled by the cli
        const uniqueInputs = [
            'man',
            'help',
            'exit',
            'list nodes',
            'list android devices',
            'list ios devices'
        ];
        let matchFound= false;
        debug(`List of handled inputs ${JSON.stringify(uniqueInputs, null, 4)}`);
        //Go throught the possible inputs, emit an event when a match is found
        uniqueInputs.some((input)=>{
            if(str.toLowerCase().indexOf(input) > -1){
                matchFound = true;
                //Emit the event matching the unique input, and include the full string given
                e.emit(input, str);
                debug(` The event ${input} has been trigered with the parameter ${str}.`);
            }
        });
        //If no match is found, tell the user to try again
        if(!matchFound){
            debug(`The input ${str} has no match.`);
            console.poo(`The given command ${str} is not handled, please try again.`);
        }

    }
}

// Init script
cli.init = ()=>{
    
    // Send to console, in dark blue
    console.log('\x1b[34m%s\x1b[0m','Voluntis Test Monitor  CLI is running');
  
    // Start the interface
    var _interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '🦄 >'
    });
  
    // Create an initial prompt
    _interface.prompt(true);
  
    // Handle each line of input separately
    _interface.on('line', (str)=>{
  
      // Send to the input processor
      cli.processInput(str);
  
      // Re-initialize the prompt afterwards
      _interface.prompt();
    });
  
    // If the user stops the CLI, kill the associated process
    _interface.on('close', ()=>{
      process.exit(0);
    });
  
  };
  
   // Export the module
   module.exports = cli;