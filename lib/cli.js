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
const request = require('./request');
const config = require('./config');
//const _data = require('./data');
//const _logs = require('./logs');
//const helpers = require('./helpers');

// Instantiate the cli module object
let cli = {};

//Inputs handlers

e.on('man', (str)=>{
    cli.responders.help();
});

e.on('help', (str)=>{
    cli.responders.help();
});

e.on('exit',(str)=>{
    cli.responders.exit();
});

e.on('list nodes', (str)=>{
    cli.responders.listOfNodes();
});

e.on('list android devices', (str)=>{
    cli.responders.listAndroidDevices();
});
e.on('list ios devices', (str)=>{
    cli.responders.listIosDevices();
});

// Responders object
cli.responders = {};

//Help/Man
cli.responders.help =()=>{
    const commands = {
        'exit':'Kill the CLI',
        'man' : 'Show this help page',
        'help':'Alias of the "man" command',
        'list nodes':'List all the selenium node registered to the grid',
        'list android devices':'List all the android devices plugged to the server',
        'list ios devices':'List all the ios devices plugged to the server'
    };
    cli.horizontalLine();
    console.log(cli.centered('Voluntis Test Monitor Manual'));
    cli.horizontalLine();
    cli.verticalSpace(2);
    // Show each command, followed by its explanation, in white and yellow respectively
    for(var key in commands){
        if(commands.hasOwnProperty(key)){
        var value = commands[key];
        var line = '      \x1b[33m '+key+'      \x1b[0m';
        var padding = 60 - line.length;
        for (i = 0; i < padding; i++) {
            line+=' ';
        }
        line+=value;
        console.log(line);
        cli.verticalSpace();
        }
    }
    cli.verticalSpace(1);

    // End with another horizontal line
    cli.horizontalLine();
}

//Exit
cli.responders.exit = ()=>{
    cli.horizontalLine();
    console.log(cli.centered('\x1b[33m '+'Bye ! ✋✋✋'+'\x1b[0m'));   
    cli.horizontalLine();
    process.exit(0);
}

//List the plugged android devices
cli.responders.listAndroidDevices = ()=>{
    console.log(cli.centered('List of connected android devices.'));
    request.get(config.androidBackEnd,'/Android/devices')
    .then((data)=>{
        //Sanitize the received data
        data = data != {}?data:false;
        if(data){
           
            //Format the list of received devices
            for(const key in data){
                if(data.hasOwnProperty(key)){
                    data[key].forEach((device)=>{
                        //Format the received list for each device
    
                        cli.formatDevice(device, true);
    
                    });
                }
            };
        }else{
            //If the list of plugged devices is empty format an empty message            
            cli.formatDevice({}, true);
        }
    })
    .catch((err)=>{
        debug(err);
    })
    
};

//List all the plugged ios devices
cli.responders.listIosDevices = ()=>{
    console.log(cli.centered('List of connected ios devices.'));
    request.get(config.iosBackEnd,'/ios/devices')
    .then((data)=>{
        //Sanitize the received data
        data = data != {} ?data:false;
        if(data){        
            //Format the list of received devices
                    data.forEach((device)=>{
                        //Format the received list for each device
                        cli.formatDevice(device, false);
                    });
        }else{
            //If the list of plugged devices is empty format an empty message            
            cli.formatDevice({}, true);
        }
    })
    .catch((err)=>{
        debug(err);
    })
    cli.horizontalLine();
};
//Format a device to display it in the terminal
cli.formatDevice = (device, isAndroid)=>{
    cli.horizontalLine();
    device = typeof(device)=='object' && device!={}?device:false;
    isAndroid = typeof(isAndroid)=='boolean'?isAndroid:undefined;
    if(device && isAndroid!=undefined){
        if(isAndroid){
            console.log(`Name: ${device.name}`);            
            console.log(`model: ${device.model}`);            
            console.log(`version: ${device.version}`)            
            console.log(`udid: ${device.id}`);
            cli.verticalSpace();
        }else{
            console.log(`Name: ${device.name}`);                        
            console.log(`model: ${device.productType}`);            
            console.log(`version: ${device.productVersion}`);            
            console.log(`udid: ${device.udid}`);
            cli.verticalSpace();
        }
    }else{
        cli.horizontalLine();
        if(isAndroid){          
            cli.centered('No Android device is connected to the server.');
           
        }else{
            cli.centered('No iOS device is connected to the server.');
        }
        cli.horizontalLine();
    }
    cli.horizontalLine();
};

//List all the nodes 
cli.responders.listOfNodes = ()=>{
    cli.horizontalLine();
    console.log(cli.centered('List of registered web_driver nodes.'));
  //Get all node 
  request.get(config.seleniumBackEnd,'/grid/admin/Console')
  .then((res)=>{    
      res = res!= undefined && res!={}?res:false;
      if(res){
        if(res.hasOwnProperty('nodes')&&res.nodes.length>0){
            res.nodes.forEach((node)=>{
              cli.formatHubNodes(node);
              cli.horizontalLine();
            });
        }else{
            console.log('No Selenium node has been registered to the grid.');
        } 
      }else{
          console.log('Unable to get the list of available web_driver nodes.');
      }       
  })
  .catch((err)=>{
      console.error(err);
      debug(err);
  });
};
//Format the node informations
cli.formatHubNodes =  (node)=>{
    node = typeof(node)=='object' && node!={}?node:false;
    if(node){
        console.log(`\nOS: ${node.os.name}`);
        console.log(`host url: ${node.remoteHost}` );
        //Looping througt the node protocols and only looking for the webdriver 
        //protocol in oder to get the list of available browser
        console.log(`Available browser:  ${(()=>{
            let listOfBrowsers ='';
        //     if(node.protocols.hasOwnProperty('web_driver')){
               
        //     for(const browser in node.protocols['web_driver'].browsers){
                
        //         listOfBrowsers+= browser +" - "+node.protocols['web_driver'].browsers[browser][''][0].capabilities.maxInstances+" ";            
        //     }
        // }
        request.get(config.seleniumBackEnd,'/grid/admin/HubStatServlet/stats')
        .then((res)=>{
            // listOfBrowsers+=JSON.stringify(res);          
            for(const key in res){
                if(res.hasOwnProperty(key)){
                    for(const elt in res[key]){
                        const str =[elt].toString().replace('-null','') +'  -  '+ 'Available: '+(Int.parse(res[key][elt].split(' ')[1]) - Int.parse(res[key][elt].split(' ')[0])).toString() +' In use: '+res[key][elt].split(' ')[0];
                        // Calculate the left padding there should be
                        const leftPadding = 20;
                        // Put in left padded spaces before the string itself
                        let line = '';
                        for (i = 0; i < leftPadding; i++) {
                            line+=' ';
                        }
                        line+= str; 
                      console.log(line);
                       
                    }
                }
            }
        })
        .catch((err)=>{
            debug(err);
        });
        return listOfBrowsers;
    })()}`);
    }
    cli.verticalSpace();
}
// Create a vertical space
cli.verticalSpace = (lines)=>{
    lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
    for (i = 0; i < lines; i++) {
        console.log('');
    }
  };
  
  // Create a horizontal line across the screen
  cli.horizontalLine = ()=>{
  
    // Get the available screen size
    const width = process.stdout.columns;
  
    // Put in enough dashes to go across the screen
    let line = '';
    for (i = 0; i < width; i++) {
        line+='-';
    }
    console.log(line);
  };
  // Create centered text on the screen
  cli.centered = (str)=>{
    str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';
    // Get the available screen size
    const width = process.stdout.columns;
    // Calculate the left padding there should be
    const leftPadding = Math.floor((width - str.length) / 2);
    // Put in left padded spaces before the string itself
    let line = '';
    for (i = 0; i < leftPadding; i++) {
        line+=' ';
    }
    line+= str; 
   return line;
  };

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
      _interface.prompt(true);
    });
  
    // If the user stops the CLI, kill the associated process
    _interface.on('close', ()=>{
      process.exit(0);
    });
  
  };
  
   // Export the module
   module.exports = cli;